import React, { useEffect, useState } from "react";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { LinkBreadCrumbs } from "../components/ui/LinkBreadCrumbs";
import { BreadCrumbs } from "../components/ui/BreadCrumbs";
import { useParams } from "react-router-dom";
import { useEmpleado } from "../context/EmpleadosContext";
import { updateFecha } from "../helpers/FechaUpdate";

export const Empleado = () => {
  const params = useParams();
  const { getEmpleado } = useEmpleado();
  const [empleado, setEmpleado] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await getEmpleado(params.id);

      setEmpleado(res);
    }

    loadData();
  }, [params.id]);

  console.log(empleado);

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

  if (empleado.termino_pago === "quincenal") {
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

      <div className="flex my-10 mx-10">
        <div className="bg-white py-5 px-5">
          <p className="font-bold text-blue-500">
            Detalles del empleado obtenido / referencia{" "}
            {truncateText(params?.id, 6)}
          </p>
        </div>
      </div>

      <div className="mx-10 w-1/2">
        <div className="bg-white py-5 px-5 flex flex-col gap-4">
          <p className="font-bold text-gray-600">Empleado datos</p>

          <div className="flex gap-2 justify-between">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
