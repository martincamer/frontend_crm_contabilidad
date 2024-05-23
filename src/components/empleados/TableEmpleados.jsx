import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
  FaRegCalendar,
  FaSignal,
} from "react-icons/fa";
import { updateFecha } from "../../helpers/FechaUpdate";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { Dropdown } from "../ui/Dropdown";
import { SearchButton } from "../ui/SearchButton";
import { Search } from "../ui/Search";
import { useSearch } from "../../helpers/openSearch";
import { ModalEstado } from "../gastos/ModalEstado";
import { useObtenerId } from "../../helpers/obtenerId";
import { useModal } from "../../helpers/modal";
import { useEmpleado } from "../../context/EmpleadosContext";
import Calendar from "../ui/Calendary";
import ModalEliminar from "../ui/ModalEliminar";
import { ModalComprobante } from "./ModalComprobante";
import { ModalComprobantePago } from "./ModalComprobantePago";

export const TableEmpleados = () => {
  const { click, openSearch } = useSearch();
  const { deleteEmpleado, getEmpleados, empleados } = useEmpleado();

  useEffect(() => {
    getEmpleados();
  }, []);

  //Search
  const [currentPage, setCurrentPage] = useState(1);
  const [ventasPerPage] = useState(10); // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda

  // Índices para la paginación
  const indexOfLastVenta = currentPage * ventasPerPage;
  const indexOfFirstVenta = indexOfLastVenta - ventasPerPage;

  // Ordenar gastos por fecha de creación
  const sortedVentas = empleados
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentVentas = sortedVentas.slice(indexOfFirstVenta, indexOfLastVenta); // Elementos a mostrar

  // Cambiar la página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Manejar búsqueda
  const handleSearch = (event) => {
    setCurrentPage(1); // Restablecer la página al buscar
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  // Filtrar gastos por el término de búsqueda
  const filteredGastos = currentVentas.filter(
    (venta) =>
      venta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(sortedVentas.length / ventasPerPage); // Calcular el total de páginas

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

  //truncate ID
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength);
  };

  //   const totalFinal = empleados.reduce((total, detalle) => {
  //     return total + parseFloat(detalle.total_final);
  //   }, 0);

  //   const totalImpuestos = empleados.reduce((total, detalle) => {
  //     return total + parseFloat(detalle.impuestos_total);
  //   }, 0);

  //obtener el id
  const { handleObtenerId, idObtenida } = useObtenerId();

  //modal eliminar
  const { closeModal, isOpen, openModal } = useModal();

  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
  };

  //   let total_antiguedad = 0;

  //   if (termino_pago === "mensual") {
  //     total_antiguedad = Number(sueldo_basico) * (0.01 * antiquity.years);
  //   } else {
  //     total_antiguedad =
  //       (Number(quincena_cinco) + Number(quincena_veinte)) *
  //       (0.01 * antiquity.years);
  //   }

  //estado gastado
  const getEstadoClassNames = (estado) => {
    switch (estado) {
      case "trabajando":
        return "bg-green-100 text-green-700";
      case "enfermo":
        return "bg-orange-100 text-orange-700";
      case "reposo":
        return "bg-blue-100 text-orange-100";
      case "accidentado":
        return "bg-rose-100 text-rose-100";
      case "despedido":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="bg-white py-2 px-5 my-5 mx-3 max-w-lg justify-between flex items-center">
        <p className="text-xs font-bold text-blue-500">
          Mas opciones empleados
        </p>
        <div className="flex gap-2">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="text-xs font-bold text-gray-500 bg-gray-50 border py-2 px-3 flex gap-1 items-center cursor-pointer"
            >
              <FaRegCalendar className="text-lg" /> Fecha
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[105] shadow-xl border border-gray-200 py-5 px-5 rounded-none bg-base-100 w-[600px] cursor-pointer mt-2"
            >
              <Calendar />
            </ul>
          </div>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="text-xs font-bold text-gray-500 bg-gray-50 border py-2 px-3 flex gap-1 items-center cursor-pointer"
            >
              <FaFilter className="text-base" /> Mas filtrós
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[105] shadow-xl border border-gray-200 py-5 px-5 rounded-none bg-base-100 w-52 cursor-pointer mt-2"
            ></ul>
          </div>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="text-xs font-bold text-gray-500 bg-gray-50 border py-2 px-3 flex gap-1 items-center cursor-pointer"
            >
              <FaSignal className="text-base" /> Estadisticas
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[105] shadow-xl border border-gray-200 py-5 px-5 rounded-none bg-base-100 w-[800px] cursor-pointer flex mt-2 gap-2"
            >
              {/* <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
                <p className="text-sm font-semibold text-gray-700">
                  Importes cargados
                </p>
                <p className="text-blue-500 text-lg font-bold">
                  {formatearDinero(totalFinal)}
                </p>
              </div>
              <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
                <p className="text-sm font-semibold text-gray-700">Impuestos</p>
                <p className="text-blue-500 text-lg font-bold">
                  {formatearDinero(totalImpuestos)}
                </p>
              </div>
              <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
                <p className="text-sm font-semibold text-gray-700">
                  Gastos generados
                </p>
                <p className="text-blue-500 text-lg font-bold">
                  {gastos.length}
                </p>
              </div> */}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-white my-2 mx-3">
        <table className="table">
          <thead>
            <tr className="text-gray-800">
              <th>Referencia</th>
              <th>Empleado</th>
              <th>Fecha ingreso</th>
              <th>Antigüedad trabajando</th>
              <th>Sueldo</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody className="text-xs capitalize">
            {filteredGastos?.map((g) => {
              // Calcular la antigüedad
              const { years, months } = calculateAntiquity(g.fecha_ingreso);
              let sueldo = "";
              if (g.termino_pago === "quincenal") {
                // Si es quincenal, obtener el sueldo correspondiente
                sueldo =
                  Number(g.sueldo[0]?.quincena_cinco[0]?.quincena_cinco) +
                    Number(g.sueldo[0]?.quincena_cinco[0]?.otros) +
                    Number(g.sueldo[0]?.quincena_cinco[0]?.premio_produccion) +
                    Number(g.sueldo[0]?.quincena_cinco[0]?.otros) +
                    Number(g.sueldo[1]?.quincena_veinte[0]?.quincena_veinte) +
                    Number(g.sueldo[1]?.quincena_veinte[0]?.comida) -
                    Number(
                      g.sueldo[1]?.quincena_veinte[0]?.descuento_del_veinte
                    ) -
                    Number(
                      g.sueldo[0]?.quincena_cinco[0]?.descuento_del_cinco
                    ) || "";
              } else if (g.termino_pago === "mensual") {
                // Si es mensual, obtener el sueldo mensual
                sueldo =
                  Number(g.sueldo[0]?.sueldo_basico) +
                    Number(g.sueldo[0]?.comida) +
                    Number(g.sueldo[0]?.comida) +
                    Number(g.sueldo[0]?.premio_produccion) +
                    Number(g.sueldo[0]?.premio_asistencia) +
                    Number(g.sueldo[0]?.comida) +
                    Number(g.sueldo[0]?.otros) -
                    Number(g.sueldo[0]?.descuento_del_cinco) || "";
              }

              return (
                <tr key={g._id}>
                  <th>{truncateText(g._id, 6)}</th>
                  <th>
                    {g.nombre} {g.apellido}
                  </th>
                  <th>{updateFecha(g.fecha_ingreso)}</th>{" "}
                  {/* Aquí puedes formatear la fecha como desees */}
                  <th>{`${years} años, ${months} meses`}</th>{" "}
                  {/* Mostrar la antigüedad */}
                  <th>{formatearDinero(sueldo)}</th>{" "}
                  <td>
                    <span
                      className={`${getEstadoClassNames(
                        g?.estado
                      )} font-bold py-1 px-2 rounded`}
                    >
                      {g?.estado}
                    </span>
                  </td>
                  {/* Mostrar el sueldo correspondiente */}
                  <td>
                    <Dropdown>
                      <li>
                        <Link
                          to={`/empleado/${g?._id}`}
                          className="hover:text-blue-500 font-bold"
                          type="button"
                        >
                          Ver empleado completo
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleObtenerId(g._id);
                            document
                              .getElementById("my_modal_editar_estado")
                              .showModal();
                          }}
                          className="hover:text-blue-500 font-bold"
                          type="button"
                        >
                          Cambiar el estado
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleObtenerId(g._id);
                            document
                              .getElementById("my_modal_nuevo_comprobante")
                              .showModal();
                          }}
                          className="hover:text-blue-500 font-bold"
                          type="button"
                        >
                          Generar comprobante
                        </button>
                      </li>
                      {/* Resto de opciones del dropdown */}
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SearchButton open={() => openSearch()} />
      {click && (
        <Search
          value={searchTerm}
          onChange={handleSearch}
          placeholder={"Buscar gastó por proveedor o categoria"}
        />
      )}
      {totalPages > 1 && (
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
      )}

      {/* Modal editar estado */}
      <ModalEstado idObtenida={idObtenida} />
      <ModalComprobante idObtenida={idObtenida} />
      <ModalComprobantePago idObtenida={idObtenida} />

      <ModalEliminar
        isOpen={isOpen}
        closeModal={closeModal}
        deleteTodo={deleteEmpleado}
        idObtenida={idObtenida}
        message={"¿Deseas eliminar el gasto?"}
      />
    </div>
  );
};
