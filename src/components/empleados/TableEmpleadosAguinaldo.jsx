import { useEffect, useState } from "react";
import { FaFilter, FaRegCalendar, FaSignal } from "react-icons/fa";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { Dropdown } from "../ui/Dropdown";
import { Search } from "../ui/Search";
import { useSearch } from "../../helpers/openSearch";
import { useObtenerId } from "../../helpers/obtenerId";
import { useModal } from "../../helpers/modal";
import { useEmpleado } from "../../context/EmpleadosContext";
import { ModalComprobante } from "./ModalComprobante";
import { ModalComprobantePago } from "./ModalComprobantePago";
import { ModalEstadoEmpleados } from "./ModalEstadoEmpleados";
import { ModalPagado } from "./ModalPagado";
import { ModalEmpleadoObservacion } from "./ModalEmpleadoObservacion";
import { ModalGuardarDatos } from "./ModalGuardarDatos";
import { ModalAumentoSueldo } from "./ModalAumentoSueldo";
import { ModalSeleccionarQuincena } from "./ModalSeleccionarQuincena";
import { ModalDocumentoRecursosHumanos } from "./ModalDocumentoRecursosHumanos";
import { ModalSeleccionarAguinaldo } from "./ModalSeleccionarAguinaldo";
import { EditarEmpleadoDrawerAguinaldo } from "./EditarEmpleadoDrawerAguinaldo";
import Calendar from "../ui/Calendary";
import ModalEliminar from "../ui/ModalEliminar";
import { CgLaptop } from "react-icons/cg";

export const TableEmpleadosAguinaldo = () => {
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

  // Agrupar empleados por fabrica_sucursal
  const empleadosPorFabrica = filteredGastos.reduce((acc, empleado) => {
    const fabrica = empleado.fabrica_sucursal;
    if (!acc[fabrica]) {
      acc[fabrica] = [];
    }
    acc[fabrica].push(empleado);
    return acc;
  }, {});

  const ingresoTotalFiltradoBanco =
    calcularIngresoQuincenaDelCincoBanco(filteredGastos);

  const ingresoTotalFiltradoBancoMensual =
    calcularIngresoNetoBanco(filteredGastos);

  // Función para calcular los meses de antigüedad desde la fecha de ingreso
  const calcularMesesAntiguedad = (fechaIngreso) => {
    const fechaIngresoDate = new Date(fechaIngreso);
    const fechaActual = new Date();

    // Calcular diferencia en meses
    const diff =
      (fechaActual.getFullYear() - fechaIngresoDate.getFullYear()) * 12 +
      (fechaActual.getMonth() - fechaIngresoDate.getMonth());

    return diff;
  };

  const calcularAntiguedad = (fechaIngreso) => {
    const fechaIngresoDate = new Date(fechaIngreso);
    const fechaActual = new Date();

    // Calcular años y meses de diferencia
    let yearsDiff = fechaActual.getFullYear() - fechaIngresoDate.getFullYear();
    let monthsDiff = fechaActual.getMonth() - fechaIngresoDate.getMonth();

    // Ajustar si la fecha actual es anterior al día de ingreso en el mismo mes
    if (
      monthsDiff < 0 ||
      (monthsDiff === 0 && fechaActual.getDate() < fechaIngresoDate.getDate())
    ) {
      yearsDiff--;
      monthsDiff += 12; // Sumar 12 meses para ajustar la diferencia negativa
    }

    return { years: yearsDiff, months: monthsDiff };
  };

  const aguinaldosIndividuales = empleados.map((e) => {
    let total_antiguedad = 0;
    let sueldo = 0;

    // Calcular la antigüedad
    const { years } = calculateAntiquity(e?.fecha_ingreso);

    if (e?.termino_pago === "mensual") {
      total_antiguedad =
        Number(e?.sueldo[0]?.sueldo_basico || 0) * (0.01 * years);

      // Calcular sueldo mensual
      sueldo =
        Number(e?.sueldo[0]?.sueldo_basico || 0) +
          Number(total_antiguedad || 0) +
          Number(e?.sueldo[0]?.comida || 0) +
          Number(e?.sueldo[0]?.premio_produccion || 0) +
          Number(e?.sueldo[0]?.premio_asistencia || 0) +
          Number(e?.sueldo[0]?.otros || 0) -
          Number(e?.sueldo[0]?.aguinaldo_proporcional || 0) -
          Number(e?.sueldo[0]?.descuento_del_cinco || 0) || 0;
    } else if (e?.termino_pago === "quincenal") {
      total_antiguedad =
        (Number(e?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0) +
          Number(e?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0)) *
        (0.01 * years);

      // Calcular sueldo quincenal
      sueldo =
        Number(e?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0) +
          Number(e?.sueldo[0]?.quincena_cinco[0]?.otros || 0) +
          Number(e?.sueldo[0]?.quincena_cinco[0]?.premio_produccion || 0) +
          Number(e?.sueldo[0]?.quincena_cinco[0]?.premio_asistencia || 0) +
          Number(e?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0) +
          Number(e?.sueldo[1]?.quincena_veinte[0]?.comida || 0) +
          Number(total_antiguedad || 0) -
          Number(e?.sueldo[0]?.quincena_cinco[0]?.aguinaldo_proporcional || 0) -
          Number(e?.sueldo[1]?.quincena_veinte[0]?.descuento_del_veinte || 0) -
          Number(e?.sueldo[0]?.quincena_cinco[0]?.descuento_del_cinco || 0) ||
        0;
    }

    // Calcular aguinaldo para el empleado actual
    const antiguedadEnMeses = calcularMesesAntiguedad(e.fecha_ingreso);
    let aguinaldoIndividual = 0;

    if (antiguedadEnMeses < 6) {
      // Si la antigüedad es menor a 6 meses, usar aguinaldo proporcional
      aguinaldoIndividual = (sueldo / 12) * antiguedadEnMeses;
    } else {
      // Si no, usar la mitad del sueldo
      aguinaldoIndividual = sueldo / 2;
    }

    return aguinaldoIndividual;
  });

  // Sumar todos los aguinaldos individuales para obtener el total
  const aguinaldoTotal = aguinaldosIndividuales.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const bancoAguinaldoQuincenal = empleados.reduce(
    (accumulator, currentValue) => {
      // Verificar si el término de pago es quincenal
      if (currentValue?.termino_pago === "quincenal") {
        // Sumar el aguinaldo proporcional del sueldo quincenal
        accumulator += Number(
          currentValue?.sueldo[0]?.quincena_cinco[0]?.aguinaldo_proporcional ||
            0
        );
      }

      return accumulator;
    },
    0
  );

  const bancoAguinaldoMensual = empleados.reduce(
    (accumulator, currentValue) => {
      // Verificar si el término de pago es quincenal
      if (currentValue?.termino_pago === "quincenal") {
        // Sumar el aguinaldo proporcional del sueldo quincenal
        accumulator += Number(
          currentValue?.sueldo[0]?.aguinaldo_proporcional || 0
        );
      }

      return accumulator;
    },
    0
  );

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
                    Total a pagar aguinaldos
                  </p>
                  <p className="text-blue-500 text-lg font-bold">
                    {formatearDinero(aguinaldoTotal)}
                  </p>
                </div>
                <div className="border border-gray-200 bg-blue-50/50 py-4 px-4 flex flex-col gap-1 flex-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Total a pagar aguinaldo banco
                  </p>
                  <p className="text-blue-500 text-lg font-bold">
                    {formatearDinero(
                      Number(bancoAguinaldoQuincenal) +
                        Number(bancoAguinaldoMensual)
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
          </div>
        </div>
        <div className="bg-white py-2 px-6 flex gap-3">
          <button
            type="button"
            className="text-sm bg-green-500 rounded-full py-2 px-6 text-white font-semibold hover:bg-green-600 transition-all"
            onClick={() => {
              document.getElementById("my_modal_aguinaldo").showModal();
            }}
          >
            Imprimir aguinaldos
          </button>
        </div>
      </div>
      <div className="flex">
        <Search
          value={searchTerm}
          onChange={handleSearch}
          placeholder={"Buscar el empleado por el nombre y apellido.."}
        />
      </div>
      <div className="w-2/3">
        {selectedFabricaSucursal && (
          <div className="bg-white mx-3 my-5 py-3.5 px-3 flex flex-col gap-1">
            <p className="font-bold text-blue-500 text-lg">
              <span className="text-gray-700">Fabrica/Sucursal</span>{" "}
              <span className="capitalize">{selectedFabricaSucursal}</span>.
            </p>
            <div className="flex justify-between px-5">
              <p className="font-bold text-red-500">
                <p className="text-gray-600">Aguinaldo</p>
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
      <div className="bg-white my-2 mx-3">
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
                  <th>Meses trabajando</th>
                  <th>Banco</th>
                  <th>Aguinaldo</th>
                  <th>Acciones</th>
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

                  console.log("meses", months);

                  // Función para calcular los meses de antigüedad desde la fecha de ingreso
                  const calcularMesesAntiguedad = (fechaIngreso) => {
                    const fechaIngresoDate = new Date(fechaIngreso);
                    const fechaActual = new Date();

                    // Calcular diferencia en meses
                    const diff =
                      (fechaActual.getFullYear() -
                        fechaIngresoDate.getFullYear()) *
                        12 +
                      (fechaActual.getMonth() - fechaIngresoDate.getMonth());

                    return diff;
                  };

                  // Inicializar sueldo y aguinaldoProporcional
                  let sueldo = 0;
                  let aguinaldoProporcional = 0;

                  // Calcular la antigüedad en meses
                  const antiguedadEnMeses = calcularMesesAntiguedad(
                    g.fecha_ingreso
                  );

                  if (g?.termino_pago === "quincenal") {
                    // Calcular sueldo quincenal

                    sueldo =
                      Number(
                        g?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0
                      ) +
                      Number(g?.sueldo[0]?.quincena_cinco[0]?.otros || 0) +
                      Number(
                        g?.sueldo[0]?.quincena_cinco[0]?.premio_produccion || 0
                      ) +
                      Number(
                        g?.sueldo[0]?.quincena_cinco[0]?.premio_asistencia || 0
                      ) +
                      Number(
                        g?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0
                      ) +
                      Number(g?.sueldo[1]?.quincena_veinte[0]?.comida || 0) +
                      Number(total_antiguedad || 0);

                    // Verificar si la fecha de ingreso es menor a 6 meses
                    if (antiguedadEnMeses < 6) {
                      aguinaldoProporcional = (sueldo / 12) * antiguedadEnMeses;
                    }
                  } else if (g?.termino_pago === "mensual") {
                    // Calcular sueldo mensual
                    sueldo =
                      Number(g?.sueldo[0]?.sueldo_basico || 0) +
                      Number(total_antiguedad || 0) +
                      Number(g?.sueldo[0]?.comida || 0) +
                      Number(g?.sueldo[0]?.premio_produccion || 0) +
                      Number(g?.sueldo[0]?.premio_asistencia || 0) +
                      Number(g?.sueldo[0]?.otros || 0);

                    // Verificar si la fecha de ingreso es menor a 6 meses
                    if (antiguedadEnMeses < 6) {
                      aguinaldoProporcional = (sueldo / 12) * antiguedadEnMeses;
                    }
                  }

                  // Determinar el sueldo final basado en la antigüedad del empleado
                  if (antiguedadEnMeses < 6) {
                    // Si la fecha de ingreso es menor a 6 meses, se utiliza aguinaldo proporcional
                    sueldo = aguinaldoProporcional;
                  } else {
                    // Si no, se utiliza la mitad del sueldo
                    sueldo /= 2;
                  }

                  // Aquí puedes formatear el sueldo final si es necesario con la función formatearDinero
                  const sueldoFormateado = formatearDinero(sueldo);

                  let aguinaldoBanco;
                  if (g?.termino_pago === "quincenal") {
                    // Calcular sueldo quincenal
                    aguinaldoBanco =
                      Number(
                        g?.sueldo[0]?.quincena_cinco[0]
                          ?.aguinaldo_proporcional || 0
                      ) || 0;
                  } else if (g?.termino_pago === "mensual") {
                    // Calcular sueldo mensual
                    aguinaldoBanco =
                      Number(g?.sueldo[0]?.aguinaldo_proporcional || 0) || 0;
                  }

                  return (
                    <tr key={g?._id}>
                      <td className="font-semibold">
                        {g?.nombre} {g?.apellido}
                      </td>
                      <td className="font-semibold">{g?.fabrica_sucursal}</td>
                      <td className="font-semibold">
                        {antiguedadEnMeses} meses
                      </td>
                      <td className="font-semibold">
                        <span className="bg-red-50 text-red-800 py-1 px-2 rounded ">
                          {formatearDinero(aguinaldoBanco)}
                        </span>
                      </td>
                      <td className="font-semibold">
                        <span className="bg-blue-500 py-1 px-2 rounded text-white">
                          {sueldoFormateado}
                        </span>
                      </td>
                      <td>
                        <Dropdown>
                          <li>
                            <label
                              onClick={() => handleObtenerId(g._id)}
                              htmlFor="my-drawer-editar-aguinaldo"
                              className="hover:text-blue-500 font-bold"
                            >
                              Restar banco aguinaldo
                            </label>
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

      <EditarEmpleadoDrawerAguinaldo idObtenida={idObtenida} />
      <ModalEmpleadoObservacion idObtenida={idObtenida} />
      <ModalAumentoSueldo />
      <ModalSeleccionarQuincena />
      <ModalDocumentoRecursosHumanos empleados={filteredGastos} />
      <ModalSeleccionarAguinaldo />
    </div>
  );
};
