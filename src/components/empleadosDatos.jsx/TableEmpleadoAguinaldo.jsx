import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateFecha } from "../../helpers/FechaUpdate";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { useEmpleado } from "../../context/EmpleadosContext";
import instance from "../../api/axios";
import { useObtenerId } from "../../helpers/obtenerId";
import { CgLaptop } from "react-icons/cg";

export const TableEmpleadoAguinaldo = () => {
  const params = useParams();
  const { getFabricas, fabricas } = useEmpleado();

  useEffect(() => {
    getFabricas();
  }, []);

  const [datos, setDatos] = useState([]);
  const [datosCompleto, setDatosCompleto] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await instance.get(`/empleados-datos-aguinaldo/${params.id}`);
      setDatos(res.data.empleados);
      setDatosCompleto(res.data);
    }

    loadData();
  }, [params.id]);

  //Search
  const [currentPage, setCurrentPage] = useState(1);
  const [ventasPerPage] = useState(10); // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda
  const [selectedFabricaSucursal, setSelectedFabricaSucursal] = useState("");

  // Índices para la paginación
  const indexOfLastVenta = currentPage * ventasPerPage;
  const indexOfFirstVenta = indexOfLastVenta - ventasPerPage;

  // Ordenar gastos por fecha de creación
  const sortedVentas = datos
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Manejar búsqueda
  const handleSearch = (event) => {
    setCurrentPage(1); // Restablecer la página al buscar
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  const filteredGastos = datos.filter(
    (venta) =>
      // venta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // venta.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${venta.nombre} ${venta.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedFabricaSucursal === "" ||
        venta.fabrica_sucursal === selectedFabricaSucursal)
  );

  const totalPages = Math.ceil(sortedVentas.length / ventasPerPage); // Calcular el total de páginas

  //obtener el id
  const { handleObtenerId, idObtenida } = useObtenerId();

  const calculateAntiquity = (startDate, startNew) => {
    const start = new Date(startDate);
    const now = new Date(startNew);
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

  // Función para calcular los meses de antigüedad desde la fecha de ingreso
  const calcularMesesAntiguedad = (fechaIngreso, fechaPago) => {
    const fechaIngresoDate = new Date(fechaIngreso);
    const fechaActual = new Date(fechaPago);

    // Calcular diferencia en meses
    const diff =
      (fechaActual.getFullYear() - fechaIngresoDate.getFullYear()) * 12 +
      (fechaActual.getMonth() - fechaIngresoDate.getMonth());

    return diff;
  };

  const aguinaldosIndividuales = filteredGastos.map((e) => {
    let total_antiguedad = 0;
    let sueldo = 0;

    // Calcular la antigüedad
    const { years } = calculateAntiquity(e?.fecha_ingreso, e.fecha_pago);

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
    const antiguedadEnMeses = calcularMesesAntiguedad(
      e.fecha_ingreso,
      e.fecha_pago
    );
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

  const calcularAguinaldoTotal = (empleados) => {
    const aguinaldoTotal = empleados.reduce((total, empleado) => {
      // Inicializar el aguinaldo individual del empleado en 0
      let aguinaldoIndividual = 0;

      // Verificar el tipo de pago del empleado
      if (empleado.termino_pago === "quincenal") {
        // Calcular sueldo quincenal incluyendo aguinaldo proporcional
        const sueldoQuincenal =
          Number(empleado.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0) +
            Number(empleado.sueldo[0]?.quincena_cinco[0]?.otros || 0) +
            Number(
              empleado.sueldo[0]?.quincena_cinco[0]?.premio_produccion || 0
            ) +
            Number(
              empleado.sueldo[0]?.quincena_cinco[0]?.premio_asistencia || 0
            ) +
            Number(
              empleado.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0
            ) +
            Number(empleado.sueldo[1]?.quincena_veinte[0]?.comida || 0) +
            Number(
              empleado.sueldo[0]?.quincena_cinco[0]?.aguinaldo_proporcional || 0
            ) -
            Number(
              empleado.sueldo[1]?.quincena_veinte[0]?.descuento_del_veinte || 0
            ) -
            Number(
              empleado.sueldo[0]?.quincena_cinco[0]?.descuento_del_cinco || 0
            ) || 0;

        // Calcular aguinaldo individual (sueldo quincenal / 2)
        aguinaldoIndividual = sueldoQuincenal / 2;
      } else if (empleado.termino_pago === "mensual") {
        // Calcular sueldo mensual incluyendo aguinaldo proporcional
        const sueldoMensual =
          Number(empleado.sueldo[0]?.sueldo_basico || 0) +
            Number(empleado.sueldo[0]?.comida || 0) +
            Number(empleado.sueldo[0]?.premio_produccion || 0) +
            Number(empleado.sueldo[0]?.premio_asistencia || 0) +
            Number(empleado.sueldo[0]?.otros || 0) +
            Number(empleado.sueldo[0]?.aguinaldo_proporcional || 0) -
            Number(empleado.sueldo[0]?.descuento_del_cinco || 0) || 0;

        // Calcular aguinaldo individual (sueldo mensual / 2)
        aguinaldoIndividual = sueldoMensual / 2;
      }

      // Sumar el aguinaldo individual al total
      total += aguinaldoIndividual;

      return total;
    }, 0); // Iniciar el total en 0

    return aguinaldoTotal;
  };

  // Calcular el aguinaldo total
  const totalAguinaldo = calcularAguinaldoTotal(filteredGastos);

  return (
    <div className="max-md:py-12 mt-5">
      <div className="bg-white my-2 mx-3 max-md:overflow-x-auto">
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
                </tr>
              </thead>
              <tbody className="text-xs capitalize">
                {empleadosPorFabrica[fabrica].map((g) => {
                  // Calcular la antigüedad
                  const { years, months } = calculateAntiquity(
                    g?.fecha_ingreso,
                    g.fecha_pago
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

                  const calcularMesesAntiguedad = (
                    fechaGuardada,
                    fechaIngreso
                  ) => {
                    // Convertir la fecha guardada a un objeto Date (fecha actual)
                    const fechaActual = new Date(fechaGuardada);

                    // Convertir la fecha de ingreso a un objeto Date
                    const fechaIngresoDate = fechaIngreso
                      ? new Date(fechaIngreso)
                      : new Date();

                    // Calcular diferencia en meses
                    const diff =
                      (fechaActual.getFullYear() -
                        fechaIngresoDate.getFullYear()) *
                        12 +
                      (fechaActual.getMonth() - fechaIngresoDate.getMonth());

                    return diff;
                  };

                  // Calcular la antigüedad en meses
                  const antiguedadEnMeses = calcularMesesAntiguedad(
                    datosCompleto.fecha_pago,
                    g.fecha_ingreso
                  );

                  console.log("asdasdasdasd", antiguedadEnMeses);
                  console.log(
                    "fecha_pago",
                    datosCompleto.fecha_pago,
                    "fecha_ingreso",
                    g.fecha_ingreso
                  );

                  // Inicializar sueldo y aguinaldoProporcional
                  let sueldo = 0;
                  let aguinaldoProporcional = 0;

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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="bg-white my-2 mx-3 max-md:overflow-x-auto">
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
