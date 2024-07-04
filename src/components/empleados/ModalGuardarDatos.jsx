import React, { useEffect } from "react";
import { Submit } from "../ui/Submit";
import { useForm } from "react-hook-form";
import { useEmpleado } from "../../context/EmpleadosContext";
import dayjs from "dayjs";

export const ModalGuardarDatos = () => {
  const { handleSubmit, reset } = useForm();

  const { createEmpleadoDatos, empleados, getEmpleados } = useEmpleado();

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
      await createEmpleadoDatos(reciboData);

      document.getElementById("my_modal_guardar_datos").close();
      reset();
    } catch (error) {
      console.error("Error creating receipt:", error);
    }
  };

  return (
    <dialog id="my_modal_guardar_datos" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b py-4 text-left">
            Guardar datos de los empleados, solo guardar una vez por mes en el
            cirre del mes.
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <Submit type={"submit"}>Guardar datos de los empleados</Submit>
        </form>
      </div>
    </dialog>
  );
};
