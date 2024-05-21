import React, { useEffect } from "react";
import { Submit } from "../ui/Submit";
import { SelectInput } from "../ui/SelectInput";
import { useForm } from "react-hook-form";
import { useIngreso } from "../../context/IngresosContext";
import dayjs from "dayjs";

export const ModalEstado = ({ idObtenida }) => {
  const { updateIngresoEstado, getIngreso } = useIngreso();

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    async function loadData() {
      const res = await getIngreso(idObtenida);

      setValue("estado", res.estado);
    }

    loadData();
  }, [idObtenida]);

  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const cajaData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
      };

      await updateIngresoEstado(idObtenida, cajaData);

      document.getElementById("my_modal_editar_estado").close();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  console.log("id", idObtenida);

  return (
    <dialog id="my_modal_editar_estado" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Cambiar el estado del gasto
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <div className="flex flex-col gap-3">
            <SelectInput
              labelText={"Estado del gasto"}
              props={{ ...register("estado", { required: true }) }}
            >
              <option className="font-bold">Seleccionar el estado</option>
              <option value={"pendiente"} className="font-bold">
                Pendiente
              </option>
              <option value={"rechazado"} className="font-bold">
                Rechazado
              </option>
              <option value={"aceptado"} className="font-bold">
                Aceptado
              </option>
            </SelectInput>
          </div>
          <Submit type={"submit"}>Guardar el estado</Submit>
        </form>
      </div>
    </dialog>
  );
};
