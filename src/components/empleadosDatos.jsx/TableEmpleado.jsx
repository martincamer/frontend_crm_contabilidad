import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateFecha } from "../../helpers/FechaUpdate";
import { formatearDinero } from "../../helpers/FormatearDinero";
import instance from "../../api/axios";

export const TableEmpleado = () => {
  const params = useParams();

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await instance.get(`/empleados-datos/${params.id}`);
      setDatos(res.data);

      console.log("datos", datos);
    }

    loadData();
  }, [params.id]);

  // function agruparEmpleados(datos) {
  //   // Objeto para almacenar los datos agrupados
  //   let agrupados = {};

  //   // Recorrer los grupos de empleados
  //   datos?.empleados?.forEach((grupo) => {
  //     grupo?.forEach((empleado) => {
  //       // Obtener la fábrica y el tipo de pago del empleado
  //       const fabrica = empleado?.fabrica_sucursal;
  //       const tipoPago = empleado?.termino_pago;

  //       // Verificar si la fábrica ya está en el objeto agrupados
  //       if (!agrupados[fabrica]) {
  //         agrupados[fabrica] = {
  //           fabrica_sucursal: fabrica,
  //           empleados: [],
  //         };
  //       }

  //       // Agregar empleado al arreglo correspondiente
  //       agrupados[fabrica]?.empleados?.push({
  //         nombre: empleado?.nombre,
  //         apellido: empleado?.apellido,
  //         dni: empleado?.dni,
  //         fecha_ingreso: empleado?.fecha_ingreso,
  //         sector_trabajo: empleado?.sector_trabajo,
  //         termino_pago: tipoPago,
  //         fecha: empleado.date,
  //         sueldo:
  //           tipoPago === "mensual" ? empleado?.sueldo[0] : empleado?.sueldo,
  //       });
  //     });
  //   });

  //   // Convertir el objeto agrupados a un array
  //   return Object.values(agrupados);
  // }

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
  console.log("resultado", resultado);

  const [filtroFabrica, setFiltroFabrica] = useState("");
  const [filtroNombreApellido, setFiltroNombreApellido] = useState("");
  const [resultadosFiltrados, setResultadosFiltrados] = useState(resultado);

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

  return (
    <div>
      <div className="flex gap-5 mx-5 my-5">
        <input
          type="text"
          placeholder="Buscar por nombre y apellido..."
          className="px-5 w-1/5 py-2 rounded-xl font-semibold text-sm outline-none focus:border-blue-500 border"
          onChange={handleFiltroNombreApellidoChange}
          value={filtroNombreApellido}
        />
        <input
          type="text"
          placeholder="Buscar por nombre de fábrica..."
          className="px-5 w-1/5 py-2 rounded-xl font-semibold text-sm outline-none focus:border-blue-500 border"
          onChange={handleFiltroFabricaChange}
          value={filtroFabrica}
        />
        <select
          value={filtroFabrica}
          onChange={handleFiltroFabricaChange}
          className="px-5 w-1/5 py-2 rounded-xl capitalize font-semibold text-sm
          outline-none focus:border-blue-500 border"
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
          <div className="bg-white my-5 mx-5 py-5 px-5">
            <p className="uppercase text-gray-500 font-semibold mb-2">
              Fabrica{" "}
              <span className="font-bold text-blue-500">
                {r.fabrica_sucursal}
              </span>
            </p>
            <div className="flex flex-col gap-1 overflow-x-auto scroll-bar">
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
                  <div className="flex flex-col gap-1 text-xs" key={index}>
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
    </div>
  );
};
