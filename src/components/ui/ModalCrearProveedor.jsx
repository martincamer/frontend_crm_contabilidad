import { useForm } from "react-hook-form";
import { useProveedor } from "../../context/ProveedoresContext";
import { Submit } from "./Submit";
import { FormInput } from "./FormInput";
import dayjs from "dayjs";

export const ModalCrearProveedor = () => {
  const { createProveedor } = useProveedor();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const productData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
      };

      await createProveedor(productData);

      document.getElementById("my_modal_proveedor").close();
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_proveedor" className="modal">
      <div className="modal-box rounded-none max-w-md">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm text-gray-700 border-b pb-2 text-left">
            Crear empresa/proveedor
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <FormInput
            labelText={"Razon social/nombre de la empresa"}
            placeholder={"Escribe el nombre de la empresa"}
            props={{ ...register("nombre", { required: true }) }}
            type={"text"}
          />

          <Submit type={"submit"}>Guardar proveedor</Submit>
        </form>
      </div>
    </dialog>
  );
};
