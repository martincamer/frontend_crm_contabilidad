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
  const [fecha_pago, setFechaPago] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await instance.get(`/empleados-datos-aguinaldo/${params.id}`);
      setDatos(res.data.empleados);
      setDatosCompleto(res.data);
      setFechaPago(res.data.fecha_pago);
    }

    loadData();
  }, [params.id]);

  //Search
  const [ventasPerPage] = useState(10); // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda
  const [selectedFabricaSucursal, setSelectedFabricaSucursal] = useState("");

  // Índices para la paginación

  // Ordenar gastos por fecha de creación
  const sortedVentas = datos
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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

  // Agrupar empleados por fabrica_sucursal
  const empleadosPorFabrica = filteredGastos.reduce((acc, empleado) => {
    const fabrica = empleado.fabrica_sucursal;
    if (!acc[fabrica]) {
      acc[fabrica] = [];
    }
    acc[fabrica].push(empleado);
    return acc;
  }, {});

  // Función para calcular los meses de antigüedad desde la fecha de ingreso hasta la fecha de pago
  const calcularMesesAntiguedad = (fechaIngreso, fechaPago) => {
    const fechaIngresoDate = new Date(fechaIngreso);
    const fechaPagoDate = new Date(fechaPago);

    // Calcular diferencia en meses
    const diff =
      (fechaPagoDate.getFullYear() - fechaIngresoDate.getFullYear()) * 12 +
      (fechaPagoDate.getMonth() - fechaIngresoDate.getMonth());

    return diff;
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
                  // Calcular los años de antigüedad (para el cálculo del total de antigüedad)
                  const { years, months } = calculateAntiquity(
                    g?.fecha_ingreso
                  );
                  // Función para calcular los meses de antigüedad desde la fecha de ingreso hasta la fecha de pago
                  const calcularMesesAntiguedad = (fechaIngreso, fechaPago) => {
                    const fechaIngresoDate = new Date(fechaIngreso);
                    const fechaPagoDate = new Date(fechaPago);

                    // Calcular diferencia en meses
                    const diff =
                      (fechaPagoDate.getFullYear() -
                        fechaIngresoDate.getFullYear()) *
                        12 +
                      (fechaPagoDate.getMonth() - fechaIngresoDate.getMonth());

                    return diff;
                  };

                  console.log("xd", g.fecha_ingreso, years);

                  // Inicializar sueldo y aguinaldoProporcional
                  let sueldo = 0;
                  let aguinaldoProporcional = 0;
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

                  console.log(g.termino_pago);
                  console.log("asdasd", years);

                  // Calcular la antigüedad en meses usando fecha_ingreso y fecha_pago
                  const antiguedadEnMeses = calcularMesesAntiguedad(
                    g.fecha_ingreso,
                    fecha_pago // Si no hay fecha de pago, usar la fecha actual
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

                    // Verificar si la antigüedad es menor a 6 meses
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

                    // Verificar si la antigüedad es menor a 6 meses
                    if (antiguedadEnMeses < 6) {
                      aguinaldoProporcional = (sueldo / 12) * antiguedadEnMeses;
                    }
                  }

                  // Determinar el sueldo final basado en la antigüedad del empleado
                  if (antiguedadEnMeses < 6) {
                    // Si la antigüedad es menor a 6 meses, se utiliza aguinaldo proporcional
                    sueldo = aguinaldoProporcional /= 4;
                  } else {
                    // Si no, se utiliza la mitad del sueldo
                    sueldo /= 4;
                  }

                  // Aquí puedes formatear el sueldo final si es necesario con la función formatearDinero
                  const sueldoFormateado = formatearDinero(sueldo);

                  console.log(total_antiguedad);

                  let aguinaldoBanco;
                  if (g?.termino_pago === "quincenal") {
                    // Calcular aguinaldo proporcional quincenal
                    aguinaldoBanco =
                      Number(
                        g?.sueldo[0]?.quincena_cinco[0]
                          ?.aguinaldo_proporcional || 0
                      ) || 0;
                  } else if (g?.termino_pago === "mensual") {
                    // Calcular aguinaldo proporcional mensual
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
                  const fechaIngreso = g.fecha_ingreso;
                  const fechaPago = g.fecha_pago || new Date().toISOString(); // Usa fecha actual si no hay fecha de pago

                  // Calcular los años de antigüedad (para el cálculo del total de antigüedad)
                  const { years } = calculateAntiquity(fechaIngreso);

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

                  // Inicializar sueldo y aguinaldoProporcional
                  let sueldo = 0;
                  let aguinaldoProporcional = 0;

                  // Calcular la antigüedad en meses usando fecha_ingreso y fecha_pago
                  const antiguedadEnMeses = calcularMesesAntiguedad(
                    fechaIngreso,
                    fechaPago
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

                    // Verificar si la antigüedad es menor a 6 meses
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

                    // Verificar si la antigüedad es menor a 6 meses
                    if (antiguedadEnMeses < 6) {
                      aguinaldoProporcional = (sueldo / 12) * antiguedadEnMeses;
                    }
                  }

                  // Determinar el sueldo final basado en la antigüedad del empleado
                  if (antiguedadEnMeses < 6) {
                    // Si la antigüedad es menor a 6 meses, se utiliza aguinaldo proporcional
                    sueldo = aguinaldoProporcional /= 4;
                  } else {
                    // Si no, se utiliza la mitad del sueldo
                    sueldo /= 4;
                  }

                  // Aquí puedes formatear el sueldo final si es necesario con la función formatearDinero
                  const sueldoFormateado = formatearDinero(sueldo);

                  let aguinaldoBanco;
                  if (g?.termino_pago === "quincenal") {
                    // Calcular aguinaldo proporcional quincenal
                    aguinaldoBanco =
                      Number(
                        g?.sueldo[0]?.quincena_cinco[0]
                          ?.aguinaldo_proporcional || 0
                      ) || 0;
                  } else if (g?.termino_pago === "mensual") {
                    // Calcular aguinaldo proporcional mensual
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
