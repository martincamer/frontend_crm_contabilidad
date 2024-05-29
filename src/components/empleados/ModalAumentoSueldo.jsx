import React from "react";
import { useEmpleado } from "../../context/EmpleadosContext";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

export const ModalAumentoSueldo = () => {
  const { aumentarSueldo } = useEmpleado();

  const { register, handleSubmit, reset, watch } = useForm();

  const termino_pago = watch("termino_pago");

  const onSubmit = async (formData) => {
    try {
      console.log("Datos enviados al backend:", formData);

      const datos = {
        ...formData,
        // date: dayjs.utc(formData.date).format(),
      };

      await aumentarSueldo(datos);

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_aumento_sueldo" className="modal">
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
          <label className="flex gap-2 items-center">
            <span className="font-bold">Fábrica</span>
            <select
              className="text-sm bg-white placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 focus:border-blue-500 transition-all outline-none border border-gray-200 capitalize"
              type="text"
              {...register("fabrica", { required: true })}
            >
              <option value="">Seleccionar fabrica</option>
              <option value="marcos ciani 255">Marcos ciani 255</option>
              <option value="long">Long</option>
            </select>
          </label>
          <label className="flex gap-2 items-center">
            <span className="font-bold">Termino de pago</span>
            <select
              className="text- bg-white placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 focus:border-blue-500 transition-all outline-none border border-gray-200 capitalize text-sm"
              {...register("termino_pago", { required: true })}
            >
              <option value="mensual">Mensual</option>
              <option value="quincenal">Quincenal</option>
            </select>
          </label>
          <label className="flex gap-2 items-center">
            <span className="font-bold">Aumento</span>
            <input
              className="text- bg-white placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 focus:border-blue-500 transition-all outline-none border border-gray-200 capitalize text-sm"
              type="text"
              {...register("aumento", { required: true })}
            />
          </label>
          {termino_pago === "quincenal" && (
            <div>
              <label className="flex gap-2 items-center">
                <span className="font-bold">Tipo de quincena</span>
                <select
                  className="text- bg-white placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 focus:border-blue-500 transition-all outline-none border border-gray-200 capitalize text-sm"
                  {...register("tipo_quincena", { required: true })}
                >
                  <option value="">Seleccionar tipo de quincena</option>
                  <option value="quincena_cinco">Quincena del 5</option>
                  <option value="quincena_veinte">Quincena del 20</option>
                </select>
              </label>
            </div>
          )}
          <div>
            <button
              className="bg-blue-500 py-3 px-8 text-sm rounded-full font-semibold text-white mt-3 hover:bg-orange-500 transition-all cursor-pointer"
              type="submit"
            >
              Aumentar Sueldo
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
