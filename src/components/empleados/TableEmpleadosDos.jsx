import { useEffect, useState } from "react";
import { useEmpleado } from "../../context/EmpleadosContext";
import React from "react";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { updateFecha } from "../../helpers/FechaUpdate";
import { useSearch } from "../../helpers/openSearch";
import { Search } from "../../components/ui/Search";
import { SearchButton } from "../../components/ui/SearchButton";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const TableEmpleadosDos = () => {
  const { getEmpleados, empleados } = useEmpleado();
  const { click, openSearch } = useSearch();

  useEffect(() => {
    getEmpleados();
  }, []);

  // Estado para la búsqueda y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [ventasPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFabrica, setActiveFabrica] = useState(""); // Estado para la fábrica activa

  // Función para calcular antigüedad
  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return { years, months };
  };

  // Función para obtener el nombre de clase CSS según el estado
  const getEstadoClassNames = (estado) => {
    switch (estado) {
      case "trabajando":
        return "bg-green-100 text-green-700";
      case "enfermo":
        return "bg-orange-100 text-orange-700";
      case "reposo":
        return "bg-blue-100 text-blue-600";
      case "accidentado":
        return "bg-rose-100 text-rose-600";
      case "despedido":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  // Función para truncar el ID
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength);
  };

  // Ordenar empleados por fecha de creación (aquí se asume que 'date' es el campo de fecha de ingreso)
  const sortedEmpleados = empleados
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filtrar empleados por término de búsqueda
  const filteredEmpleados = sortedEmpleados.filter(
    (empleado) =>
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar empleados por fábrica
  const empleadosPorFabrica = {};
  filteredEmpleados.forEach((empleado) => {
    if (!empleadosPorFabrica[empleado.fabrica_sucursal]) {
      empleadosPorFabrica[empleado.fabrica_sucursal] = [];
    }
    empleadosPorFabrica[empleado.fabrica_sucursal].push(empleado);
  });

  // Obtener las fábricas como array para las pestañas
  const fabricas = Object.keys(empleadosPorFabrica);

  // Función para manejar la paginación
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    setCurrentPage(1); // Reiniciar la página al buscar
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredEmpleados.length / ventasPerPage);

  // Obtener los números de las páginas a mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="mt-10">
      {/* Pestañas para cada fábrica */}
      <div role="tablist" className="tabs tabs-lifted my-2 mx-3">
        {fabricas.map((fabrica, index) => (
          <React.Fragment key={index}>
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab capitalize font-semibold"
              aria-label={`${fabrica}`}
              checked
              onChange={() => setActiveFabrica(fabrica)} // Cambiar la fábrica activa al hacer clic
            />
            <div
              role="tabpanel"
              className={`tab-content bg-white border-gray-200 rounded-box p-6 capitalize ${
                activeFabrica === fabrica ? "block" : "hidden"
              }`}
            >
              <h2 className="text-lg font-bold mb-3">{fabrica}</h2>
              <div className="bg-white my-2 mx-3">
                <table className="table">
                  <thead>
                    <tr className="text-gray-800">
                      <th>Referencia</th>
                      <th>Empleado</th>
                      <th>Fecha ingreso</th>
                      <th>Fábrica/Sucursal</th>
                      <th>Antigüedad trabajando</th>
                      <th>Sueldo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs capitalize">
                    {empleadosPorFabrica[fabrica].map((empleado) => {
                      const { years, months } = calculateAntiquity(
                        empleado.fecha_ingreso
                      );

                      let total_antiguedad = 0;
                      if (empleado.termino_pago === "mensual") {
                        total_antiguedad =
                          Number(empleado.sueldo[0]?.sueldo_basico) *
                          (0.01 * years);
                      } else {
                        total_antiguedad =
                          (Number(
                            empleado.sueldo[0]?.quincena_cinco[0]
                              ?.quincena_cinco
                          ) +
                            Number(
                              empleado.sueldo[1]?.quincena_veinte[0]
                                ?.quincena_veinte
                            )) *
                          (0.01 * years);
                      }

                      let sueldo = "";
                      if (empleado.termino_pago === "quincenal") {
                        sueldo =
                          Number(
                            empleado.sueldo[0]?.quincena_cinco[0]
                              ?.quincena_cinco
                          ) +
                            Number(
                              empleado.sueldo[0]?.quincena_cinco[0]?.otros
                            ) +
                            Number(
                              empleado.sueldo[0]?.quincena_cinco[0]
                                ?.premio_produccion
                            ) +
                            Number(
                              empleado.sueldo[0]?.quincena_cinco[0]
                                ?.premio_asistencia
                            ) +
                            Number(
                              empleado.sueldo[1]?.quincena_veinte[0]
                                ?.quincena_veinte
                            ) +
                            Number(
                              empleado.sueldo[1]?.quincena_veinte[0]?.comida
                            ) +
                            Number(total_antiguedad) -
                            Number(
                              empleado.sueldo[1]?.quincena_veinte[0]
                                ?.descuento_del_veinte || 0
                            ) -
                            Number(
                              empleado.sueldo[0]?.quincena_cinco[0]
                                ?.descuento_del_cinco || 0
                            ) || 0;
                      } else if (empleado.termino_pago === "mensual") {
                        sueldo =
                          Number(empleado.sueldo[0]?.sueldo_basico) +
                            Number(total_antiguedad) +
                            Number(empleado.sueldo[0]?.comida) +
                            Number(empleado.sueldo[0]?.premio_produccion) +
                            Number(empleado.sueldo[0]?.premio_asistencia) +
                            Number(empleado.sueldo[0]?.otros) -
                            Number(empleado.sueldo[0]?.descuento_del_cinco) ||
                          "";
                      }

                      return (
                        <tr key={empleado._id}>
                          <th>{truncateText(empleado._id, 6)}</th>
                          <th>
                            {empleado.nombre} {empleado.apellido}
                          </th>
                          <th>{updateFecha(empleado.fecha_ingreso)}</th>
                          <th>{empleado.fabrica_sucursal}</th>
                          <th>{`${years} años, ${months} meses`}</th>
                          <th>{formatearDinero(parseFloat(sueldo))}</th>
                          <th>
                            <span
                              className={`${getEstadoClassNames(
                                empleado?.estado
                              )} font-bold py-1 px-2 rounded`}
                            >
                              {empleado?.estado}
                            </span>
                          </th>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex pb-12 justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowLeft /> {/* Icono para la flecha izquierda */}
        </button>
        <ul className="flex space-x-2">
          {getPageNumbers().map((number) => (
            <li key={number} className="cursor-pointer">
              <button
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number ? "bg-white" : "bg-gray-300"
                } py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100`}
              >
                {number} {/* Número de página */}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowRight />
        </button>
      </div>

      <SearchButton open={() => openSearch()} />
      {click && (
        <Search
          value={searchTerm}
          onChange={handleSearch}
          placeholder={"Buscar gastó por proveedor o categoria"}
        />
      )}
    </div>
  );
};
