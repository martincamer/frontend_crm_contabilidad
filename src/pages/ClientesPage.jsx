import { Link } from "react-router-dom";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { TableClientes } from "../components/clientes/TableClientes";
import { useCliente } from "../context/ClientesContext";
import { useEffect } from "react";

export const ClientesPage = () => {
  const { clientes, getClientes } = useCliente();
  useEffect(() => {
    getClientes();
  }, []);

  return (
    <section>
      <Navegacion>
        <div>
          <NavegacionLink
            link={"/gastos"}
            estilos={
              "bg-orange-500 text-white text-white font-semibold h-10 flex items-center px-5"
            }
          >
            Clientes
          </NavegacionLink>
        </div>
        <div className="px-5 flex gap-2">
          <Link
            to={"/crear-cliente"}
            className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow hover:bg-blue-500 transition-all"
          >
            Crear nuevo cliente
          </Link>
        </div>
      </Navegacion>
      <TableClientes Clientes={clientes} />
    </section>
  );
};
