import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter, FaRegCalendar, FaSignal } from "react-icons/fa";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { Dropdown } from "../ui/Dropdown";
import { Search } from "../ui/Search";
import { useObtenerId } from "../../helpers/obtenerId";
import { useModal } from "../../helpers/modal";
import { useEmpleado } from "../../context/EmpleadosContext";
import { ModalComprobante } from "./ModalComprobante";
import { ModalComprobantePago } from "./ModalComprobantePago";
import { ModalEstadoEmpleados } from "./ModalEstadoEmpleados";
import { ModalPagado } from "./ModalPagado";
import { EditarEmpleadoDrawer } from "./EditarEmpleadoDrawer";
import { ModalEmpleadoObservacion } from "./ModalEmpleadoObservacion";
import { ModalGuardarDatos } from "./ModalGuardarDatos";
import { ModalAumentoSueldo } from "./ModalAumentoSueldo";
import { ModalEditarEmpleadoMoible } from "./ModalEditarEmpleadoMoible";
import { ModalCrearEmpleadoMobile } from "./ModalCrearEmpleadoMobile";
// import { ModalSeleccionarQuincena } from "./ModalSeleccionarQuincena";
// import { ModalDocumentoRecursosHumanos } from "./ModalDocumentoRecursosHumanos";
// import { ModalSeleccionarAguinaldo } from "./ModalSeleccionarAguinaldo";
import ModalEliminar from "../ui/ModalEliminar";
import Calendar from "../ui/Calendary";

export const TableEmpleadosMobile = () => {
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

  // Función para calcular el ingreso neto
  const calcularIngresoNeto = (empleados) => {
    const ingresosNetos = empleados.reduce((total, empleado) => {
      // Verificar si el empleado tiene termino_pago = 'sueldo'
      if (empleado.termino_pago === "mensual") {
        const antiquity = calculateAntiquity(empleado.fecha_ingreso);

        let total_antiguedad = 0;

        total_antiguedad =
          Number(empleado.sueldo[0]?.sueldo_basico) * (0.01 * antiquity.years);
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
          total_antiguedad +
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
        const antiquity = calculateAntiquity(empleado.fecha_ingreso);

        let total_antiguedad = 0;

        total_antiguedad =
          (Number(empleado.sueldo[0]?.quincena_cinco[0]?.quincena_cinco) +
            Number(empleado.sueldo[1]?.quincena_veinte[0]?.quincena_veinte)) *
          (0.01 * antiquity.years);
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

        const descuento = Number(
          empleado.sueldo[0]?.quincena_cinco[0].descuento_del_cinco || 0
        );

        // Calcular ingreso neto
        const ingresoNeto =
          quincenaCinco +
          produccion +
          total_antiguedad +
          asistencia +
          otros -
          banco -
          descuento;

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

        const banco = Number(empleado.sueldo[0]?.quincena_cinco[0]?.banco || 0);

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

  // Agrupar empleados por fabrica_sucursal
  const empleadosPorFabrica = filteredGastos.reduce((acc, empleado) => {
    const fabrica = empleado.fabrica_sucursal;
    if (!acc[fabrica]) {
      acc[fabrica] = [];
    }
    acc[fabrica].push(empleado);
    return acc;
  }, {});

  const ingresoTotalFiltrado = calcularIngresoNeto(filteredGastos);
  const ingresoTotalFiltradoCinco =
    calcularIngresoQuincenaDelCinco(filteredGastos);

  const ingresoTotalFiltradoVeinte =
    calcularIngresoQuincenaDelVeinte(filteredGastos);

  const ingresoTotalFiltradoBanco =
    calcularIngresoQuincenaDelCincoBanco(filteredGastos);

  const ingresoTotalFiltradoBancoMensual =
    calcularIngresoNetoBanco(filteredGastos);

  // Calcular el aguinaldo para cada empleado
  const aguinaldosIndividuales = empleados.map((g) => {
    let total_antiguedad = 0;
    let sueldo = 0;

    // Calcular la antigüedad
    const { years } = calculateAntiquity(g?.fecha_ingreso);

    if (g?.termino_pago === "mensual") {
      total_antiguedad =
        Number(g?.sueldo[0]?.sueldo_basico || 0) * (0.01 * years);

      // Calcular sueldo mensual
      sueldo =
        Number(g?.sueldo[0]?.sueldo_basico || 0) +
          Number(total_antiguedad || 0) +
          Number(g?.sueldo[0]?.comida || 0) +
          Number(g?.sueldo[0]?.premio_produccion || 0) +
          Number(g?.sueldo[0]?.premio_asistencia || 0) +
          Number(g?.sueldo[0]?.otros || 0) -
          Number(g?.sueldo[0]?.aguinaldo_proporcional || 0) -
          Number(g?.sueldo[0]?.descuento_del_cinco || 0) || 0;
    } else if (g?.termino_pago === "quincenal") {
      total_antiguedad =
        (Number(g?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0) +
          Number(g?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0)) *
        (0.01 * years);

      // Calcular sueldo quincenal
      sueldo =
        Number(g?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0) +
          Number(g?.sueldo[0]?.quincena_cinco[0]?.otros || 0) +
          Number(g?.sueldo[0]?.quincena_cinco[0]?.premio_produccion || 0) +
          Number(g?.sueldo[0]?.quincena_cinco[0]?.premio_asistencia || 0) +
          Number(g?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0) +
          Number(g?.sueldo[1]?.quincena_veinte[0]?.comida || 0) +
          Number(total_antiguedad || 0) -
          Number(g?.sueldo[0]?.quincena_cinco[0]?.aguinaldo_proporcional || 0) -
          Number(g?.sueldo[1]?.quincena_veinte[0]?.descuento_del_veinte || 0) -
          Number(g?.sueldo[0]?.quincena_cinco[0]?.descuento_del_cinco || 0) ||
        0;
    }

    // Calcular aguinaldo para el empleado actual
    const aguinaldoIndividual = sueldo / 2;

    return aguinaldoIndividual;
  });

  // Sumar todos los aguinaldos individuales para obtener el total
  const aguinaldoTotal = aguinaldosIndividuales.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return (
    <div className="md:overflow-y-scroll md:h-[100vh] scroll-bar">
      <div className="flex items-center max-md:flex-col max-md:items-stretch">
        <div className="bg-white py-4 px-5 my-10 mx-3 max-w-3xl gap-10 flex items-center max-md:flex-col max-md:gap-2">
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
            <div
              onClick={() => {
                document.getElementById("my_modal_estadisticas").showModal();
              }}
              tabIndex={0}
              role="button"
              className="text-xs font-bold text-gray-500 bg-gray-50 border py-2 px-3 flex gap-1 items-center cursor-pointer md:hidden"
            >
              <FaSignal className="text-base" /> Estadisticas
            </div>
          </div>
        </div>
      </div>
      <div className="flex max-md:flex-col gap-2 max-w-auto max-w-full">
        <Search
          value={searchTerm}
          onChange={handleSearch}
          placeholder={"Buscar el empleado por el nombre y apellido.."}
        />
      </div>
      <div className="w-auto">
        {selectedFabricaSucursal && (
          <div className="bg-white mx-3 my-5 py-3.5 px-3 flex flex-col gap-1  h-[10vh] overflow-y-scroll">
            <p className="font-bold text-blue-500 text-lg">
              <span className="text-gray-700">Fabrica/Sucursal</span>{" "}
              <span className="capitalize">{selectedFabricaSucursal}</span>.
            </p>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-blue-500">
                <p className="text-gray-600">
                  Pagar efectivo quincena del cinco + mensual
                </p>
                {formatearDinero(
                  ingresoTotalFiltrado + ingresoTotalFiltradoCinco
                )}
              </p>
              <p className="font-bold text-blue-500">
                <p className="text-gray-600">
                  Pagar efectivo quincena del veinte
                </p>
                {formatearDinero(ingresoTotalFiltradoVeinte)}
              </p>
              <p className="font-bold text-red-500">
                <p className="text-gray-600">Banco</p>
                {formatearDinero(
                  ingresoTotalFiltradoBanco + ingresoTotalFiltradoBancoMensual
                )}
              </p>
              <p className="font-bold text-red-500">
                <p className="text-gray-600">Total de empleados</p>
                {filteredGastos.length}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white py-3 px-3 my-5 mx-3 md:hidden w-auto flex gap-2">
        <Link
          className="text-sm bg-blue-500 rounded-full py-2 px-6 text-white font-semibold hover:bg-orange-500 transition-all"
          to={"/datos-empleados"}
        >
          Filtrar sueldos
        </Link>
        <button
          onClick={() =>
            document.getElementById("my_modal_crear_empleado").showModal()
          }
          className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow hover:bg-blue-500 transition-all cursor-pointer"
        >
          Crear empleado
        </button>
      </div>
      <div className="bg-white my-2 mx-3 max-md:overflow-x-auto ma">
        {Object.keys(empleadosPorFabrica).map((fabrica, index) => (
          <div className="" key={index}>
            <h2 className="px-5 py-4 uppercase text-sm font-bold text-blue-500">
              <span className="text-gray-600">Fabrica/sucursal</span> {fabrica}
            </h2>
            <table className="table">
              <thead>
                <tr className="text-gray-800">
                  <th>Empleado</th>
                  <th>Fabrica</th>
                  <th>Sector/rol</th>
                  {/* <th>Fecha ingreso</th>
                  <th>Antigüedad trabajando</th> */}
                  <th>Premio prod.</th>
                  <th>Premio Asist.</th>
                  <th>Comida</th>
                  <th>Total Antig.</th>
                  <th>Desc del 5</th>
                  <th>Desc del 20</th>
                  <th>Banco</th>
                  {empleadosPorFabrica[fabrica].some(
                    (g) => g?.termino_pago === "quincenal"
                  ) && <th>Quin 5/pagar</th>}
                  {empleadosPorFabrica[fabrica].some(
                    (g) => g?.termino_pago === "mensual"
                  ) && <th>Sueldo basico</th>}
                  {/* <th>Quin 20/pagar</th> */}
                  {empleadosPorFabrica[fabrica].some(
                    (g) => g?.termino_pago === "quincenal"
                  ) && <th>Quin 20/pagar</th>}
                  <th>Sueldo final</th>
                </tr>
              </thead>
              <tbody className="text-xs capitalize">
                {empleadosPorFabrica[fabrica].map((g) => {
                  // Calcular la antigüedad
                  const { years, months } = calculateAntiquity(
                    g?.fecha_ingreso
                  );

                  let total_antiguedad = 0;

                  if (g?.termino_pago === "mensual") {
                    total_antiguedad =
                      Number(g?.sueldo[0]?.sueldo_basico || 0) * (0.01 * years);
                  } else {
                    total_antiguedad =
                      (Number(
                        g?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0
                      ) +
                        Number(
                          g?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0
                        )) *
                      (0.01 * years);
                  }

                  let sueldo = 0;

                  if (g?.termino_pago === "quincenal") {
                    // Calcular sueldo quincenal
                    sueldo =
                      Number(
                        g?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0
                      ) +
                        Number(g?.sueldo[0]?.quincena_cinco[0]?.otros || 0) +
                        Number(
                          g?.sueldo[0]?.quincena_cinco[0]?.premio_produccion ||
                            0
                        ) +
                        Number(
                          g?.sueldo[0]?.quincena_cinco[0]?.premio_asistencia ||
                            0
                        ) +
                        Number(
                          g?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0
                        ) +
                        Number(g?.sueldo[1]?.quincena_veinte[0]?.comida || 0) +
                        Number(total_antiguedad || 0) -
                        Number(
                          g?.sueldo[1]?.quincena_veinte[0]
                            ?.descuento_del_veinte || 0
                        ) -
                        Number(
                          g?.sueldo[0]?.quincena_cinco[0]
                            ?.descuento_del_cinco || 0
                        ) || 0;
                  } else if (g?.termino_pago === "mensual") {
                    // Calcular sueldo mensual
                    sueldo =
                      Number(g?.sueldo[0]?.sueldo_basico || 0) +
                        Number(total_antiguedad || 0) +
                        Number(g?.sueldo[0]?.comida || 0) +
                        Number(g?.sueldo[0]?.premio_produccion || 0) +
                        Number(g?.sueldo[0]?.premio_asistencia || 0) +
                        Number(g?.sueldo[0]?.otros || 0) -
                        Number(g?.sueldo[0]?.descuento_del_cinco || 0) || 0;
                  }

                  return (
                    <tr key={g?._id}>
                      <td className="font-semibold">
                        {g?.nombre} {g?.apellido}
                      </td>
                      <td className="font-semibold">{g?.fabrica_sucursal}</td>
                      <td className="font-semibold">{g?.sector_trabajo}</td>
                      <td className="font-bold text-green-500">
                        {formatearDinero(
                          g?.termino_pago === "quincenal"
                            ? Number(
                                g?.sueldo[0]?.quincena_cinco[0]
                                  ?.premio_produccion || 0
                              )
                            : Number(g?.sueldo[0]?.premio_produccion || 0)
                        )}
                      </td>
                      <td className="font-semibold text-green-500">
                        {formatearDinero(
                          g?.termino_pago === "quincenal"
                            ? Number(
                                g?.sueldo[0]?.quincena_cinco[0]
                                  ?.premio_asistencia || 0
                              )
                            : Number(g?.sueldo[0]?.premio_asistencia || 0)
                        )}
                      </td>
                      <td className="font-semibold text-green-500">
                        {formatearDinero(
                          g?.termino_pago === "quincenal"
                            ? Number(
                                g?.sueldo[1]?.quincena_veinte[0]?.comida || 0
                              )
                            : Number(g?.sueldo[0]?.comida || 0)
                        )}
                      </td>
                      <td className="font-semibold text-blue-500">
                        {formatearDinero(total_antiguedad)}
                      </td>
                      <td className="font-semibold text-red-600">
                        {formatearDinero(
                          g?.termino_pago === "quincenal"
                            ? Number(
                                g?.sueldo[0]?.quincena_cinco[0]
                                  ?.descuento_del_cinco || 0
                              )
                            : Number(g?.sueldo[0]?.descuento_del_cinco || 0)
                        )}
                      </td>
                      <td className="font-semibold text-red-600">
                        {formatearDinero(
                          g?.termino_pago === "quincenal"
                            ? Number(
                                g?.sueldo[1]?.quincena_veinte[0]
                                  ?.descuento_del_veinte || 0
                              )
                            : Number(0)
                        )}
                      </td>

                      <td className="font-semibold text-red-600">
                        {formatearDinero(
                          g?.termino_pago === "quincenal"
                            ? Number(
                                g?.sueldo[0]?.quincena_cinco[0]?.banco || 0
                              )
                            : Number(g?.sueldo[0]?.banco || 0)
                        )}
                      </td>
                      <td className="font-semibold">
                        {formatearDinero(
                          g?.termino_pago === "quincenal"
                            ? Number(
                                g?.sueldo[0]?.quincena_cinco[0]
                                  ?.quincena_cinco || 0
                              ) +
                                Number(
                                  g?.sueldo[0]?.quincena_cinco[0]?.otros || 0
                                ) +
                                Number(
                                  g?.sueldo[0]?.quincena_cinco[0]
                                    ?.premio_produccion || 0
                                ) +
                                Number(
                                  g?.sueldo[0]?.quincena_cinco[0]
                                    ?.premio_asistencia || 0
                                ) +
                                Number(total_antiguedad) -
                                Number(
                                  g?.sueldo[0]?.quincena_cinco[0]?.banco || 0
                                ) -
                                Number(
                                  g?.sueldo[0]?.quincena_cinco[0]
                                    ?.descuento_del_cinco || 0
                                )
                            : Number(g?.sueldo[0]?.sueldo_basico || 0) +
                                Number(total_antiguedad || 0) +
                                Number(g?.sueldo[0]?.comida || 0) +
                                Number(g?.sueldo[0]?.premio_produccion || 0) +
                                Number(g?.sueldo[0]?.premio_asistencia || 0) +
                                Number(g?.sueldo[0]?.otros || 0) -
                                Number(g?.sueldo[0]?.banco || 0) -
                                Number(g?.sueldo[0]?.descuento_del_cinco || 0)
                        )}
                      </td>
                      {g.termino_pago === "mensual" ? (
                        ""
                      ) : (
                        <td className="font-semibold">
                          {formatearDinero(
                            g?.termino_pago === "quincenal"
                              ? Number(
                                  g?.sueldo[1]?.quincena_veinte[0]
                                    ?.quincena_veinte || 0
                                ) +
                                  Number(
                                    g?.sueldo[1]?.quincena_veinte[0]?.comida ||
                                      0
                                  ) -
                                  Number(
                                    g?.sueldo[1]?.quincena_veinte[0]
                                      ?.descuento_del_veinte || 0
                                  )
                              : Number(0)
                          )}
                        </td>
                      )}
                      <td className="font-semibold">
                        <span className="bg-blue-500 py-1 px-2 rounded text-white">
                          {" "}
                          {formatearDinero(sueldo)}
                        </span>
                      </td>

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
                              className="hover:text-blue-500 font-bold"
                              onClick={() => {
                                handleObtenerId(g?._id),
                                  document
                                    .getElementById(
                                      "my_modal_editar_empleado_mobile"
                                    )
                                    .showModal();
                              }}
                            >
                              Editar empleado
                            </button>
                          </li>
                          <li className="max-md:hidden">
                            <button
                              onClick={() => {
                                handleObtenerId(g._id);
                                document
                                  .getElementById(
                                    "my_modal_observacion_empleado"
                                  )
                                  .showModal();
                              }}
                              className="hover:text-blue-500 font-bold"
                              type="button"
                            >
                              Observación empleado
                            </button>
                          </li>
                          <li className="max-md:hidden">
                            <label
                              onClick={() => handleObtenerId(g._id)}
                              htmlFor="my-drawer-editar"
                              className="hover:text-blue-500 font-bold"
                            >
                              Editar empleado
                            </label>
                          </li>
                          <li className="max-md:hidden">
                            <button
                              onClick={() => {
                                handleObtenerId(g._id);
                                document
                                  .getElementById(
                                    "my_modal_editar_estado_empleado"
                                  )
                                  .showModal();
                              }}
                              className="hover:text-blue-500 font-bold"
                              type="button"
                            >
                              Cambiar el estado
                            </button>
                          </li>
                          <li className="max-md:hidden">
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
                                handleObtenerId(g._id);
                                openModal();
                              }}
                              className="hover:text-blue-500 font-bold"
                              type="button"
                            >
                              Eliminar el empleado
                            </button>
                          </li>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <ModalEliminar
        isOpen={isOpen}
        closeModal={closeModal}
        deleteTodo={deleteEmpleado}
        idObtenida={idObtenida}
        message={"¿Deseas eliminar el empleado?"}
      />

      <ModalVerEstadisticas
        empleados={empleados}
        ingresoTotal={ingresoTotal}
        ingresoTotalQuincenaBanco={ingresoTotalQuincenaBanco}
        ingresoTotalQuincenaCinco={ingresoTotalQuincenaCinco}
        ingresoTotalQuincenaCincoBanco={ingresoTotalQuincenaCincoBanco}
        ingresoTotalQuincenaVeinte={ingresoTotalQuincenaVeinte}
      />

      <ModalEditarEmpleadoMoible idObtenida={idObtenida} />
      <ModalCrearEmpleadoMobile />
    </div>
  );
};

const ModalVerEstadisticas = ({
  ingresoTotalQuincenaCinco,
  ingresoTotal,
  ingresoTotalQuincenaVeinte,
  ingresoTotalQuincenaCincoBanco,
  ingresoTotalQuincenaBanco,
  empleados,
}) => {
  return (
    <dialog id="my_modal_estadisticas" className="modal">
      <div className="modal-box w-auto rounded-none py-16">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <p className="font-bold mb-3 text-blue-500">Estadisticas empleados</p>
        </div>
        <ul tabIndex={0} className="grid grid-cols-1 gap-3">
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
          <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
            <p className="text-sm font-semibold text-gray-700">
              Total de empleados cargados
            </p>
            <p className="text-blue-500 text-lg font-bold">
              {empleados.length}
            </p>
          </div>
        </ul>
      </div>
    </dialog>
  );
};
