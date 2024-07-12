import React, { useEffect, useState } from "react";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { LinkBreadCrumbs } from "../components/ui/LinkBreadCrumbs";
import { BreadCrumbs } from "../components/ui/BreadCrumbs";
import { useParams } from "react-router-dom";
import { useEmpleado } from "../context/EmpleadosContext";
import { updateFecha } from "../helpers/FechaUpdate";
import { formatearDinero } from "../helpers/FormatearDinero";
import { Dropdown } from "../components/ui/Dropdown";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ComprobantePago } from "../components/comprobantes/ComprobantePago";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useModal } from "../helpers/modal";
import { useObtenerId } from "../helpers/obtenerId";
import ModalEliminar from "../components/ui/ModalEliminar";

export const Empleado = () => {
  const params = useParams();
  const { getEmpleado, deleteRecibo, empleado, setEmpleado } = useEmpleado();

  const { isOpen, openModal, closeModal } = useModal();

  const { handleObtenerId, idObtenida } = useObtenerId();

  useEffect(() => {
    async function loadData() {
      const res = await getEmpleado(params.id);

      setEmpleado(res);
    }

    loadData();
  }, [params.id]);

  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) {
      return text;
    }
    return text?.substring(0, maxLength);
  };

  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
  };

  const { years, months } = calculateAntiquity(empleado.fecha_ingreso);

  let sueldo;

  if (("antiguedad", empleado.termino_pago === "quincenal")) {
    // Si es quincenal, obtener el sueldo correspondiente
    sueldo =
      Number(empleado.sueldo[0]?.quincena_cinco[0]?.quincena_cinco) +
        Number(empleado.sueldo[0]?.quincena_cinco[0]?.otros) +
        Number(empleado.sueldo[0]?.quincena_cinco[0]?.premio_produccion) +
        Number(empleado.sueldo[0]?.quincena_cinco[0]?.otros) +
        Number(empleado.sueldo[1]?.quincena_veinte[0]?.quincena_veinte) +
        Number(empleado.sueldo[1]?.quincena_veinte[0]?.comida) -
        Number(empleado.sueldo[1]?.quincena_veinte[0]?.descuento_del_veinte) -
        Number(empleado.sueldo[0]?.quincena_cinco[0]?.descuento_del_cinco) ||
      "";
  } else if (empleado.termino_pago === "mensual") {
    // Si es mensual, obtener el sueldo mensual
    sueldo =
      Number(empleado.sueldo[0]?.sueldo_basico) +
        Number(empleado.sueldo[0]?.comida) +
        Number(empleado.sueldo[0]?.comida) +
        Number(empleado.sueldo[0]?.premio_produccion) +
        Number(empleado.sueldo[0]?.premio_asistencia) +
        Number(empleado.sueldo[0]?.comida) +
        Number(empleado.sueldo[0]?.otros) -
        Number(empleado.sueldo[0]?.descuento_del_cinco) || "";
  }

  let total_antiguedad = 0;
  if (empleado?.termino_pago === "mensual") {
    total_antiguedad =
      Number(empleado?.sueldo[0]?.sueldo_basico) * (0.01 * years);
  } else {
    const quincenaCinco = empleado?.sueldo?.[0]?.quincena_cinco?.[0]
      ?.quincena_cinco
      ? Number(empleado.sueldo[0].quincena_cinco[0].quincena_cinco)
      : 0;
    const quincenaVeinte = empleado?.sueldo?.[1]?.quincena_veinte?.[0]
      ?.quincena_veinte
      ? Number(empleado.sueldo[1].quincena_veinte[0].quincena_veinte)
      : 0;

    total_antiguedad = (quincenaCinco + quincenaVeinte) * (0.01 * years);
  }

  const [selectedRecibo, setSelectedRecibo] = useState(null);

  const handleOpenModal = (recibo) => {
    setSelectedRecibo(recibo);
    document.getElementById("my_modal_pdf").showModal();
  };

  const handleRecibo = (recibo) => {
    setSelectedRecibo(recibo);
  };

  //filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recibosPerPage] = useState(10); // Número de recibos por página

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
    <section>
      <Navegacion>
        <div className="flex">
          <NavegacionLink
            link={"/empleados"}
            estilos={
              "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5"
            }
          >
            Empleados
          </NavegacionLink>
          <NavegacionLink
            link={`/empleaod/${params.id}`}
            estilos={
              "bg-orange-500 text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
            }
          >
            Detalles del empleado
          </NavegacionLink>
        </div>
        <BreadCrumbs>
          <LinkBreadCrumbs link={"home"}>Inicio</LinkBreadCrumbs>
          <LinkBreadCrumbs link={"empleados"}>Empleados</LinkBreadCrumbs>
        </BreadCrumbs>
      </Navegacion>

      <div className="flex my-10 mx-10 max-md:mx-4">
        <div className="bg-white py-5 px-5">
          <p className="font-bold text-blue-500">
            Detalles del empleado obtenido / referencia{" "}
            {truncateText(params?.id, 6)}
          </p>
        </div>
      </div>

      <div className="mx-10 w-1/2 my-5 max-md:w-auto max-md:mx-4">
        <div className="bg-white py-5 px-5 flex flex-col gap-4">
          <p className="font-bold text-gray-600">Empleado datos</p>

          <div className="flex gap-2 justify-between max-md:flex-col">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-orange-500 flex gap-2">
                Nombre{" "}
                <span className="font-bold capitalize text-gray-600">
                  {empleado.nombre}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Apellido{" "}
                <span className="font-bold capitalize text-gray-600">
                  {empleado.apellido}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Dni{" "}
                <span className="font-bold capitalize text-gray-600">
                  {empleado.dni}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Sector de trabajo{" "}
                <span className="font-bold capitalize text-gray-600">
                  {empleado.sector_trabajo}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Fabrica/Sucursal
                <span className="font-bold capitalize text-gray-600">
                  {empleado.fabrica_sucursal}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Terminos de pago
                <span className="font-bold capitalize text-gray-600">
                  {empleado.termino_pago}
                </span>
              </p>
            </div>
            {/* //col 2  */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-orange-500 flex gap-2">
                Fecha de nacimiento{" "}
                <span className="font-bold capitalize text-gray-600">
                  {updateFecha(empleado?.fecha_nacimiento)}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Fecha de ingreso{" "}
                <span className="font-bold capitalize text-gray-600">
                  {updateFecha(empleado?.fecha_ingreso)}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Antiguedad del empleador{" "}
                <span className="font-bold text-gray-600">
                  {years} años y {months} meses
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Sueldo del empleado
              </p>

              <p className="font-medium text-orange-500 flex gap-2 items-center">
                Estado{" "}
                <span
                  className={`font-semibold capitalize ${
                    empleado.estado === "trabajando"
                      ? "text-green-600 bg-green-100 py-1 px-2 rounded"
                      : empleado.estado === "pendiente"
                      ? "text-orange-600 bg-orange-100 py-1 px-2 rounded"
                      : empleado.estado === "rechazado"
                      ? "text-red-600 bg-red-100 py-1 px-2 rounded"
                      : "text-gray-600"
                  }`}
                >
                  {empleado?.estado}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2 items-center">
                Sueldo del empleado
                <span className="font-bold text-gray-600">
                  {formatearDinero(Number(sueldo) + Number(total_antiguedad))}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-5 px-5 mt-10">
          <div className="flex">
            <div className="bg-blue-500 py-2 px-5 font-semibold text-white">
              <p>Detalles del sueldo</p>
            </div>
          </div>

          {empleado?.termino_pago === "mensual" ? (
            <div className="bg-white py-2 px-5 mt-5 border">
              <p className="font-medium text-orange-500">Sueldo Mensual</p>
              <p className="text-gray-600 font-semibold">
                Sueldo Básico:{" "}
                {formatearDinero(
                  Number(empleado?.sueldo?.[0]?.sueldo_basico)
                ) || "N/A"}
              </p>
              <p className="text-gray-600 font-semibold">
                Banco:{" "}
                {formatearDinero(Number(empleado?.sueldo?.[0]?.banco)) || "N/A"}
              </p>
              <p className="text-gray-600 font-semibold">
                Comida:{" "}
                {formatearDinero(Number(empleado?.sueldo?.[0]?.comida)) ||
                  "N/A"}
              </p>
              <p className="text-gray-600 font-semibold">
                Descuentos:{" "}
                {formatearDinero(
                  Number(empleado?.sueldo?.[0]?.descuento_del_cinco)
                ) || "N/A"}
              </p>
              <p className="text-gray-600 font-semibold">
                Otros:{" "}
                {formatearDinero(Number(empleado?.sueldo?.[0]?.otros)) || "N/A"}
              </p>
              <p className="text-gray-600 font-semibold">
                Premio asistencia:{" "}
                {formatearDinero(
                  Number(empleado?.sueldo?.[0]?.premio_asistencia)
                ) || "N/A"}
              </p>
              <p className="text-gray-600 font-semibold">
                Premio producción:{" "}
                {formatearDinero(
                  Number(empleado?.sueldo?.[0]?.premio_produccion)
                ) || "N/A"}
              </p>
              <div className="flex mt-1 gap-2 items-center font-semibold">
                Saldo final:{" "}
                <p className="font-semibold bg-orange-500 py-1 px-2 text-white rounded-xl">
                  {formatearDinero(
                    Number(empleado?.sueldo?.[0]?.sueldo_basico) +
                      Number(total_antiguedad) +
                      Number(empleado?.sueldo?.[0]?.comida) +
                      Number(empleado?.sueldo?.[0]?.otros) +
                      Number(empleado?.sueldo?.[0]?.premio_asistencia) +
                      Number(empleado?.sueldo?.[0]?.premio_produccion) -
                      Number(empleado?.sueldo?.[0]?.banco) -
                      Number(empleado?.sueldo?.[0]?.descuento_del_cinco)
                  ) || "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-white py-2 px-5 mt-5 border">
                <p className="font-medium text-orange-500">Quincena del 5</p>
                <p className="text-gray-600 font-semibold">
                  Quincena 5:{" "}
                  {formatearDinero(
                    Number(
                      empleado?.sueldo?.[0]?.quincena_cinco?.[0]?.quincena_cinco
                    )
                  ) || "N/A"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Otros:{" "}
                  {formatearDinero(
                    Number(empleado?.sueldo?.[0]?.quincena_cinco?.[0]?.otros)
                  ) || "N/A"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Premio Producción:{" "}
                  {formatearDinero(
                    Number(
                      empleado?.sueldo?.[0]?.quincena_cinco?.[0]
                        ?.premio_produccion
                    )
                  ) || "N/A"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Premio Asistencia:{" "}
                  {formatearDinero(
                    Number(
                      empleado?.sueldo?.[0]?.quincena_cinco?.[0]
                        ?.premio_asistencia
                    )
                  ) || "N/A"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Descuento del 5:{" "}
                  {formatearDinero(
                    Number(
                      empleado?.sueldo?.[0]?.quincena_cinco?.[0]
                        ?.descuento_del_cinco
                    )
                  ) || "N/A"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Observación:{" "}
                  {empleado?.sueldo?.[0]?.quincena_cinco?.[0]
                    ?.observacion_cinco || "N/A"}
                </p>
                <div className="flex mt-1 gap-2 items-center font-semibold">
                  Saldo del 5:{" "}
                  <p className="font-semibold bg-orange-500 py-1 px-2 text-white rounded-xl">
                    {formatearDinero(
                      Number(
                        empleado?.sueldo?.[0]?.quincena_cinco?.[0]
                          ?.quincena_cinco
                      ) +
                        Number(total_antiguedad) +
                        Number(
                          empleado?.sueldo?.[0]?.quincena_cinco?.[0]
                            ?.premio_asistencia
                        ) +
                        Number(
                          empleado?.sueldo?.[0]?.quincena_cinco?.[0]
                            ?.premio_produccion
                        ) +
                        Number(
                          empleado?.sueldo?.[0]?.quincena_cinco?.[0]?.otros
                        ) -
                        Number(
                          empleado?.sueldo?.[0]?.quincena_cinco?.[0]?.banco
                        ) -
                        Number(
                          empleado?.sueldo?.[0]?.quincena_cinco?.[0]
                            ?.descuento_del_cinco
                        )
                    ) || "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-white py-2 px-5 mt-5 border">
                <p className="font-medium text-orange-500">Quincena del 20</p>
                <p className="text-gray-600 font-semibold">
                  Quincena 20:{" "}
                  {formatearDinero(
                    Number(
                      empleado?.sueldo?.[1]?.quincena_veinte?.[0]
                        ?.quincena_veinte
                    )
                  ) || "N/A"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Comida:{" "}
                  {formatearDinero(
                    Number(empleado?.sueldo?.[1]?.quincena_veinte?.[0]?.comida)
                  ) || "N/A"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Descuento del 20:{" "}
                  {formatearDinero(
                    Number(
                      empleado?.sueldo?.[1]?.quincena_veinte?.[0]
                        ?.descuento_del_veinte
                    )
                  ) || "N/A"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Observación:{" "}
                  {empleado?.sueldo?.[1]?.quincena_veinte?.[0]
                    ?.observacion_veinte || "N/A"}
                </p>

                <div className="flex mt-1 gap-2 items-center font-semibold">
                  Saldo del 20:{" "}
                  <p className="font-semibold bg-orange-500 py-1 px-2 text-white rounded-xl">
                    {formatearDinero(
                      Number(
                        empleado?.sueldo?.[1]?.quincena_veinte?.[0]
                          ?.quincena_veinte
                      ) +
                        Number(
                          empleado?.sueldo?.[1]?.quincena_veinte?.[0]?.comida
                        ) -
                        Number(
                          empleado?.sueldo?.[1]?.quincena_veinte?.[0]
                            ?.descuento_del_veinte
                        )
                    ) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="my-10 bg-white py-10 px-10 mx-10 mb-10 h-full max-md:mx-4 max-md:px-3">
        <p className="text-blue-500 font-bold text-lg">Comprobantes de pago</p>
        <div className="flex gap-2 items-center max-md:flex-col max-md:mt-2 max-md:items-start">
          <p className="font-semibold">Buscar comprobantes por mes o día</p>
          <input
            type="date"
            name="startDate"
            className="border border-gray-200 shadow font-bold text-sm px-2 py-1 my-2 max-md:hidden"
            onChange={handleDateFilter}
          />
          <input
            type="date"
            name="endDate"
            className="border border-gray-200 shadow font-bold text-sm px-2 py-1 my-2 max-md:hidden"
            onChange={handleDateFilter}
          />
          <div className="flex gap-2">
            <input
              type="date"
              name="startDate"
              className="border border-gray-200 shadow font-bold text-sm px-2 py-1 my-2 md:hidden"
              onChange={handleDateFilter}
            />
            <input
              type="date"
              name="endDate"
              className="border border-gray-200 shadow font-bold text-sm px-2 py-1 my-2 md:hidden"
              onChange={handleDateFilter}
            />
          </div>
        </div>

        <div className="bg-white my-2 mx-3 overflow-x-auto overflow-y-auto scroll-bar h-[50vh]">
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
                      <li className="max-md:hidden">
                        <button
                          type="button"
                          className="font-bold text-xs bg-blue-500 py-2 px-3 text-center text-white rounded-md w-full"
                          onClick={() => handleOpenModal(g)}
                        >
                          Ver comprobante
                        </button>
                      </li>
                      <li key={g._id} className="md:hidden">
                        <PDFDownloadLink
                          document={<ComprobantePago recibo={g} />}
                          fileName={`ComprobantePago-${g._id}.pdf`}
                          className="font-bold text-xs bg-blue-500 py-2 px-3 text-center text-white rounded-md w-auto"
                        >
                          Descargar comprob.
                        </PDFDownloadLink>
                      </li>
                      <li className="">
                        <button
                          type="button"
                          className="font-bold text-xs bg-red-500 py-2 px-3 text-center text-white rounded-md w-full"
                          // onClick={() => {
                          //   {
                          //     handleObtenerId(idObtenida), openModal();
                          //   }
                          // }}
                          onClick={() => deleteRecibo(params.id, g._id)}
                        >
                          Eliminar
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
          closeModal={closeModal}
          idObtenida={idObtenida}
          isOpen={isOpen}
          message={"¿Estas seguro de eliminar el comprobante?"}
          deleteTodo={""}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
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

      <dialog id="my_modal_pdf" className="modal">
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

      <div className="mb-20"></div>
    </section>
  );
};
