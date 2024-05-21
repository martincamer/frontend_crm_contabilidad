import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { Skeleton } from "../components/ui/Skeleton";
import { TableIngresos } from "../components/ingresos/TableIngresos";
import { useIngreso } from "../context/IngresosContext";
import { ModalCrearIngreso } from "../components/ingresos/ModalCrearIngreso";

export const Ingresos = () => {
  const { ingresos, getIngresos } = useIngreso();

  useEffect(() => {
    getIngresos();
  }, []);

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
            link={"/ingresos"}
            estilos={
              "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5"
            }
          >
            Ingresos
          </NavegacionLink>
        </div>
        <div className="px-5 flex gap-2">
          <Link
            onClick={() => {
              document.getElementById("my_modal_crear_ingreso").showModal();
            }}
            // to={"/crear-ingreso"}
            className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow hover:bg-blue-500 transition-all"
          >
            Crear nuevo ingreso
          </Link>
        </div>
      </Navegacion>

      <TableIngresos ingresos={ingresos} />
      <ModalCrearIngreso />
    </section>
  );
};
