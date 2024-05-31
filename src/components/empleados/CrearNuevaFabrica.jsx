import React, { useEffect } from "react";
import { useEmpleado } from "../../context/EmpleadosContext";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

export const CrearNuevaFabrica = () => {
  const { createFabricas, fabricas, getFabricas } = useEmpleado();

  const { register, handleSubmit, reset } = useForm();

  // getFabricas
  useEffect(() => {
    getFabricas();
  }, []);

  // onSubmit
  const onSubmit = async (formData) => {
    try {
      const datos = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
      };

      await createFabricas(datos);

      document.getElementById("my_modal_crear_fabrica").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_crear_fabrica" className="modal">
      <div className="modal-box rounded-none max-w-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form
          className="flex flex-col gap-2 py-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="flex flex-col gap-2">
            <span className="font-bold">Nombre de la fabrica</span>
            <input
              className="text- bg-blue-100/20 placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 focus:border-blue-500 transition-all outline-none border border-gray-200 capitalize text-sm"
              type="text"
              {...register("nombre", { required: true })}
            />
          </label>

          <div>
            <button
              className="bg-blue-500 py-3 px-8 text-sm rounded-full font-semibold text-white mt-3 hover:bg-orange-500 transition-all cursor-pointer"
              type="submit"
            >
              Crear nueva fabrica
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <p className="text-blue-500 font-semibold border-b border-blue-500">
              Sectores creados
            </p>

            <div className="grid grid-cols-3 gap-2">
              {fabricas.map((s) => (
                <p
                  className="border py-1 px-2 border-blue-500 text-sm font-semibold capitalize"
                  key={s._id}
                >
                  <span>{s.nombre}</span>
                </p>
              ))}
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};
