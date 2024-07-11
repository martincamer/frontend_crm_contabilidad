import React, { useEffect, useState } from "react";
import { Submit } from "../ui/Submit";
import { SelectInput } from "../ui/SelectInput";
import { useForm } from "react-hook-form";
import { useEmpleado } from "../../context/EmpleadosContext";
import dayjs from "dayjs";

export const ModalComprobante = ({ idObtenida }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { getEmpleado, crearRecibo, empleados } = useEmpleado();
  const [empleado, setEmpleado] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getEmpleado(idObtenida);
        setEmpleado(res);
      } catch (error) {}
    }
    loadData();
  }, [idObtenida, empleados]);

  const termino_pago = watch("termino_pago");

  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
  };

  const antiquity = calculateAntiquity(empleado?.fecha_ingreso);

  let total_antiguedad = 0;

  const onSubmit = async (formData) => {
    try {
      let reciboData = {
        ...formData,
        fecha_ingreso: empleado.fecha_ingreso,
        antiguedad_total:
          termino_pago === "sueldo"
            ? (total_antiguedad =
                Number(empleado?.sueldo[0]?.sueldo_basico) *
                (0.01 * antiquity?.years))
            : (Number(empleado?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco) +
                Number(
                  empleado?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte
                )) *
              (0.01 * antiquity.years),
        date: dayjs.utc(formData.date).format(),
      };

      // Determinar el tipo de pago y ajustar los datos del recibo
      if (empleado?.termino_pago === "quincenal") {
        const quincenaSeleccionada =
          termino_pago === "quincena_cinco"
            ? empleado?.sueldo[0]?.quincena_cinco[0]
            : empleado?.sueldo[1]?.quincena_veinte[0];
        reciboData = {
          ...reciboData,
          recibo: quincenaSeleccionada,
        };
      } else if (empleado?.termino_pago === "mensual") {
        reciboData = {
          ...reciboData,
          recibo: empleado?.sueldo[0],
        };
      }

      await crearRecibo(idObtenida, reciboData);

      // Cerrar el modal y limpiar el formulario
      document.getElementById("my_modal_nuevo_comprobante").close();
      // document.getElementById("my_modal_comprobante").showModal();
      document.getElementById("my_modal_cobrado").showModal();

      reset();
    } catch (error) {
      console.error("Error creating receipt:", error);
    }
  };

  return (
    <dialog id="my_modal_nuevo_comprobante" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Generar comprobante de pago
          </h3>
        </div>

        {/* Mostrar nombre del empleado seleccionado */}
        <div className="mt-5 bg-blue-500 py-5 px-5 text-white font-medium">
          Empleado seleccionado{" "}
          <span className="font-extrabold capitalize">
            {empleado?.nombre} {empleado?.apellido}
          </span>
        </div>

        {/* Formulario para seleccionar el tipo de pago y enviar */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <div className="mt-5 flex">
            {empleado?.termino_pago === "quincenal" ? (
              <SelectInput
                props={{
                  ...register("termino_pago", {
                    required: true,
                  }),
                }}
                labelText={"Seleccionar quincena"}
              >
                {" "}
                <option className="font-bold text-blue-500">
                  Seleccionar obligatorio
                </option>
                <option value={"quincena_cinco"} className="font-semibold">
                  Quincena del cinco
                </option>
                <option value={"quincena_veinte"} className="font-semibold">
                  Quincena del veinte
                </option>
              </SelectInput>
            ) : (
              <SelectInput
                props={{
                  ...register("termino_pago", {
                    required: true,
                  }),
                }}
                labelText={"Seleccionar mensual"}
              >
                <option className="font-bold text-blue-500">
                  Seleccionar obligatorio
                </option>
                <option value={"sueldo"} className="font-semibold">
                  Sueldo
                </option>
              </SelectInput>
            )}
          </div>
          <Submit type={"submit"}>Generar comprobante de pago</Submit>
        </form>
      </div>
    </dialog>
  );
};
