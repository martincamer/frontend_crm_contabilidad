import React, { useEffect, useState } from "react";
import { FaEye, FaMarkdown, FaPiggyBank } from "react-icons/fa";
import { useBancoCheque } from "../context/BancoChequesContext";
import { ModalCrearBancoCheque } from "../components/banco/ModalCrearBancoCheque";
import { formatearDinero } from "../helpers/FormatearDinero";
import { ModalCrearCheque } from "../components/banco/ModalCrearCheque";
import { Link } from "react-router-dom";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ChequesPdf } from "../components/comprobantes/ChequesPdf";
import { updateFecha } from "../helpers/FechaUpdate";
import instance from "../api/axios";
import { showSuccessToast } from "../helpers/toast";
import { useProveedor } from "../context/ProveedoresContext";

export const PageBancoCheques = () => {
  const { getBancos, bancos, setBancos, deleteChequeBanco } = useBancoCheque();

  const { getProveedores, proveedores } = useProveedor();

  useEffect(() => {
    getProveedores();
  }, []);

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  useEffect(() => {
    getBancos();
  }, []);

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

  // Filtro por rango de fechas (si están definidas)
  const fechaInicioObj = new Date(fechaInicio);
  const fechaFinObj = new Date(fechaFin);

  const filterAndSortCheques = (proveedorSeleccionado) => {
    // Filtrar por fechas y obtener solo los cheques
    const filteredCheques = [];

    bancos.forEach((banco) => {
      banco.cheques.forEach((cheque) => {
        const fechaCheque = new Date(cheque.date);
        // Filtrar por fechas
        if (
          (!fechaInicioObj || fechaCheque >= fechaInicioObj) &&
          (!fechaFinObj || fechaCheque <= fechaFinObj)
        ) {
          // Filtrar por proveedor (si está seleccionado)
          if (
            !proveedorSeleccionado ||
            cheque.datos === proveedorSeleccionado
          ) {
            filteredCheques.push(cheque);
          }
        }
      });
    });

    // Ordenar los cheques por fecha de mayor a menor
    filteredCheques.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return filteredCheques;
  };

  const filterDataCheques = filterAndSortCheques();

  const handleChangeProveedor = (event) => {
    setProveedorSeleccionado(event.target.value);
  };

  const chequesFiltrados = filterAndSortCheques(proveedorSeleccionado);

  // Estados para las fechas filtradas
  const [fechaInicioMovimientos, setFechaInicioMovimientos] = useState(
    fechaInicioPorDefecto
  );
  const [fechaFinMovimientos, setFechaFinMovimientos] =
    useState(fechaFinPorDefecto);

  // Función para filtrar y sumar los cheques por banco y fecha
  const calcularTotalMovimientos = (banco, fechaInicio, fechaFin) => {
    // Filtrar los cheques por banco y rango de fechas
    const chequesFiltrados = banco.cheques.filter((cheque) => {
      const fechaCheque = new Date(cheque.date);
      return (
        fechaCheque >= new Date(fechaInicio) &&
        fechaCheque <= new Date(fechaFin)
      );
    });

    // Calcular el total de los cheques filtrados
    const total = chequesFiltrados.reduce((accumulator, currentCheque) => {
      return accumulator + currentCheque.total;
    }, 0);

    return total;
  };

  // Manejadores de cambio para las fechas
  const handleFechaInicioChangeMovimientos = (e) => {
    setFechaInicioMovimientos(e.target.value);
  };

  const handleFechaFinChangeMovimientos = (e) => {
    setFechaFinMovimientos(e.target.value);
  };

  const actualizarEstadoCheque = async (id, estadoActual) => {
    try {
      // Determinar el nuevo estado a enviar al servidor
      const nuevoEstado =
        estadoActual === "pendiente el cobro"
          ? "cobrado"
          : "pendiente el cobro";

      // Realizar la solicitud PUT al servidor para actualizar el estado del cheque
      const response = await instance.put(`/actualizar-cheque/${id}`, {
        estado: nuevoEstado,
      });

      // Actualizar el estado local de bancos con los datos devueltos por el servidor
      setBancos(response.data);

      showSuccessToast("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el estado del cheque:", error);
    }
  };

  const totalCheques = chequesFiltrados.reduce(
    (total, banco) => total + banco.total,
    0
  );

  return (
    <section className="py-10 px-5 flex flex-col gap-6">
      <div className="flex gap-5 items-center max-md:flex-col max-md:items-center max-md:bg-white max-md:py-4 max-md:px-4">
        {" "}
        <div className="font-bold text-blue-500">
          Filtrar movimientos de cheques del banco
        </div>
        <div className="flex gap-2 w-auto">
          <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
            <input
              value={fechaInicioMovimientos}
              onChange={handleFechaInicioChangeMovimientos}
              type="date"
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Fecha de inicio"
            />
          </div>
          <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
            <input
              value={fechaFinMovimientos}
              onChange={handleFechaFinChangeMovimientos}
              type="date"
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Fecha fin"
            />
          </div>
        </div>
        <div>
          <PDFDownloadLink
            fileName="Resumen de los cheques/banco"
            className="font-semibold text-sm bg-blue-500 py-1.5 px-6 text-white rounded-full hover:bg-rose-500 transition-all"
            document={
              <ChequesPdf
                cheques={bancos}
                calcularTotalMovimientos={calcularTotalMovimientos}
                fechaInicioMovimientos={fechaInicioMovimientos}
                fechaFinMovimientos={fechaFinMovimientos}
              />
            }
          >
            Descargar resumen bancos/cheques pdf.
          </PDFDownloadLink>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 bg-white py-5 px-5 max-md:grid-cols-1 max-md:h-[20vh] h-[20vh] scroll-bar overflow-y-scroll max-md:overflow-y-scroll">
        {bancos.map((b) => (
          <div
            key={b._id}
            className="bg-white border-blue-500 border py-5 px-5"
          >
            <p className="font-semibold">
              Banco:{" "}
              <span className="text-blue-500 capitalize font-bold">
                {b.nombre}
              </span>
            </p>
            <p className="font-semibold">
              Total en movimientos:
              <span className="text-blue-500 capitalize font-bold">
                {formatearDinero(
                  calcularTotalMovimientos(
                    b,
                    fechaInicioMovimientos,
                    fechaFinMovimientos
                  )
                )}
              </span>
            </p>
            <div className="flex mt-3">
              <Link
                to={`/banco/${b._id}`}
                className="text-sm font-bold text-blue-500 bg-blue-50 py-2 px-5 rounded-full border border-blue-500 hover:bg-blue-500 transition-all hover:text-white flex gap-2 items-center"
              >
                Ver banco/cheques <FaEye className="text-xl" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className=" bg-white py-5 px-5 flex gap-2 max-md:overflow-x-auto">
        <button
          className="text-sm font-bold text-blue-500 bg-blue-50 py-2 px-5 rounded-full border border-blue-500 hover:bg-blue-500 transition-all hover:text-white flex gap-2 items-center"
          onClick={() =>
            document.getElementById("my_modal_crear_banco_cheque").showModal()
          }
        >
          Crear nuevo banco <FaPiggyBank className="text-2xl max-md:hidden" />
        </button>
        <button
          className="text-sm font-bold text-blue-500 bg-blue-50 py-2 px-5 rounded-full border border-blue-500 hover:bg-blue-500 transition-all hover:text-white flex gap-2 items-center"
          onClick={() =>
            document.getElementById("my_modal_crear_cheque").showModal()
          }
        >
          Crear nuevo cheque <FaMarkdown className="text-2xl max-md:hidden" />
        </button>
      </div>

      <div className="flex mt-5">
        <p className="text-blue-500 font-bold border-b-2 border-blue-500">
          Tabla de cheques cargados
        </p>
      </div>
      <div className="flex gap-2 w-1/5 max-md:w-auto">
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

        <select
          className="border border-blue-500 mx-2 py-1 px-2 font-semibold capitalize text-sm cursor-pointer outline-none"
          id="proveedorSelect"
          value={proveedorSeleccionado}
          onChange={handleChangeProveedor}
        >
          <option className="font-bold text-xs text-blue-600" value="">
            Todos los proveedores
          </option>
          {proveedores.map((p) => (
            <option className="font-semibold capitalize text-xs">
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-6 gap-5 bg-white py-5 px-5 max-md:grid-cols-1 max-md:h-[20vh] max-md:overflow-y-scroll">
        <div className="bg-white border-blue-500 border py-5 px-5">
          <p className="font-semibold">Total en cheques</p>
          <span className="text-blue-500 capitalize font-bold">
            {formatearDinero(totalCheques)}
          </span>
        </div>
      </div>
      <div className="bg-white max-md:overflow-x-auto">
        <table className="table bg-white text-sm">
          <thead className="">
            <tr>
              <th>Banco</th>
              <th>Total</th>
              <th>Tipo</th>
              <th>Número de Cheque</th>
              <th>Proveedor/empresa</th>
              <th>Fecha de cobro</th>
              <th>Fecha de carga</th>
              <th>Estado del cheque</th>
            </tr>
          </thead>
          <tbody className="capitalize text-xs">
            {chequesFiltrados.map((banco) => (
              <tr key={banco._id}>
                <th>{banco.banco}</th>
                <th className="text-blue-500">
                  {formatearDinero(banco.total)}
                </th>
                <th>{banco.tipo}</th>
                <th>{banco.numero_cheque}</th>
                <th>{banco.datos}</th>
                <th>{updateFecha(banco.fecha_cobro)}</th>
                <th>{new Date(banco.date).toLocaleString()}</th>{" "}
                <th>
                  <button
                    onClick={() =>
                      actualizarEstadoCheque(banco._id, banco.estado)
                    }
                    className="flex"
                  >
                    <p
                      className={`py-1 px-2 rounded text-white ${
                        banco.estado === "pendiente el cobro"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    >
                      {banco.estado}
                    </p>
                  </button>
                </th>
                {/* Mostrar fecha y hora */}
                <th>
                  <div className="flex">
                    <p
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de que deseas eliminar este cheque?"
                          )
                        ) {
                          deleteChequeBanco(banco._id);
                        }
                      }}
                      className="bg-red-50 p-1 px-3 text-red-700 rounded cursor-pointer"
                    >
                      Eliminar cheque
                    </p>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCrearBancoCheque />
      <ModalCrearCheque bancos={bancos} />
      {/* <PDFViewer className="h-screen">
        <ChequesPdf
          cheques={bancos}
          calcularTotalMovimientos={calcularTotalMovimientos}
          fechaInicioMovimientos={fechaInicioMovimientos}
          fechaFinMovimientos={fechaFinMovimientos}
        />
      </PDFViewer> */}
    </section>
  );
};
