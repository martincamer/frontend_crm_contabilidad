import React, { useEffect, useState } from "react";
import { FaEye, FaMarkdown, FaPiggyBank } from "react-icons/fa";
import { useBancoCheque } from "../context/BancoChequesContext";
import { formatearDinero } from "../helpers/FormatearDinero";
import { Link, useParams } from "react-router-dom";

export const PageBancoCheque = () => {
  const { getBanco, deleteChequeBanco } = useBancoCheque();
  const params = useParams();

  const [banco, setBanco] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await getBanco(params.id);

      setBanco(res);
    };

    loadData();
  }, [params.id]);

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  // Obtener el primer día del mes actual
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  // Estado inicial de las fechas con el rango del mes actual
  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  const calcularTotalMovimientos = (cheques, fechaInicio, fechaFin) => {
    // Filtrar los cheques por banco y rango de fechas
    const chequesFiltrados = cheques?.filter((cheque) => {
      const fechaCheque = new Date(cheque.date);
      return (
        fechaCheque >= new Date(fechaInicio) &&
        fechaCheque <= new Date(fechaFin)
      );
    });

    // Calcular el total de los cheques filtrados
    const total = chequesFiltrados?.reduce((accumulator, currentCheque) => {
      return accumulator + currentCheque.total;
    }, 0);

    return total;
  };

  const filtrarCheques = () => {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    const chequesFiltrados = banco?.cheques
      ?.filter((cheque) => {
        const fechaCheque = new Date(cheque.date);
        return fechaCheque >= fechaInicioObj && fechaCheque <= fechaFinObj;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return chequesFiltrados;
  };

  return (
    <section className="py-10 px-5 flex flex-col gap-6">
      <div className="flex gap-5 items-center bg-white py-2 px-4">
        {" "}
        <div className="font-bold text-blue-500">
          Filtrar movimientos de cheques del banco{" "}
          <p className="text-gray-800 capitalize">{banco.nombre}</p>
        </div>
        <div className="flex gap-2 w-1/5">
          <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
            <input
              value={fechaInicio}
              onChange={handleFechaInicioChange}
              type="date"
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Fecha de inicio"
            />
          </div>
          <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
            <input
              value={fechaFin}
              onChange={handleFechaFinChange}
              type="date"
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Fecha fin"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 bg-white py-5 px-5">
        <div className="bg-white border-blue-500 border py-5 px-5">
          <p className="font-semibold">
            Banco:{" "}
            <span className="text-blue-500 capitalize font-bold">
              {banco.nombre}
            </span>
          </p>
          <p className="font-semibold">
            Total en movimientos:
            <span className="text-blue-500 capitalize font-bold">
              {formatearDinero(
                calcularTotalMovimientos(banco?.cheques, fechaInicio, fechaFin)
              )}
            </span>
          </p>
        </div>
      </div>

      <div className="flex mt-5">
        <p className="text-blue-500 font-bold border-b-2 border-blue-500">
          Tabla de cheques cargados del banco
        </p>
      </div>

      <div className="bg-white">
        <table className="table bg-white text-sm">
          <thead className="">
            <tr>
              <th>Banco</th>
              <th>Total</th>
              <th>Tipo</th>
              <th>Número de Cheque</th>
              <th>Datos</th>
              <th>Número de Ruta</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody className="capitalize text-xs">
            {filtrarCheques()?.map((banco) => (
              <tr key={banco._id}>
                <th>{banco.banco}</th>
                <th className="text-blue-500">
                  {formatearDinero(banco.total)}
                </th>
                <th>{banco.tipo}</th>
                <th>{banco.numero_cheque}</th>
                <th>{banco.datos}</th>
                <th>{banco.numero_ruta}</th>
                <th>{new Date(banco.date).toLocaleString()}</th>{" "}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
