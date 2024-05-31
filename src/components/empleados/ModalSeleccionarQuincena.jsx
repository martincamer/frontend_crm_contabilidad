import React, { useEffect, useState } from "react";
import { useEmpleado } from "../../context/EmpleadosContext";

export const ModalSeleccionarQuincena = () => {
  const { getEmpleados, getFabricas, fabricas, empleados } = useEmpleado();

  // getFabricas
  useEffect(() => {
    getEmpleados();
    getFabricas();
  }, []);

  const [selectedFabrica, setSelectedFabrica] = useState("");
  const [selectedTerminoPago, setSelectedTerminoPago] = useState("");
  const [selectedQuincena, setSelectedQuincena] = useState("");

  // Manejar el cambio de selección de fábrica
  const handleFabricaChange = (e) => {
    setSelectedFabrica(e.target.value);
  };

  // Manejar el cambio de selección de término de pago
  const handleTerminoPagoChange = (e) => {
    setSelectedTerminoPago(e.target.value);
    // Resetear la selección de quincena al cambiar el término de pago
    setSelectedQuincena("");
  };

  // Manejar el cambio de selección de quincena
  const handleQuincenaChange = (e) => {
    setSelectedQuincena(e.target.value);
  };

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
              Seleccionar fábrica a pagar
            </label>
            <select
              className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-bold"
              value={selectedFabrica}
              onChange={handleFabricaChange}
            >
              <option disabled value="">
                Seleccionar fábrica
              </option>
              {fabricas.map((f) => (
                <option key={f._id} value={f.nombre}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          {selectedFabrica && (
            <div className="flex flex-col gap-1 w-full mt-2">
              <label className="font-semibold text-xs text-gray-700">
                Seleccionar término de pago
              </label>
              <select
                className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-bold"
                value={selectedTerminoPago}
                onChange={handleTerminoPagoChange}
              >
                <option disabled value="">
                  Seleccionar término de pago
                </option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>
          )}

          {selectedTerminoPago === "quincenal" && (
            <div className="flex flex-col gap-1 w-full mt-2">
              <label className="font-semibold text-xs text-gray-700">
                Seleccionar quincena
              </label>
              <select
                className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-bold"
                value={selectedQuincena}
                onChange={handleQuincenaChange}
              >
                <option disabled value="">
                  Seleccionar quincena
                </option>
                <option value="quincena_cinco">Quincena del 5</option>
                <option value="quincena_veinte">Quincena del 20</option>
              </select>
            </div>
          )}

          <button className="bg-blue-500 py-2 rounded-full text-white font-bold mt-3 px-5 text-sm">
            Imprimir ahora
          </button>
        </div>
      </div>
    </dialog>
  );
};
