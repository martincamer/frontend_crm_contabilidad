import { useEffect } from "react";
import { useEmpleado } from "../../context/EmpleadosContext";
import { useForm } from "react-hook-form";
import { Submit } from "../ui/Submit";
import { SelectInput } from "../ui/SelectInput";
import dayjs from "dayjs";
import instance from "../../api/axios";
import { FormInput } from "../ui/FormInput";

export const ModalGuardarAguinaldo = () => {
  const { handleSubmit, reset, register } = useForm();

  const { empleados, getEmpleados } = useEmpleado();

  useEffect(() => {
    getEmpleados();
  }, []);

  const onSubmit = async (formData) => {
    let reciboData = {
      ...formData,
      empleados: empleados,
      date: dayjs.utc(formData.date).format(),
    };

    try {
      await instance.post("/empleados-datos-aguinaldo", reciboData);

      reset();

      document.getElementById("my_modal_guardar_aguinaldo").close();
    } catch (error) {
      console.error("Error creating receipt:", error);
    }
  };
  return (
    <dialog id="my_modal_guardar_aguinaldo" className="modal">
      <div className="modal-box rounded-none w-full max-w-md scroll-bar">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b py-4 text-left">
            Guardar el aguinaldo pagado, solo guardar una vez por aguinaldo.
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <SelectInput
            props={{
              ...register("mes"),
            }}
            labelText={"Seleccionar el mes del aguinaldo a guardar"}
          >
            <option className="font-bold text-blue-600">
              Seleccionar el mes
            </option>
            <option className="font-semibold capitalize" value={"junio"}>
              Junio
            </option>
            <option className="font-semibold capitalize" value={"diciembre"}>
              Diciembre
            </option>
          </SelectInput>
          <FormInput
            labelText={"Fecha de pago"}
            type={"date"}
            props={{
              ...register("fecha_de_pago"),
            }}
          />
          <Submit type={"submit"}>Guardar datos del aguinaldo</Submit>
        </form>
      </div>
    </dialog>
  );
};
