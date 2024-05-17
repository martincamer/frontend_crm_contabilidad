import { useForm } from "react-hook-form";
import { useCategoria } from "../../context/CategoriasContext";
import { Submit } from "./Submit";
import dayjs from "dayjs";
import { FormInput } from "./FormInput";

export const ModalCrearCategoria = () => {
  const { createCategoria } = useCategoria();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const productData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
      };

      await createCategoria(productData);

      document.getElementById("my_modal_3").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Crear nueva categoría
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <div className="flex flex-col gap-3">
            <FormInput
              labelText={"Nombre"}
              placeholder={"Escribe el nombre de la categoria"}
              props={{ ...register("nombre", { required: true }) }}
              type={"text"}
            />
            <div className="flex flex-col gap-1 w-full">
              <label className="font-semibold text-xs text-gray-700">
                Observaciones
              </label>
              <textarea
                {...register("observacion", { required: true })} // Registro del campo con validación
                type="text"
                placeholder="Escribe la observacion"
                className="capitalize border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
              />
            </div>
          </div>
          <Submit type={"submit"}>Guardar la categoria</Submit>
        </form>
      </div>
    </dialog>
  );
};
