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

      document.getElementById("my_modal_4").close();
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm text-gray-700 border-b pb-2 text-left">
            Crear empresa
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              labelText={"Razon social/Nombre"}
              placeholder={"Escribe el nombre de la empresa"}
              props={{ ...register("nombre", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Telefono"}
              placeholder={"Escribe el telefono"}
              props={{ ...register("telefono", { required: true }) }}
              type={"tel"}
            />

            <FormInput
              labelText={"Dirección"}
              placeholder={"Escribe la dirección"}
              props={{ ...register("direccion", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Provincia"}
              placeholder={"Escribe la provincia"}
              props={{ ...register("provincia", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Localidad"}
              placeholder={"Escribe la localidad"}
              props={{ ...register("localidad", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Codigo postal"}
              placeholder={"Escribe el cp"}
              props={{ ...register("cp", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Pais"}
              placeholder={"Escribe el país"}
              props={{ ...register("pais", { required: true }) }}
              type={"text"}
            />

            <div className="flex flex-col gap-1 w-full">
              <label className="font-semibold text-xs text-gray-700">
                Observaciones
              </label>
              <textarea
                {...register("observaciones", { required: true })} // Registro del campo con validación
                type="text"
                placeholder="Escribe la observacion"
                className="capitalize border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
              />
            </div>
          </div>
          <Submit type={"submit"}>Guardar proveedor</Submit>
        </form>
      </div>
    </dialog>
  );
};
