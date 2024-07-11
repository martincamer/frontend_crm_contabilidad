import React, { useEffect, useState } from "react";
import { useEmpleado } from "../../context/EmpleadosContext";
// import { ModalViewerEmpleados } from "./ModalViewerEmpleados";
import { ModalViewerEmpleadosAguinaldo } from "./ModalViewerEmpleadosAguinaldo";

export const ModalSeleccionarAguinaldo = () => {
  const { getEmpleados, getFabricas, fabricas, empleados } = useEmpleado();
  const [selectedFabrica, setSelectedFabrica] = useState("");
  const [selectedMes, setSelectedMes] = useState("");

  // Llamar a getFabricas y getEmpleados al montar el componente
  useEffect(() => {
    getFabricas();
    getEmpleados();
  }, []);

  const filtrarEmpleados = (empleados, selectedFabrica) => {
    // Filtrar por fábrica seleccionada
    const empleadosFiltrados = empleados?.filter(
      (empleado) => empleado?.fabrica_sucursal === selectedFabrica
    );

    return empleadosFiltrados;
  };

  const empleadosFiltrados = filtrarEmpleados(empleados, selectedFabrica);

  // Manejar el cambio de selección de fábrica
  const handleFabricaChange = async (e) => {
    const fabricaSeleccionada = e.target.value;

    setSelectedFabrica(fabricaSeleccionada);
  };

  const handleMesChange = async (e) => {
    const mesSelecionado = e.target.value;

    setSelectedMes(mesSelecionado);
  };

  return (
    <dialog id="my_modal_aguinaldo" className="modal">
      <div className="modal-box rounded-none max-w-md">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <div>
            <p className="font-bold text-blue-500 mb-3">
              Imprimir comprobantes/aguinaldo
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full mb-3">
            <label className="font-semibold text-xs text-gray-700">
              Seleccionar el mes del aguinaldo
            </label>
            <select
              className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-bold"
              value={selectedMes}
              onChange={handleMesChange}
            >
              <option className="font-bold text-blue-500" disabled value="">
                Seleccionar el mes
              </option>
              <option className="font-semibold" value="Junio">
                Junio
              </option>
              <option className="font-semibold" value="Diciembre">
                Diciembre
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold text-xs text-gray-700">
              Seleccionar fábrica a pagar el aguinaldo
            </label>
            <select
              className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-bold"
              value={selectedFabrica}
              onChange={handleFabricaChange}
            >
              <option className="font-bold text-blue-500" disabled value="">
                Seleccionar fábrica
              </option>
              {fabricas.map((f) => (
                <option className="font-semibold" key={f._id} value={f.nombre}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              document
                .getElementById("my_modal_aguinaldo_comprobante")
                .showModal();
            }}
            className="bg-blue-500 py-2 px-5 rounded-full text-white font-bold text-sm mt-4"
            // onClick={generarComprobantes}
            disabled={!selectedFabrica}
          >
            Generar Comprobantes del aguinaldo
          </button>
        </div>
        <ModalViewerEmpleadosAguinaldo
          selectedMes={selectedMes}
          selectedFabrica={selectedFabrica}
          empleados={empleadosFiltrados}
        />
      </div>
    </dialog>
  );
};
