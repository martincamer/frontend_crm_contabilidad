import React, { useEffect } from "react";
import { useEmpleado } from "../../context/EmpleadosContext";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

export const ModalSeleccionarQuincena = () => {
  const { getEmpleados, getFabricas, fabricas, empleados } = useEmpleado();

  const { register, handleSubmit, reset } = useForm();

  // getFabricas
  useEffect(() => {
    getEmpleados();
    getFabricas();
  }, []);

  console.log(empleados);

  return (
    <dialog id="my_modal_seleccionar_quincena" className="modal">
      <div className="modal-box rounded-none max-w-md">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div>
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold text-xs text-gray-700">
              Seleccionar fabrica a pagar
            </label>
            <select className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-bold">
              {fabricas.map((f) => (
                <option value="">{f.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </dialog>
  );
};
