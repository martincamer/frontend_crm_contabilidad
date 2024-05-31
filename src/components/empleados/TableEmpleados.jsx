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
import { useObtenerId } from "../../helpers/obtenerId";
import { useModal } from "../../helpers/modal";
import { useEmpleado } from "../../context/EmpleadosContext";
import { ModalComprobante } from "./ModalComprobante";
import { ModalComprobantePago } from "./ModalComprobantePago";
import { ModalEstadoEmpleados } from "./ModalEstadoEmpleados";
import { ModalPagado } from "./ModalPagado";
import { EditarEmpleadoDrawer } from "./EditarEmpleadoDrawer";
import { ModalEmpleadoObservacion } from "./ModalEmpleadoObservacion";
import Calendar from "../ui/Calendary";
import ModalEliminar from "../ui/ModalEliminar";
import { ModalGuardarDatos } from "./ModalGuardarDatos";
import { ModalAumentoSueldo } from "./ModalAumentoSueldo";
import { ModalSeleccionarQuincena } from "./ModalSeleccionarQuincena";

export const TableEmpleados = () => {
  const { click, openSearch } = useSearch();
  const { deleteEmpleado, getEmpleados, empleados, getFabricas, fabricas } =
    useEmpleado();

  useEffect(() => {
    getEmpleados();
    getFabricas();
  }, []);

  //Search
  const [currentPage, setCurrentPage] = useState(1);
  const [ventasPerPage] = useState(10); // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda
  const [selectedFabricaSucursal, setSelectedFabricaSucursal] = useState("");

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

  const filteredGastos = empleados.filter(
    (venta) =>
      // venta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // venta.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${venta.nombre} ${venta.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedFabricaSucursal === "" ||
        venta.fabrica_sucursal === selectedFabricaSucursal)
  );

  const fabricasSucursalesOptions = [
    ...new Set(empleados.map((emp) => emp.fabrica_sucursal)),
  ];

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

  //estado gastado
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

  // Función para calcular el ingreso neto
  const calcularIngresoNeto = (empleados) => {
    const ingresosNetos = empleados.reduce((total, empleado) => {
      // Verificar si el empleado tiene termino_pago = 'sueldo'
      if (empleado.termino_pago === "mensual") {
        // Obtener el sueldo básico, comida, banco y descuentos
        const sueldoBasico = Number(empleado.sueldo[0]?.sueldo_basico || 0);

        const comida = Number(empleado.sueldo[0]?.comida || 0);
        const premio_produccion = Number(
          empleado.sueldo[0]?.premio_produccion || 0
        );
        const premio_asistencia = Number(
          empleado.sueldo[0]?.premio_asistencia || 0
        );

        const otros = Number(empleado.sueldo[0]?.otros || 0);
        const banco = Number(empleado.sueldo[0]?.banco || 0);

        const descuento = Number(empleado.sueldo[0]?.descuento_del_cinco || 0);

        // Calcular ingreso neto
        const ingresoNeto =
          sueldoBasico +
          premio_produccion +
          premio_asistencia +
          otros +
          comida -
          banco -
          descuento;

        // Sumar al total
        total += ingresoNeto;
      }
      return total;
    }, 0); // Iniciar el total en 0

    return ingresosNetos;
  };

  // Función para calcular el ingreso neto
  const calcularIngresoNetoBanco = (empleados) => {
    const ingresosNetos = empleados.reduce((total, empleado) => {
      // Verificar si el empleado tiene termino_pago = 'sueldo'
      if (empleado.termino_pago === "mensual") {
        const banco = Number(empleado.sueldo[0]?.banco || 0);

        // Calcular ingreso neto
        const ingresoNeto = banco;

        // Sumar al total
        total += ingresoNeto;
      }
      return total;
    }, 0); // Iniciar el total en 0

    return ingresosNetos;
  };

  // Calcular ingreso quincena del 5
  const calcularIngresoQuincenaDelCinco = (empleados) => {
    const ingresosNetos = empleados.reduce((total, empleado) => {
      // Verificar si el empleado tiene termino_pago = 'sueldo'
      if (empleado.termino_pago === "quincenal") {
        // Obtener el sueldo básico, comida, banco y descuentos
        const quincenaCinco = Number(
          empleado.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0
        );

        const banco = Number(empleado.sueldo[0]?.quincena_cinco[0].banco || 0);

        const produccion = Number(
          empleado.sueldo[0]?.quincena_cinco[0].premio_produccion || 0
        );

        const asistencia = Number(
          empleado.sueldo[0]?.quincena_cinco[0].premio_asistencia || 0
        );

        const otros = Number(empleado.sueldo[0]?.quincena_cinco[0].otros || 0);
        console.log("otross", otros);

        const descuento = Number(
          empleado.sueldo[0]?.quincena_cinco[0].descuento_del_cinco || 0
        );

        // Calcular ingreso neto
        const ingresoNeto =
          quincenaCinco + produccion + asistencia + banco - otros - descuento;

        // Sumar al total
        total += ingresoNeto;
      }
      return total;
    }, 0); // Iniciar el total en 0

    return ingresosNetos;
  };

  // Calcular ingreso quincena del 5
  const calcularIngresoQuincenaDelCincoBanco = (empleados) => {
    const ingresosNetos = empleados.reduce((total, empleado) => {
      // Verificar si el empleado tiene termino_pago = 'sueldo'
      if (empleado.termino_pago === "quincenal") {
        // Obtener el sueldo básico, comida, banco y descuentos

        const banco = Number(empleado.sueldo[0]?.quincena_cinco[0].banco || 0);

        // Calcular ingreso neto
        const ingresoNeto = banco;

        // Sumar al total
        total += ingresoNeto;
      }
      return total;
    }, 0); // Iniciar el total en 0

    return ingresosNetos;
  };

  // Calcular ingreso quincena del veinte
  const calcularIngresoQuincenaDelVeinte = (empleados) => {
    const ingresosNetos = empleados.reduce((total, empleado) => {
      // Verificar si el empleado tiene termino_pago = 'sueldo'
      if (empleado.termino_pago === "quincenal") {
        // Obtener el sueldo básico, comida, banco y descuentos
        const quincenaCinco = Number(
          empleado.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0
        );

        const comida = Number(
          empleado.sueldo[1]?.quincena_veinte[0]?.comida || 0
        );
        const descuento = Number(
          empleado.sueldo[1]?.quincena_veinte[0].descuento_del_veinte || 0
        );

        // Calcular ingreso neto
        const ingresoNeto = quincenaCinco + comida - descuento;

        // Sumar al total
        total += ingresoNeto;
      }
      return total;
    }, 0); // Iniciar el total en 0

    return ingresosNetos;
  };

  // Ejemplo de uso
  const ingresoTotal = calcularIngresoNeto(empleados);

  const ingresoTotalQuincenaCinco = calcularIngresoQuincenaDelCinco(empleados);

  const ingresoTotalQuincenaCincoBanco = calcularIngresoNetoBanco(empleados);
  const ingresoTotalQuincenaBanco =
    calcularIngresoQuincenaDelCincoBanco(empleados);

  const ingresoTotalQuincenaVeinte =
    calcularIngresoQuincenaDelVeinte(empleados);

  // const totalQuincenaCinco = empleados.reduce((acc, empleado) => {
  //   const quincenaCincoSueldo = empleado?.sueldo?.reduce(
  //     (sueldoAcc, sueldoItem) => {
  //       if (sueldoItem.quincena_cinco) {
  //         const quincenaCincoTotal = sueldoItem.quincena_cinco.reduce(
  //           (cincoAcc, quincena) => {
  //             return (
  //               cincoAcc +
  //               parseFloat(quincena.quincena_cinco) +
  //               parseFloat(quincena.otros) +
  //               parseFloat(quincena.premio_produccion) +
  //               parseFloat(quincena.premio_asistencia) -
  //               parseFloat(quincena.descuento_del_cinco) -
  //               parseFloat(quincena.banco)
  //             );
  //           },
  //           0
  //         );
  //         return sueldoAcc + quincenaCincoTotal;
  //       }
  //       return sueldoAcc;
  //     },
  //     0
  //   );
  //   return acc + quincenaCincoSueldo;
  // }, 0);

  const totalSueldoMensual = empleados.reduce((acc, empleado) => {
    if (empleado.termino_pago === "mensual") {
      const sueldoMensual = empleado?.sueldo?.reduce(
        (sueldoAcc, sueldoItem) => {
          const sueldoTotal =
            parseFloat(sueldoItem.sueldo_basico || 0) +
            parseFloat(sueldoItem.comida || 0) +
            parseFloat(sueldoItem.premio_produccion || 0) +
            parseFloat(sueldoItem.premio_asistencia || 0) -
            parseFloat(sueldoItem.descuento_del_cinco || 0);
          return sueldoAcc + sueldoTotal;
        },
        0
      );
      return acc + sueldoMensual;
    }
    return acc;
  }, 0);

  console.log("ingeeso total mensual", totalSueldoMensual);
  console.log("ingreso total", ingresoTotal);
  console.log(empleados);

  // const totalQuincenaVeinte = empleados.reduce((acc, empleado) => {
  //   const quincenaVeinteSueldo = empleado.sueldo.reduce(
  //     (sueldoAcc, sueldoItem) => {
  //       if (sueldoItem.quincena_veinte) {
  //         const quincenaVeinteTotal = sueldoItem.quincena_veinte.reduce(
  //           (veinteAcc, quincena) => {
  //             return (
  //               veinteAcc +
  //               parseFloat(quincena.quincena_veinte) +
  //               parseFloat(quincena.comida) -
  //               parseFloat(quincena.descuento_del_veinte)
  //             );
  //           },
  //           0
  //         );
  //         return sueldoAcc + quincenaVeinteTotal;
  //       }
  //       return sueldoAcc;
  //     },
  //     0
  //   );
  //   return acc + quincenaVeinteSueldo;
  // }, 0);

  // console.log(totalQuincenaCinco);

  return (
    <div className="overflow-y-scroll h-[100vh] scroll-bar">
      <div className="flex items-center">
        <div className="bg-white py-2 px-5 my-5 mx-3 max-w-3xl gap-10 flex items-center">
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
                className="dropdown-content z-[105] shadow-xl border border-gray-200 py-5 px-5 rounded-none bg-base-100 w-82 cursor-pointer mt-2"
              >
                <div className="">
                  <label htmlFor="" className="uppercase font-bold text-xs">
                    Filtrar por fabrica
                  </label>
                  <select
                    className="uppercase text-xs font-semibold outline-none border py-3 px-2 focus:border-blue-500"
                    value={selectedFabricaSucursal}
                    onChange={(e) => setSelectedFabricaSucursal(e.target.value)}
                  >
                    <option
                      className="uppercase text-xs font-extrabold text-blue-500"
                      value=""
                    >
                      Todas las fábricas/sucursales
                    </option>
                    {fabricas.map((fab, index) => (
                      <option
                        className="uppercase text-xs font-bold"
                        key={index}
                        value={fab.nombre}
                      >
                        {fab.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </ul>
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
                className="dropdown-content z-[105] shadow-xl border border-gray-200 py-5 px-5 rounded-none bg-base-100 cursor-pointer grid grid-cols-2 gap-2 w-[700px] mt-2"
              >
                <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Total a pagar quicena del 5 / efectivo
                  </p>
                  <p className="text-blue-500 text-lg font-bold">
                    {formatearDinero(ingresoTotalQuincenaCinco + ingresoTotal)}
                  </p>
                </div>

                <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Total a pagar quincena del 20 / efectivo
                  </p>
                  <p className="text-blue-500 text-lg font-bold">
                    {formatearDinero(ingresoTotalQuincenaVeinte)}
                  </p>
                </div>
                <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Total a pagar quicena del 5 / banco
                  </p>
                  <p className="text-blue-500 text-lg font-bold">
                    {formatearDinero(
                      ingresoTotalQuincenaCincoBanco + ingresoTotalQuincenaBanco
                    )}
                  </p>
                </div>
                {/* <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Total a pagar mensual / efectivo
                  </p>
                  <p className="text-blue-500 text-lg font-bold">
                    {formatearDinero(ingresoTotal)}
                  </p>
                </div> */}
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-white py-2 px-6 flex gap-2">
          <Link
            className="text-sm bg-blue-500 rounded-full py-2 px-6 text-white font-semibold hover:bg-orange-500 transition-all"
            to={"/datos-empleados"}
          >
            Buscar sueldos mensuales
          </Link>
          <button
            type="button"
            className="text-sm bg-green-500 rounded-full py-2 px-6 text-white font-semibold hover:bg-green-600 transition-all"
            onClick={() => {
              document.getElementById("my_modal_guardar_datos").showModal();
            }}
          >
            Guardar tabla mensual
          </button>

          <button
            type="button"
            className="text-sm bg-green-500 rounded-full py-2 px-6 text-white font-semibold hover:bg-green-600 transition-all"
            onClick={() => {
              document.getElementById("my_modal_aumento_sueldo").showModal();
            }}
          >
            Aumentar sueldos
          </button>

          <button
            type="button"
            className="text-sm bg-green-500 rounded-full py-2 px-6 text-white font-semibold hover:bg-green-600 transition-all"
            onClick={() => {
              document
                .getElementById("my_modal_seleccionar_quincena")
                .showModal();
            }}
          >
            Imprimir quincenas
          </button>
        </div>
      </div>
      <Search
        value={searchTerm}
        onChange={handleSearch}
        placeholder={"Buscar el empleado por el nombre y apellido.."}
      />
      <div className="bg-white my-2 mx-3">
        <table className="table">
          <thead>
            <tr className="text-gray-800">
              {/* <th>Referencia</th> */}
              <th>Empleado</th>
              <th>Fecha ingreso</th>
              <th>Fabricas/Sucursal</th>
              <th>Antigüedad trabajando</th>
              <th>Sueldo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody className="text-xs capitalize">
            {filteredGastos?.map((g) => {
              // Calcular la antigüedad
              const { years, months } = calculateAntiquity(g.fecha_ingreso);

              const antiquity = calculateAntiquity(g.fecha_ingreso);

              let total_antiguedad = 0;

              if (g.termino_pago === "mensual") {
                total_antiguedad =
                  Number(g.sueldo[0]?.sueldo_basico) * (0.01 * antiquity.years);
              } else {
                total_antiguedad =
                  (Number(g.sueldo[0]?.quincena_cinco[0]?.quincena_cinco) +
                    Number(g.sueldo[1]?.quincena_veinte[0]?.quincena_veinte)) *
                  (0.01 * antiquity.years);
              }

              let sueldo = "";

              if (g.termino_pago === "quincenal") {
                // Si es quincenal, obtener el sueldo correspondiente
                sueldo =
                  Number(g.sueldo[0]?.quincena_cinco[0]?.quincena_cinco) +
                    Number(g.sueldo[0]?.quincena_cinco[0]?.otros) +
                    Number(g.sueldo[0]?.quincena_cinco[0]?.premio_produccion) +
                    Number(g.sueldo[0]?.quincena_cinco[0]?.premio_asistencia) +
                    Number(g.sueldo[1]?.quincena_veinte[0]?.quincena_veinte) +
                    Number(g.sueldo[1]?.quincena_veinte[0]?.comida) +
                    Number(total_antiguedad) -
                    Number(
                      g.sueldo[1]?.quincena_veinte[0]?.descuento_del_veinte || 0
                    ) -
                    Number(
                      g.sueldo[0]?.quincena_cinco[0]?.descuento_del_cinco || 0
                    ) || 0;
              } else if (g.termino_pago === "mensual") {
                // Si es mensual, obtener el sueldo mensual
                sueldo =
                  Number(g.sueldo[0]?.sueldo_basico) +
                    Number(total_antiguedad) +
                    Number(g.sueldo[0]?.comida) +
                    Number(g.sueldo[0]?.premio_produccion) +
                    Number(g.sueldo[0]?.premio_asistencia) +
                    Number(g.sueldo[0]?.otros) -
                    Number(g.sueldo[0]?.descuento_del_cinco) || "";
              }

              return (
                <tr key={g._id}>
                  {/* <th>{truncateText(g._id, 6)}</th> */}
                  <th>
                    {g.nombre} {g.apellido}
                  </th>
                  <th>{updateFecha(g.fecha_ingreso)}</th>{" "}
                  <th>{g.fabrica_sucursal}</th>{" "}
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
                              .getElementById("my_modal_observacion_empleado")
                              .showModal();
                          }}
                          className="hover:text-blue-500 font-bold"
                          type="button"
                        >
                          {/* Editar empleado */}
                          Observación empleado
                        </button>
                      </li>
                      <li>
                        <button
                          className="hover:text-blue-500 font-bold"
                          type="button"
                        >
                          {/* Editar empleado */}
                          <label
                            onClick={() => handleObtenerId(g._id)}
                            htmlFor="my-drawer-editar"
                            className="hover:text-blue-500 font-bold"
                          >
                            Editar empleado
                          </label>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleObtenerId(g._id);
                            document
                              .getElementById("my_modal_editar_estado_empleado")
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
                      <li>
                        <button
                          onClick={() => {
                            handleObtenerId(g._id), openModal();
                          }}
                          className="hover:text-blue-500 font-bold"
                          type="button"
                        >
                          Eliminar el empleado
                        </button>
                      </li>{" "}
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <SearchButton open={() => openSearch()} /> */}
      {/* {click && (
     
      )} */}
      {/* 
      <div className="flex pb-12 justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowLeft />
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
                {number}
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
      </div> */}

      {/* Modal editar estado */}
      <ModalGuardarDatos empleados={empleados} />
      <ModalEstadoEmpleados idObtenida={idObtenida} />
      <ModalComprobante idObtenida={idObtenida} />
      <ModalComprobantePago idObtenida={idObtenida} />
      <ModalPagado />

      <ModalEliminar
        isOpen={isOpen}
        closeModal={closeModal}
        deleteTodo={deleteEmpleado}
        idObtenida={idObtenida}
        message={"¿Deseas eliminar el empleado?"}
      />

      <EditarEmpleadoDrawer idObtenida={idObtenida} />
      <ModalEmpleadoObservacion idObtenida={idObtenida} />
      <ModalAumentoSueldo />
      <ModalSeleccionarQuincena />
    </div>
  );
};
