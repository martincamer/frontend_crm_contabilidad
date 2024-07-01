import React from "react";
import { Submit } from "../ui/Submit";
import { FormInput } from "../ui/FormInput";
import { useForm } from "react-hook-form";
import { useBancoCheque } from "../../context/BancoChequesContext";
import dayjs from "dayjs";

export const ModalCrearBancoCheque = () => {
  const { createBanco } = useBancoCheque();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const cajaData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
      };

      await createBanco(cajaData);

      document.getElementById("my_modal_crear_banco_cheque").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_crear_banco_cheque" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Crear nuevo banco
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <div className="flex flex-col gap-3">
            <FormInput
              labelText={"Nombre"}
              placeholder={"Escribe el nombre del banco"}
              props={{ ...register("nombre", { required: true }) }}
              type={"text"}
            />
            <FormInput
              labelText={"Localidad del bnaco"}
              placeholder={"Escribe el nombre de la localidad"}
              props={{ ...register("localidad", { required: true }) }}
              type={"text"}
            />
            <FormInput
              labelText={"Provincia del bnaco"}
              placeholder={"Escribe el nombre de la provincia"}
              props={{ ...register("provincia", { required: true }) }}
              type={"text"}
            />
          </div>
          <Submit type={"submit"}>Guardar el banco</Submit>
        </form>
      </div>
    </dialog>
  );
};
