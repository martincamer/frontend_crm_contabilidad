import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { TableGastos } from "../components/gastos/TableGastos";
import { Search } from "../components/ui/Search";
import { SearchButton } from "../components/ui/SearchButton";
import { useSearch } from "../helpers/openSearch";
import { Skeleton } from "../components/ui/Skeleton";

export const Gastos = () => {
  const { click, openSearch } = useSearch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 5000ms = 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <section>
      <Navegacion>
        <div>
          <NavegacionLink
            link={"/gastos"}
            estilos={
              "bg-orange-400 text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
            }
          >
            Gastos
          </NavegacionLink>
        </div>
        <div className="px-5 flex gap-2">
          <Link
            to={"/crear-gasto"}
            className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow hover:bg-blue-500 transition-all"
          >
            Crear nuevo gastó
          </Link>
          <Link
            to={"/crear-gasto"}
            className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow transition-all hover:bg-blue-500"
          >
            Crear categorias gastós
          </Link>
        </div>
      </Navegacion>

      <SearchButton open={() => openSearch()} />
      {click && (
        <Search placeholder={"Buscar gastó por proveedor o categoria"} />
      )}

      <TableGastos />
    </section>
  );
};
