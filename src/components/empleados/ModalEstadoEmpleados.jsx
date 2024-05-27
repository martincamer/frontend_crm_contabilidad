import React, { useEffect } from "react";
import { Submit } from "../ui/Submit";
import { SelectInput } from "../ui/SelectInput";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useEmpleado } from "../../context/EmpleadosContext";

export const ModalEstadoEmpleados = ({ idObtenida }) => {
  const { updateEmpleadoEstado, getEmpleado } = useEmpleado();

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    async function loadData() {
      const res = await getEmpleado(idObtenida);

      setValue("estado", res?.estado);
    }

    loadData();
  }, [idObtenida]);

  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const estadoData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
      };

      await updateEmpleadoEstado(idObtenida, estadoData);

      document.getElementById("my_modal_editar_estado_empleado").close();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_editar_estado_empleado" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Cambiar el estado del empleado
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <div className="flex flex-col gap-3">
            <SelectInput
              labelText={"Estado del empleado"}
              props={{ ...register("estado", { required: true }) }}
            >
              <option className="font-bold">Seleccionar el estado</option>
              <option value={"trabajando"} className="font-bold">
                Trabajando
              </option>
              <option value={"enfermo"} className="font-bold">
                Enfermo
              </option>
              <option value={"reposo"} className="font-bold">
                Reposo
              </option>
              <option value={"accidentado"} className="font-bold">
                Accidentado
              </option>
              <option value={"despedido"} className="font-bold">
                Despedido
              </option>
            </SelectInput>
          </div>
          <Submit type={"submit"}>Guardar el estado</Submit>
        </form>
      </div>
    </dialog>
  );
};
