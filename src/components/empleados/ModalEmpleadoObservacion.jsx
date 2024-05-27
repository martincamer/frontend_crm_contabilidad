import { useEffect, useState } from "react";
import { useEmpleado } from "../../context/EmpleadosContext";
import { updateFecha } from "../../helpers/FechaUpdate";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { PDFViewer } from "@react-pdf/renderer";
import { ComprobantePago } from "../comprobantes/ComprobantePago";
import { Dropdown } from "../ui/Dropdown";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const ModalEmpleadoObservacion = ({ idObtenida }) => {
  const { getEmpleado } = useEmpleado();
  const [empleado, setEmpleado] = useState([]);
  useEffect(() => {
    async function obtenerEmpleado() {
      const res = await getEmpleado(idObtenida);
      console.log(res);
      setEmpleado(res);
    }
    obtenerEmpleado();
  }, [idObtenida, getEmpleado]);

  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
  };

  const edad_empleado = calculateAntiquity(empleado?.fecha_nacimiento);
  const antiguedad_empleado = calculateAntiquity(empleado?.fecha_ingreso);

  const [selectedRecibo, setSelectedRecibo] = useState(null);

  const handleOpenModal = (recibo) => {
    setSelectedRecibo(recibo);
    document.getElementById("my_modal_pdf_dos").showModal();
  };

  //filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recibosPerPage] = useState(5); // Número de recibos por página

  // Función para manejar el filtro por rango de fechas
  const handleDateFilter = (event) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
    setCurrentPage(1); // Resetear la página al cambiar el filtro
  };

  // Función para mostrar los recibos en la página actual
  const indexOfLastRecibo = currentPage * recibosPerPage;
  const indexOfFirstRecibo = indexOfLastRecibo - recibosPerPage;

  const currentRecibos = empleado?.recibos
    ?.filter((g) => {
      if (!startDate || !endDate) return true; // Mostrar todos si no hay filtro de fecha
      return g.created_at >= startDate && g.created_at <= endDate;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(indexOfFirstRecibo, indexOfLastRecibo);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(
    empleado?.recibos?.filter((g) => {
      if (!startDate || !endDate) return true; // Mostrar todos si no hay filtro de fecha
      return g.created_at >= startDate && g.created_at <= endDate;
    }).length / recibosPerPage
  );

  // Obtener los números de las páginas a mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Mostrar hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Empezar desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <dialog id="my_modal_observacion_empleado" className="modal">
      <div className="modal-box rounded-none max-w-6xl h-full scroll-bar">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex flex-col gap-5">
          <div className="flex">
            <h2 className="font-semibold text-orange-500 border py-5 px-5">
              Observación del empleado{" "}
              <span className="capitalize text-blue-500">
                {empleado?.nombre} {empleado?.apellido}
              </span>
            </h2>
          </div>
          <div className="border py-5 px-5 flex flex-col gap-2">
            <p className="font-bold text-blue-500 text-center">
              Datos del empleado
            </p>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-blue-500">
                  Nombre y apellido:{" "}
                  <span className="capitalize text-gray-600">
                    {empleado?.nombre} {empleado?.apellido}
                  </span>
                </p>
                <p className="font-semibold text-blue-500">
                  Dni del empleado:{" "}
                  <span className="capitalize text-gray-600">
                    {empleado?.dni}
                  </span>
                </p>
                <p className="font-semibold text-blue-500">
                  Edad del empleado:{" "}
                  <span className="capitalize text-gray-600">
                    {edad_empleado?.years}
                  </span>
                </p>
                <p className="font-semibold text-blue-500">
                  Estado del empleado:{" "}
                  <span className="capitalize text-gray-600">
                    {empleado?.estado}
                  </span>
                </p>
              </div>
              <div>
                <p className="font-semibold text-blue-500">
                  Fecha de ingreso:{" "}
                  <span className="capitalize text-gray-600">
                    {updateFecha(empleado?.fecha_ingreso)}
                  </span>
                </p>
                <p className="font-semibold text-blue-500">
                  Fecha de nacimiento:{" "}
                  <span className="capitalize text-gray-600">
                    {updateFecha(empleado?.fecha_nacimiento)}
                  </span>
                </p>
                <p className="font-semibold text-blue-500">
                  Antiguedad del empleado trabajando:{" "}
                  <span className="capitalize text-gray-600">
                    {antiguedad_empleado.years} Años,{" "}
                    {antiguedad_empleado.months} meses
                  </span>
                </p>
                <p className="font-semibold text-blue-500">
                  Sector de trabajo:{" "}
                  <span className="capitalize text-gray-600">
                    {empleado?.sector_trabajo}
                  </span>
                </p>
                <p className="font-semibold text-blue-500">
                  Fabrica/Sucursal:{" "}
                  <span className="capitalize text-gray-600">
                    {empleado?.fabrica_sucursal}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="border py-5 px-5 flex flex-col gap-2">
            <p className="font-bold text-blue-500 text-center">
              Datos del sueldo
            </p>
            {empleado?.termino_pago === "quincenal" ? (
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <p className="font-bold text-orange-500 border-b-[2px] border-orange-500">
                      Quincena del 5
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-500">
                      Quincena del 5 sin aumentos,producción,etc:{" "}
                      <span className="capitalize text-gray-600">
                        {formatearDinero(
                          Number(
                            empleado?.sueldo[0]?.quincena_cinco[0]
                              .quincena_cinco
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500">
                      Banco:{" "}
                      <span className="capitalize text-red-600">
                        -
                        {formatearDinero(
                          Number(empleado?.sueldo[0]?.quincena_cinco[0].banco)
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500">
                      Descuento del 5:{" "}
                      <span className="capitalize text-red-600">
                        -
                        {formatearDinero(
                          Number(
                            empleado?.sueldo[0]?.quincena_cinco[0]
                              .descuento_del_cinco
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500">
                      Premio asistencia:{" "}
                      <span className="capitalize text-gray-600">
                        +
                        {formatearDinero(
                          Number(
                            empleado?.sueldo[0]?.quincena_cinco[0]
                              .premio_asistencia
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500">
                      Premio producción:{" "}
                      <span className="capitalize text-gray-600">
                        +
                        {formatearDinero(
                          Number(
                            empleado?.sueldo[0]?.quincena_cinco[0]
                              .premio_produccion
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500 flex flex-col w-2/3">
                      Observación:{" "}
                      <span className="capitalize text-gray-600 text-wrap border py-2 px-3 text-sm">
                        {
                          empleado?.sueldo[0]?.quincena_cinco[0]
                            .observacion_cinco
                        }
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-2/3">
                  <div className="flex">
                    <p className="font-bold text-orange-500 border-b-[2px] border-orange-500">
                      Quincena del 20
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-500">
                      Quincena del 20 sin aumentos,producción,etc:{" "}
                      <span className="capitalize text-gray-600">
                        {formatearDinero(
                          Number(
                            empleado?.sueldo[1]?.quincena_veinte[0]
                              .quincena_veinte
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500">
                      Comida:{" "}
                      <span className="capitalize text-gray-600">
                        +
                        {formatearDinero(
                          Number(empleado?.sueldo[1]?.quincena_veinte[0].comida)
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500">
                      Descuentos del 20:{" "}
                      <span className="capitalize text-red-600">
                        -
                        {formatearDinero(
                          Number(
                            empleado?.sueldo[1]?.quincena_veinte[0]
                              .descuento_del_veinte
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500 flex flex-col">
                      Observación del 20:{" "}
                      <span className="capitalize text-gray-600 text-wrap border py-2 px-3 text-sm">
                        {
                          empleado?.sueldo[1]?.quincena_veinte[0]
                            .observacion_veinte
                        }
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="bg-white my-2 mx-3">
          <p className="text-blue-500 font-bold text-lg">
            Comprobantes de pago
          </p>
          <div className="flex gap-2 items-center">
            <p className="font-semibold">Buscar comprobantes por mes o día</p>
            <input
              type="date"
              name="startDate"
              className="border border-gray-200 shadow font-bold text-sm px-2 py-1 my-2"
              onChange={handleDateFilter}
            />
            <input
              type="date"
              name="endDate"
              className="border border-gray-200 shadow font-bold text-sm px-2 py-1 my-2"
              onChange={handleDateFilter}
            />
          </div>
          <table className="table">
            <thead>
              <tr className="text-gray-800">
                <th>Pago</th>
                <th>Total del comprobante</th>
                <th>Fecha de pago</th>
              </tr>
            </thead>
            <tbody className="text-xs capitalize">
              {currentRecibos?.map((g) => (
                <tr key={g._id}>
                  <th>
                    {(g?.termino_pago === "quincena_cinco" &&
                      "Quincena del 5") ||
                      (g?.termino_pago === "quincena_veinte" &&
                        "Quincena del 20") ||
                      (g?.termino_pago === "sueldo" && "Mensual")}
                  </th>
                  <th>{updateFecha(g?.created_at)}</th>
                  <td>
                    <Dropdown>
                      <li className="text-center">
                        <button
                          type="button"
                          className="font-semibold bg-blue-500 py-2 px-3 text-center text-white rounded-full text-sm"
                          onClick={() => handleOpenModal(g)}
                        >
                          Ver comprobante
                        </button>
                      </li>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <dialog id="my_modal_pdf_dos" className="modal">
            <div className="modal-box max-w-full rounded-none scroll-bar">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => setSelectedRecibo(null)}
                >
                  ✕
                </button>
              </form>
              <PDFViewer
                style={{
                  width: "100%",
                  height: "100vh",
                }}
              >
                {selectedRecibo && <ComprobantePago recibo={selectedRecibo} />}
              </PDFViewer>
            </div>
          </dialog>
        </div>

        <div className="flex justify-center items-center space-x-2 mb-10">
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
      </div>
    </dialog>
  );
};
