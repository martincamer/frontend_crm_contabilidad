import React, { useState } from "react";
import { Link } from "react-router-dom";
import { updateFechaMes } from "../../helpers/FechaUpdateMes";
import { Dropdown } from "../ui/Dropdown";
import { useObtenerId } from "../../helpers/obtenerId";
import { showSuccessToast } from "../../helpers/toast";
import { useModal } from "../../helpers/modal";
import instance from "../../api/axios";
import ModalEliminar from "../ui/ModalEliminar";

export const TableEmpleadosDatosAguinaldo = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [empleados, setEmpleados] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const { closeModal, isOpen, openModal } = useModal();
  const { handleObtenerId, idObtenida } = useObtenerId();

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await instance.post("/empleados-datos-aguinaldo/range", {
        selectedYear,
        selectedMonth,
      });

      setEmpleados(response.data);
    } catch (error) {
      console.error("Error sending date range:", error);
    }
  };

  //truncate ID
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength);
  };

  const deleteEmpleado = async (id) => {
    try {
      const res = await instance.delete(`/empleados-datos/${id}`);
      if (res.status === 204) {
        setEmpleados(empleados.filter((empleado) => empleado._id !== id));
        showSuccessToast("Datos eliminados correctamnete");
      }
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  console.log(empleados);

  return (
    <div className="">
      <div className="mt-6">
        <div className="bg-white py-5 px-5 mx-3 max-w-3xl">
          <h2 className="text-xl font-bold mb-4 text-blue-500">
            Filtrar por Rango de Fechas
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mes
              </label>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="text-sm w-full bg-gray-200/90 placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 focus:border-blue-500 transition-all outline-none border border-gray-200 bg-white"
              >
                <option value="">Selecciona un mes</option>
                <option value="6">Junio</option>
                <option value="12">Diciembre</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Año
              </label>
              <input
                type="number"
                min="1900"
                max="2100"
                step="1"
                value={selectedYear}
                onChange={handleYearChange}
                className="text-sm w-full bg-gray-200/90 placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 focus:border-blue-500 transition-all outline-none border border-gray-200 bg-white"
                placeholder="Ingrese el año"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Filtrar empleados
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white my-6 mx-3 max-md:overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-gray-800">
              <th>Referencia</th>
              <th>Total de empleados</th>
              <th>Fecha/Mes</th>
            </tr>
          </thead>
          <tbody className="text-xs capitalize">
            {empleados?.map((g) => (
              <tr key={g._id}>
                <th>{truncateText(g._id, 6)}</th>
                <th>{g?.empleados?.length}</th>
                <th>{updateFechaMes(g?.fecha_pago)}</th>
                <td>
                  <Dropdown>
                    <li>
                      <Link
                        to={`/empleados-datos-aguinaldo/${g?._id}`}
                        className="hover:text-blue-500 font-bold"
                        type="button"
                      >
                        Ver datos
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleObtenerId(g._id), openModal();
                        }}
                        className="hover:text-blue-500 font-bold"
                        type="button"
                      >
                        Eliminar los datos
                      </button>
                    </li>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalEliminar
        isOpen={isOpen}
        closeModal={closeModal}
        deleteTodo={deleteEmpleado}
        idObtenida={idObtenida}
        message={"¿Deseas los datos, elimina si esta clonado?"}
      />
    </div>
  );
};
