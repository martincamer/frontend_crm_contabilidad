import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateFecha } from "../../helpers/FechaUpdate";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { useEmpleado } from "../../context/EmpleadosContext";
import instance from "../../api/axios";

export const TableEmpleado = () => {
  const params = useParams();
  const { getFabricas, fabricas } = useEmpleado();

  useEffect(() => {
    getFabricas();
  }, []);

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await instance.get(`/empleados-datos/${params.id}`);
      setDatos(res.data);
    }

    loadData();
  }, [params.id]);

  function agruparEmpleados(datos) {
    // Objeto para almacenar los datos agrupados
    let agrupados = {};

    // Verificar si datos?.empleados es un array y si tiene elementos
    if (Array.isArray(datos?.empleados) && datos.empleados.length > 0) {
      datos.empleados.forEach((empleado) => {
        // Obtener la fábrica y el tipo de pago del empleado
        const fabrica = empleado?.fabrica_sucursal;
        const tipoPago = empleado?.termino_pago;

        // Verificar si la fábrica ya está en el objeto agrupados
        if (!agrupados[fabrica]) {
          agrupados[fabrica] = {
            fabrica_sucursal: fabrica,
            empleados: [],
          };
        }

        // Agregar empleado al arreglo correspondiente
        agrupados[fabrica].empleados.push({
          nombre: empleado?.nombre,
          apellido: empleado?.apellido,
          dni: empleado?.dni,
          fecha_ingreso: empleado?.fecha_ingreso,
          sector_trabajo: empleado?.sector_trabajo,
          termino_pago: tipoPago,
          fecha: empleado.date,
          sueldo:
            tipoPago === "mensual" ? empleado?.sueldo[0] : empleado?.sueldo,
        });
      });
    }

    // Convertir el objeto agrupados a un array y retornarlo
    return Object.values(agrupados);
  }

  // Llamar a la función y obtener el resultado
  const resultado = agruparEmpleados(datos);

  const [filtroFabrica, setFiltroFabrica] = useState("");
  const [filtroNombreApellido, setFiltroNombreApellido] = useState("");
  const [resultadosFiltrados, setResultadosFiltrados] = useState(resultado);
  const [selectedTipoPago, setSelectedTipoPago] = useState(""); // Estado para el tipo de pago seleccionado

  const handleTipoPagoChange = (e) => {
    setSelectedTipoPago(e.target.value); // Actualizar el tipo de pago seleccionado
  };

  // Función para manejar cambios en el filtro select de fábrica
  const handleFiltroFabricaChange = (e) => {
    const selectedFabrica = e.target.value;
    setFiltroFabrica(selectedFabrica);
  };

  // Función para manejar cambios en el campo de búsqueda
  const handleFiltroNombreApellidoChange = (e) => {
    const valor = e.target.value;
    setFiltroNombreApellido(valor);
  };

  // Función para filtrar los resultados por fábrica
  const filtrarResultados = () => {
    let resultados = resultado.slice(); // Copia superficial

    // Filtrar por fábrica seleccionada
    if (filtroFabrica !== "") {
      resultados = resultados.filter((r) =>
        r.fabrica_sucursal.toLowerCase().includes(filtroFabrica.toLowerCase())
      );
    }

    // Filtrar por nombre y apellido
    if (filtroNombreApellido !== "") {
      resultados = resultados
        .map((r) => ({
          ...r,
          empleados: r.empleados.filter((empleado) =>
            `${empleado.nombre} ${empleado.apellido}`
              .toLowerCase()
              .includes(filtroNombreApellido.toLowerCase())
          ),
        }))
        .filter((r) => r.empleados.length > 0); // Asegúrate de eliminar las fábricas
    }

    // Actualizar el estado con los resultados filtrados
    setResultadosFiltrados(resultados);
  };

  // Usar useEffect para aplicar filtros
  useEffect(() => {
    filtrarResultados();
  }, [filtroFabrica, filtroNombreApellido, datos]);

  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda
  const [selectedFabricaSucursal, setSelectedFabricaSucursal] = useState("");
  // Manejar búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  const filteredGastos = datos?.empleados?.filter(
    (empleado) =>
      `${empleado.nombre} ${empleado.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedFabricaSucursal === "" ||
        empleado.fabrica_sucursal === selectedFabricaSucursal) &&
      (selectedTipoPago === "" || empleado.termino_pago === selectedTipoPago)
  );

  // Agrupar empleados por fabrica_sucursal
  const empleadosPorFabrica = filteredGastos?.reduce((acc, empleado) => {
    const fabrica = empleado.fabrica_sucursal;
    if (!acc[fabrica]) {
      acc[fabrica] = [];
    }
    acc[fabrica].push(empleado);
    return acc;
  }, {});

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
      <div className="flex flex-col md:flex-row md:items-center md:px-5 md:py-6 py-4 gap-2 bg-white mx-3 px-2 mb-10">
        {" "}
        <div className="flex flex-col gap-1 py-2 px-3 md:px-0">
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
        <div className="flex flex-col gap-1 max-md:px-3">
          <label htmlFor="" className="uppercase font-bold text-xs">
            Filtrar por termino de pago
          </label>
          <select
            value={selectedTipoPago}
            onChange={handleTipoPagoChange}
            className="uppercase text-xs font-semibold outline-none border py-3 px-2 focus:border-blue-500"
          >
            <option className="font-bold text-blue-500" value="">
              Todos los tipos de pago
            </option>
            <option className="font-semibold" value="quincenal">
              Quincenal
            </option>
            <option className="font-semibold" value="mensual">
              Mensual
            </option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre de fábrica..."
          className="px-5 w-1/5 py-2 rounded-xl md:rounded-none md:border-blue-500 font-semibold text-sm outline-none focus:border-blue-700 max-md:w-auto border max-md:mx-2"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="md:hidden max-md:hidden flex gap-5 mx-5 my-5 max-md:flex-col max-md:w-auto max-md:gap-2 max-md:bg-white max-md:px-2 max-md:py-4">
        <input
          type="text"
          placeholder="Buscar por nombre y apellido..."
          className="px-5 w-1/5 py-2 rounded-xl font-semibold text-sm outline-none focus:border-blue-500 max-md:w-auto border"
          onChange={handleFiltroNombreApellidoChange}
          value={filtroNombreApellido}
        />
        <input
          type="text"
          placeholder="Buscar por nombre de fábrica..."
          className="px-5 w-1/5 py-2 rounded-xl font-semibold text-sm outline-none focus:border-blue-500 max-md:w-auto border"
          onChange={handleFiltroFabricaChange}
          value={filtroFabrica}
        />
        <select
          value={filtroFabrica}
          onChange={handleFiltroFabricaChange}
          className="px-5 w-1/5 py-2 rounded-xl capitalize font-semibold text-sm
          outline-none focus:border-blue-500 max-md:w-auto border"
        >
          <option className="font-bold capitalize" value="">
            Seleccionar fábrica
          </option>
          {resultado.map((r) => (
            <option
              className="font-semibold capitalize"
              key={r.fabrica_sucursal}
              value={r.fabrica_sucursal}
            >
              {r.fabrica_sucursal}
            </option>
          ))}
        </select>
      </div>
      {resultadosFiltrados.map((r) => {
        return (
          <div className="bg-white my-5 mx-5 py-5 px-5 md:hidden  max-md:hidden">
            <p className="uppercase text-gray-500 font-semibold mb-2">
              Fabrica{" "}
              <span className="font-bold text-blue-500">
                {r.fabrica_sucursal}
              </span>
            </p>
            <div className="flex flex-col gap-1 overflow-x-auto scroll-bar max-md:hidden">
              {r.empleados.map((empleado, index) => {
                const calculateAntiquity = (startDate, endDate) => {
                  try {
                    const start = new Date(startDate);
                    const end = new Date(endDate || Date.now()); // Si endDate no está definido, usar la fecha actual

                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );

                    const years = Math.floor(diffDays / 365);
                    const months = Math.floor((diffDays % 365) / 30);

                    return { years, months };
                  } catch (error) {
                    console.error("Error al calcular la antigüedad:", error);
                    return { years: 0, months: 0 };
                  }
                };

                const antiquity = calculateAntiquity(
                  empleado.fecha_ingreso,
                  empleado.fecha
                );

                let total_antiguedad = 0;

                if (empleado.termino_pago === "mensual") {
                  total_antiguedad =
                    Number(empleado?.sueldo?.sueldo_basico) *
                    (0.01 * antiquity.years);
                } else {
                  total_antiguedad =
                    (Number(
                      empleado.sueldo[0]?.quincena_cinco[0]?.quincena_cinco
                    ) +
                      Number(
                        empleado.sueldo[1]?.quincena_veinte[0]?.quincena_veinte
                      )) *
                    (0.01 * antiquity.years);
                }

                return (
                  <div
                    className="flex flex-col max-md:w-[1220px] gap-1 text-xs"
                    key={index}
                  >
                    {empleado.termino_pago === "mensual"
                      ? index === 0 && (
                          <div
                            key={index}
                            className="flex gap-5 border py-2 px-2"
                          >
                            <p className="font-bold text-blue-500 w-[15%]">
                              Empleado
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Sector/puesto
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Fecha de ingreso
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Tipo de sueldo
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Sueldo basico
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Total antiguedad
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Banco
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Premio asistencia
                            </p>
                            {empleado.sueldo.premio_produccion === "" ? (
                              ""
                            ) : (
                              <p className="font-bold text-blue-500 w-[15%] ">
                                Premio producción
                              </p>
                            )}
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Comida
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Descuento por faltas
                            </p>
                            <p className="font-bold text-blue-500 w-[15%]">
                              Total sueldo
                            </p>
                          </div>
                        )
                      : index === 0 && (
                          <div
                            key={index}
                            className="flex gap-5 border py-2 px-2"
                          >
                            <p className="font-bold text-blue-500 w-[15%]">
                              Empleado
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Sector/puesto
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Fecha de ingreso
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Tipo de sueldo
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Quincena del 5
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Quincena del 20
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Total antiguedad
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Banco
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Premio asistencia
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Premio producción
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Comida producción
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Otros
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Descuento por faltas
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Saldo 5
                            </p>
                            <p className="font-bold text-blue-500 w-[15%] ">
                              Saldo 20
                            </p>
                            <p className="font-bold text-blue-500 w-[30%] ">
                              Sueldo neto
                            </p>
                          </div>
                        )}
                    {empleado.termino_pago === "mensual" ? (
                      <div className="flex gap-5  py-1 px-2">
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {empleado.nombre} {empleado.apellido}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {empleado.sector_trabajo}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {updateFecha(empleado.fecha_ingreso)}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {empleado?.termino_pago}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(empleado?.sueldo?.sueldo_basico)
                          )}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(Number(total_antiguedad))}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(Number(empleado?.sueldo?.banco))}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(empleado?.sueldo?.premio_asistencia)
                          )}
                        </p>
                        {empleado.sueldo.premio_produccion === "" ? (
                          ""
                        ) : (
                          <p className="capitalize font-bold text-gray-700 w-[15%]">
                            {formatearDinero(
                              Number(empleado?.sueldo?.premio_produccion)
                            )}
                          </p>
                        )}
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(Number(empleado?.sueldo?.comida))}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(empleado?.sueldo?.descuento_del_cinco)
                          )}
                        </p>
                        <p className="capitalize font-bold text-white bg-orange-500 py-1 px-1 rounded-xl w-[15%] text-center">
                          {formatearDinero(
                            Number(empleado?.sueldo?.sueldo_basico) +
                              Number(total_antiguedad) +
                              Number(empleado?.sueldo?.premio_asistencia) +
                              Number(empleado?.sueldo?.premio_produccion) +
                              Number(empleado?.sueldo?.comida) -
                              Number(empleado?.sueldo?.banco) -
                              Number(empleado?.sueldo?.descuento_del_cinco)
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-5 border py-1 px-2">
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {empleado.nombre} {empleado.apellido}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {empleado.sector_trabajo}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {updateFecha(empleado.fecha_ingreso)}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {empleado.termino_pago}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[0]?.quincena_cinco[0]
                                ?.quincena_cinco
                            )
                          )}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[1]?.quincena_veinte[0]
                                ?.quincena_veinte
                            )
                          )}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(Number(total_antiguedad))}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[0]?.quincena_cinco[0]?.banco
                            )
                          )}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[0]?.quincena_cinco[0]
                                ?.premio_asistencia
                            )
                          )}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[0]?.quincena_cinco[0]
                                ?.premio_produccion
                            )
                          )}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[1]?.quincena_veinte[0]?.comida
                            )
                          )}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[0]?.quincena_cinco[0]?.otros
                            )
                          )}
                        </p>
                        <p className="capitalize font-bold text-gray-700 w-[15%]">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[0]?.quincena_cinco[0]
                                ?.descuento_del_cinco
                            )
                          )}
                        </p>
                        <p className="capitalize font-bold text-white bg-orange-500 py-1 px-1 rounded-xl w-[15%] text-center">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[0]?.quincena_cinco[0]
                                ?.quincena_cinco
                            ) +
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]
                                  ?.premio_asistencia
                              ) +
                              Number(total_antiguedad) +
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]
                                  ?.premio_produccion
                              ) +
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]?.otros
                              ) -
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]?.banco
                              ) -
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]
                                  ?.descuento_del_cinco
                              )
                          )}
                        </p>
                        <p className="capitalize font-bold text-white bg-orange-500 py-1 px-1 rounded-xl w-[15%] text-center">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[1]?.quincena_veinte[0]
                                ?.quincena_veinte
                            ) +
                              Number(
                                empleado?.sueldo[1]?.quincena_veinte[0]?.comida
                              ) -
                              Number(
                                empleado?.sueldo[1]?.quincena_veinte[0]
                                  ?.descuento_del_veinte
                              )
                          )}
                        </p>
                        <p className="capitalize font-bold text-white bg-blue-500 py-1 px-1 rounded-xl w-[15%] text-center">
                          {formatearDinero(
                            Number(
                              empleado?.sueldo[1]?.quincena_veinte[0]
                                ?.quincena_veinte
                            ) +
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]
                                  ?.quincena_cinco
                              ) +
                              Number(
                                empleado?.sueldo[1]?.quincena_veinte[0]?.comida
                              ) +
                              Number(total_antiguedad) +
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]
                                  ?.premio_asistencia
                              ) +
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]
                                  ?.premio_produccion
                              ) +
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]?.otros
                              ) -
                              Number(
                                empleado?.sueldo[0]?.quincena_cinco[0]
                                  ?.descuento_del_cinco
                              ) -
                              Number(
                                empleado?.sueldo[1]?.quincena_veinte[0]
                                  ?.descuento_del_veinte
                              )
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="bg-white my-2 mx-3 overflow-x-auto">
        {empleadosPorFabrica &&
          Object.keys(empleadosPorFabrica).map((fabrica, index) => (
            <div className="" key={index}>
              <h2 className="px-5 py-4 uppercase text-sm font-bold text-blue-500">
                <span className="text-gray-600">Fabrica/sucursal</span>{" "}
                {fabrica}
              </h2>
              <table className="table">
                <thead>
                  <tr className="text-gray-800">
                    <th>Empleado</th>
                    <th>Fabrica</th>
                    <th>Sector/rol</th>
                    <th>Fecha ingreso</th>
                    {empleadosPorFabrica[fabrica].some(
                      (g) => g?.termino_pago === "mensual"
                    ) && (
                      <th>
                        <th>SueldoBasico</th>
                      </th>
                    )}
                    {empleadosPorFabrica[fabrica].some(
                      (g) => g?.termino_pago === "quincenal"
                    ) && <th>Quin 5 real</th>}{" "}
                    {empleadosPorFabrica[fabrica].some(
                      (g) => g?.termino_pago === "quincenal"
                    ) && <th>Quin 20 real</th>}
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
                    ) && <th>Sueldo con desc.</th>}
                    {/* <th>Quin 20/pagar</th> */}
                    {empleadosPorFabrica[fabrica].some(
                      (g) => g?.termino_pago === "quincenal"
                    ) && <th>Quin 20/pagar</th>}
                    <th>Sueldo cobrado/neto</th>
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
                        Number(g?.sueldo[0]?.sueldo_basico || 0) *
                        (0.01 * years);
                    } else {
                      total_antiguedad =
                        (Number(
                          g?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0
                        ) +
                          Number(
                            g?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte ||
                              0
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
                            g?.sueldo[0]?.quincena_cinco[0]
                              ?.premio_produccion || 0
                          ) +
                          Number(
                            g?.sueldo[0]?.quincena_cinco[0]
                              ?.premio_asistencia || 0
                          ) +
                          Number(
                            g?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte ||
                              0
                          ) +
                          Number(
                            g?.sueldo[1]?.quincena_veinte[0]?.comida || 0
                          ) +
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
                        <td className="font-semibold">
                          {updateFecha(g?.fecha_ingreso)}
                        </td>
                        {g.termino_pago === "quincenal" && (
                          <td className="font-semibold">
                            <p className="bg-green-500 text-white p-1 rounded text-center">
                              {formatearDinero(
                                g?.termino_pago === "quincenal"
                                  ? Number(
                                      g?.sueldo[0]?.quincena_cinco[0]
                                        ?.quincena_cinco || 0
                                    )
                                  : ""
                              )}
                            </p>
                          </td>
                        )}
                        {g.termino_pago === "quincenal" && (
                          <td className="font-semibold">
                            <p className="bg-green-500 text-white p-1 rounded text-center">
                              {formatearDinero(
                                g?.termino_pago === "quincenal"
                                  ? Number(
                                      g?.sueldo[1]?.quincena_veinte[0]
                                        ?.quincena_veinte || 0
                                    )
                                  : ""
                              )}
                            </p>
                          </td>
                        )}
                        {g.termino_pago === "mensual" && (
                          <td className="font-semibold">
                            <p className="bg-green-500 text-white p-1 rounded text-center">
                              {formatearDinero(
                                g?.termino_pago === "mensual"
                                  ? Number(g?.sueldo[0]?.sueldo_basico || 0)
                                  : ""
                              )}
                            </p>
                          </td>
                        )}
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
                                      g?.sueldo[1]?.quincena_veinte[0]
                                        ?.comida || 0
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
