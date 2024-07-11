import { useEffect, useState } from "react";
import { updateFecha } from "../../helpers/FechaUpdate";
import { formatearDinero } from "../../helpers/FormatearDinero";

export const ModalObservacionEmpleadoCompleto = ({
  idObtenida,
  empleados: data,
}) => {
  const [empleado, setEmpleado] = useState([]); // Estado para almacenar el empleado encontrado
  const [empleados, setEmpleados] = useState([data]);

  console.log("id", idObtenida);
  console.log("empleados", empleados);

  // useEffect(() => {
  //   if (empleados && empleados.length > 0) {
  //     const empleadoEncontrado = empleados?.find(
  //       (empleado) => empleado._id === idObtenida
  //     );

  //     if (empleadoEncontrado) {
  //       setEmpleado(empleadoEncontrado);
  //     } else {
  //       console.log(`No se encontró empleado con el ID ${idObtenida}`);
  //     }
  //   } else {
  //     console.log("El array de empleados está vacío o no está definido.");
  //   }
  // }, [idObtenida, empleados]);

  // // Función para filtrar empleados por IDs
  // function filtrarEmpleadosPorIds(ids, empleados) {
  //   return empleados?.filter((empleado) => ids?.includes(empleado.id));
  // }

  // // Filtrar empleados por los IDs en idsEmpleados
  // let empleadosFiltrados = filtrarEmpleadosPorIds(idObtenida, empleados);

  // console.log("Empleados filtrados:", empleadosFiltrados);

  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
  };

  const empleadoEncontrado = empleados.find(
    (empleado) => empleado._id === idObtenida
  );

  console.log(empleadoEncontrado);

  const edad_empleado = calculateAntiquity(empleado?.fecha_nacimiento);
  const antiguedad_empleado = calculateAntiquity(empleado?.fecha_ingreso);

  let total_antiguedad = 0;
  if (empleado?.termino_pago === "mensual") {
    total_antiguedad =
      Number(empleado?.sueldo[0]?.sueldo_basico) *
      (0.01 * antiguedad_empleado.years);
  } else {
    const quincenaCinco = empleado?.sueldo?.[0]?.quincena_cinco?.[0]
      ?.quincena_cinco
      ? Number(empleado.sueldo[0].quincena_cinco[0].quincena_cinco)
      : 0;
    const quincenaVeinte = empleado?.sueldo?.[1]?.quincena_veinte?.[0]
      ?.quincena_veinte
      ? Number(empleado.sueldo[1].quincena_veinte[0].quincena_veinte)
      : 0;

    total_antiguedad =
      (quincenaCinco + quincenaVeinte) * (0.01 * antiguedad_empleado.years);
  }

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

  const sueldoBasico = Number(empleado?.sueldo?.[0]?.sueldo_basico || 0);
  const banco = Number(empleado?.sueldo?.[0]?.banco || 0);
  const descuento = Number(empleado?.sueldo?.[0]?.descuento_del_cinco || 0);

  const comida = Number(empleado?.sueldo?.[0]?.comida || 0);
  const premio_asistencia = Number(
    empleado?.sueldo?.[0]?.premio_asistencia || 0
  );
  const premio_produccion = Number(
    empleado?.sueldo?.[0]?.premio_produccion || 0
  );
  const otros = Number(empleado?.sueldo?.[0]?.otros || 0);
  const obs = empleado?.sueldo?.[0]?.observacion || "";

  return (
    <dialog id="my_modal_observacion" className="modal">
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
                              ?.quincena_cinco
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500">
                      Banco:{" "}
                      <span className="capitalize text-red-600">
                        -
                        {formatearDinero(
                          Number(empleado?.sueldo[0]?.quincena_cinco[0]?.banco)
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
                              ?.descuento_del_cinco
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
                              ?.premio_asistencia
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
                              ?.premio_produccion
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500 flex flex-col w-2/3">
                      Observación:{" "}
                      <span className="capitalize text-gray-600 text-wrap border py-2 px-3 text-sm">
                        {
                          empleado?.sueldo[0]?.quincena_cinco[0]
                            ?.observacion_cinco
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
                              ?.quincena_veinte
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500">
                      Comida:{" "}
                      <span className="capitalize text-gray-600">
                        +
                        {formatearDinero(
                          Number(
                            empleado?.sueldo[1]?.quincena_veinte[0]?.comida
                          )
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
                              ?.descuento_del_veinte
                          )
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-blue-500 flex flex-col">
                      Observación del 20:{" "}
                      <span className="capitalize text-gray-600 text-wrap border py-2 px-3 text-sm">
                        {
                          empleado?.sueldo[1]?.quincena_veinte[0]
                            ?.observacion_veinte
                        }
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <p className="font-bold text-orange-500 border-b-[2px] border-orange-500">
                      Sueldo mensual
                    </p>
                  </div>
                  <p className="font-semibold text-blue-500">
                    Sueldo basico sin aumentos:{" "}
                    <span className="capitalize text-gray-600">
                      {formatearDinero(sueldoBasico)}
                    </span>
                  </p>
                  <p className="font-semibold text-blue-500">
                    Comida:{" "}
                    <span className="capitalize text-gray-600">
                      +{formatearDinero(comida)}
                    </span>
                  </p>
                  <p className="font-semibold text-blue-500">
                    Otros:{" "}
                    <span className="capitalize text-gray-600">
                      +{formatearDinero(otros)}
                    </span>
                  </p>
                  <p className="font-semibold text-blue-500">
                    Premio asistencia:{" "}
                    <span className="capitalize text-gray-600">
                      +{formatearDinero(Number(premio_asistencia))}
                    </span>
                  </p>
                  <p className="font-semibold text-blue-500">
                    Premio producción:{" "}
                    <span className="capitalize text-gray-600">
                      +{formatearDinero(Number(premio_produccion))}
                    </span>
                  </p>
                  <p className="font-semibold text-blue-500">
                    Banco:{" "}
                    <span className="capitalize text-gray-600">
                      -{formatearDinero(Number(banco))}
                    </span>
                  </p>
                  <p className="font-semibold text-blue-500">
                    Descuento:{" "}
                    <span className="capitalize text-gray-600">
                      -{formatearDinero(Number(descuento))}
                    </span>
                  </p>
                  <div className="flex mt-1 gap-2 items-center font-semibold text-blue-500">
                    Saldo final:{" "}
                    <p className="font-semibold bg-orange-500 py-1 px-2 text-white rounded-xl">
                      {formatearDinero(
                        Number(sueldoBasico) +
                          Number(comida) +
                          Number(otros) +
                          Number(premio_asistencia) +
                          Number(total_antiguedad) +
                          Number(premio_produccion) -
                          Number(banco) -
                          Number(descuento)
                      ) || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-1/3">
                  <p className="font-semibold text-blue-500">Observación</p>
                  <span className="capitalize text-gray-600 text-wrap border py-4 px-3 text-sm">
                    {obs}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};
