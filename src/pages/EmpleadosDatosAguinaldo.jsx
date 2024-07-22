import { TableEmpleadosDatosAguinaldo } from "../components/empleadosDatos.jsx/TableEmpleadosDatosAguinaldo";
import { BreadCrumbs } from "../components/ui/BreadCrumbs";
import { LinkBreadCrumbs } from "../components/ui/LinkBreadCrumbs";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";

export const EmpleadosDatosAguinaldo = () => {
  return (
    <section className="max-md:min-h-screen max-md:max-h-full max-md:h-full">
      <Navegacion>
        <div className="flex">
          <NavegacionLink
            link={"/empleados-aguinaldo"}
            estilos={
              "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5"
            }
          >
            Empleados aguinaldo
          </NavegacionLink>
          <NavegacionLink
            link={`/datos-empleados-aguinaldo`}
            estilos={
              "bg-orange-500 text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
            }
          >
            Empleados datos aguinaldos
          </NavegacionLink>
        </div>
        <BreadCrumbs>
          <LinkBreadCrumbs link={"home"}>Inicio</LinkBreadCrumbs>
          <LinkBreadCrumbs link={"empleados"}>Empleados</LinkBreadCrumbs>
        </BreadCrumbs>
      </Navegacion>
      <TableEmpleadosDatosAguinaldo />
    </section>
  );
};
