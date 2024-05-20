import React, { useEffect } from "react";
import { useCaja } from "../context/CajasContext";
import { formatearDinero } from "../helpers/FormatearDinero";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { ModalCrearCaja } from "../components/caja/ModalCrearCaja";

export const PageCaja = () => {
  const { getCajas, cajas } = useCaja();

  useEffect(() => {
    getCajas();
  }, []);

  return (
    <section className="py-10 px-5 flex flex-col gap-6">
      <div className="flex">
        <div className="flex flex-col gap-1 bg-white py-6 px-8 max-full">
          <p className="text-gray-700 text-sm font-bold">Total de la caja</p>
          <p className="font-bold text-2xl text-blue-500">
            {formatearDinero(cajas[0]?.saldo)}
          </p>
        </div>
      </div>

      <div
        className="
      bg-white py-5 px-5 flex gap-2 items-center"
      >
        <div>
          <Link className="flex gap-3 text-sm font-bold bg-blue-500 text-white rounded-full py-2 px-5 hover:bg-orange-500 transition-all items-center">
            Ver movimientos de la caja del mes
            <FaArrowRight />
          </Link>
        </div>

        <div>
          <Link className="flex gap-3 text-sm font-bold bg-blue-500 text-white rounded-full py-2 px-5 hover:bg-orange-500 transition-all items-center">
            Ver ingresos o gastos del mes
            <FaArrowRight />
          </Link>
        </div>

        <div>
          <Link className="flex gap-3 text-sm font-bold bg-blue-500 text-white rounded-full py-2 px-5 hover:bg-orange-500 transition-all items-center">
            Filtrar ingresos o gastos.
            <FaArrowRight />
          </Link>
        </div>

        <div>
          <button
            type="button"
            className="text-sm font-bold bg-blue-500 text-white rounded-full py-2 px-5 hover:bg-orange-500 transition-all"
            onClick={() =>
              document.getElementById("my_modal_crear_caja").showModal()
            }
          >
            Crear nueva caja
          </button>
        </div>
      </div>

      <div className="bg-white py-10 px-10 grid grid-cols-2 gap-5"></div>

      {/* <ModalCrearCaja /> */}
    </section>
  );
};
