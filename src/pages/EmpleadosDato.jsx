import React from "react";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { BreadCrumbs } from "../components/ui/BreadCrumbs";
import { LinkBreadCrumbs } from "../components/ui/LinkBreadCrumbs";
import { TableEmpleado } from "../components/empleadosDatos.jsx/TableEmpleado";

export const EmpleadosDato = () => {
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
            link={`/datos-empleado`}
            estilos={
              "bg-orange-500 text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
            }
          >
            Empleados datos mensuales
          </NavegacionLink>
        </div>
        <BreadCrumbs>
          <LinkBreadCrumbs link={"home"}>Inicio</LinkBreadCrumbs>
          <LinkBreadCrumbs link={"empleados"}>Empleados</LinkBreadCrumbs>
        </BreadCrumbs>
      </Navegacion>

      <TableEmpleado />
    </section>
  );
};
