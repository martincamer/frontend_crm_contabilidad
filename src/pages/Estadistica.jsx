import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../api/axios";
import { formatearDinero } from "../helpers/FormatearDinero";
import { ModalGuardarDatos } from "../components/estadistica/ModalGuardarDatos";
import { Link } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { PdfComprobantePresupuestos } from "../components/estadistica/PdfComprobantePresupuestos";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ModalImprimirPresupuestos } from "../components/estadistica/ModalImprimirPresupuestos";
import { ModalGuardarDatosUpdate } from "../components/estadistica/ModalGuardarDatosUpdate";

export const Estadistica = () => {
  const params = useParams();
  const [egresos, setEgresos] = useState([]);

  const [editandoIndice, setEditandoIndice] = useState(null);
  const [nuevoNumero, setNuevoNumero] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevaObs, setNuevaObs] = useState("");
  const [nuevoPorcentaje, setNuevoPorcentaje] = useState("");
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState("");
  const [nuevoUtilizado, setNuevoUtilizado] = useState("");
  const [nuevaDiferencia, setNuevaDiferencia] = useState("");
  const [presupuestoAsignado, setPresupuestoAsignado] = useState("");

  const [canjes, setCanjes] = useState([]);
  const [datos, setDatos] = useState([]);

  const [canjesNumero, setCanjesNumero] = useState("");
  const [canjesTipo, setCanjesTipo] = useState("");
  const [canjesObs, setCanjesObs] = useState("");
  const [canjesUtilizado, setCanjesUtilizado] = useState("");
  const [editandoIndiceCanjes, setEditandoIndiceCanjes] = useState(null);

  // Arreglo para guardar el valor del presupuesto asignado
  const [presupuestoValor, setPresupuestoValor] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await instance.get(`/estadisticas/${params?.id}`);
      setCanjes(res?.data?.canjes);
      setEgresos(res?.data?.egresos);
      setPresupuestoAsignado(res?.data?.presupuesto);
      setDatos(res);

      console.log(res.data);
    };
    loadData();
  }, [params?.id]);

  const today = new Date();
  console.log(datos);

  // Formatear la fecha como "dd/mm/yyyy"
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Efecto para cargar el presupuesto asignado del localStorage al cargar el componente
  useEffect(() => {
    const presupuestoGuardado = localStorage.getItem("presupuestoAsignadoDos");
    if (presupuestoGuardado) {
      setPresupuestoAsignado(JSON.parse(presupuestoGuardado));
      setPresupuestoValor((prevPresupuestoValor) => [
        ...prevPresupuestoValor,
        JSON.parse(presupuestoGuardado),
      ]);
    }
  }, []); // Ejecutar solo una vez al cargar el componente

  // Función para guardar el presupuesto asignado en el localStorage y actualizar el estado
  const handlePresupuestoChange = (e) => {
    const valor = e.target.value;
    setPresupuestoAsignado(valor);
    setPresupuestoValor((prevPresupuestoValor) => [
      ...prevPresupuestoValor,
      valor,
    ]);
    localStorage.setItem("presupuestoAsignadoDos", JSON.stringify(valor));
  };

  const agregarFila = () => {
    const nuevaFila = {
      numero: nuevoNumero,
      tipo: nuevoTipo,
      obs: nuevaObs,
      porcentaje: nuevoPorcentaje,
      presupuesto: nuevoPresupuesto,
      utilizado: nuevoUtilizado,
      diferencia: nuevaDiferencia,
    };
    setEgresos([...egresos, nuevaFila]);
    limpiarCampos();
  };

  const editarFila = (index) => {
    setEditandoIndice(index);
    const filaEditada = egresos[index];
    setNuevoNumero(filaEditada.numero);
    setNuevoTipo(filaEditada.tipo);
    setNuevaObs(filaEditada.obs);
    setNuevoPorcentaje(filaEditada.porcentaje);
    setNuevoPresupuesto(filaEditada.presupuesto);
    setNuevoUtilizado(filaEditada.utilizado);
    setNuevaDiferencia(filaEditada.diferencia);
  };

  const actualizarFila = (index) => {
    const nuevasFilas = [...egresos];
    nuevasFilas[index] = {
      numero: nuevoNumero,
      tipo: nuevoTipo,
      obs: nuevaObs,
      porcentaje: nuevoPorcentaje,
      presupuesto: nuevoPresupuesto,
      utilizado: nuevoUtilizado,
      diferencia: nuevaDiferencia,
    };
    setEgresos(nuevasFilas);
    limpiarCampos();
    setEditandoIndice(null);
  };

  const eliminarFila = (index) => {
    const nuevasFilas = [...egresos];
    nuevasFilas.splice(index, 1);
    setEgresos(nuevasFilas);
  };

  const limpiarCampos = () => {
    setNuevoNumero("");
    setNuevoTipo("");
    setNuevaObs("");
    setNuevoPorcentaje("");
    setNuevoPresupuesto("");
    setNuevoUtilizado("");
    setNuevaDiferencia("");
  };

  const agregarFilaCanjes = () => {
    const nuevaFila = {
      numero: canjesNumero,
      tipo: canjesTipo,
      obs: canjesObs,
      utilizado: canjesUtilizado,
    };
    setCanjes([...canjes, nuevaFila]);
    limpiarCamposCanjes();
  };

  const editarFilaCanjes = (index) => {
    setEditandoIndiceCanjes(index);
    const filaEditada = canjes[index];
    setCanjesNumero(filaEditada.numero);
    setCanjesTipo(filaEditada.tipo);
    setCanjesObs(filaEditada.obs);
    setCanjesUtilizado(filaEditada.utilizado);
  };

  const actualizarFilaCanjes = (index) => {
    const nuevasFilas = [...canjes];
    nuevasFilas[index] = {
      numero: canjesNumero,
      tipo: canjesTipo,
      obs: canjesObs,
      utilizado: canjesUtilizado,
    };

    setCanjes(nuevasFilas);
    limpiarCamposCanjes();
    setEditandoIndiceCanjes(null);
  };

  const eliminarFilaCanjes = (index) => {
    const nuevasFilas = [...canjes];
    nuevasFilas.splice(index, 1);
    setCanjes(nuevasFilas);
  };

  const limpiarCamposCanjes = () => {
    setCanjesNumero("");
    setCanjesTipo("");
    setCanjesObs("");
    setCanjesUtilizado("");
  };

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedIndex === null || index === draggedIndex) return;
    const newEgresos = [...egresos];
    const draggedItem = newEgresos[draggedIndex];
    newEgresos.splice(draggedIndex, 1);
    newEgresos.splice(index, 0, draggedItem);
    setEgresos(newEgresos);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const [draggedIndexCanjes, setDraggedIndexCanjes] = useState(null);

  const handleDragStartCanjes = (index) => {
    setDraggedIndexCanjes(index);
  };

  const handleDragOverCanjes = (index) => {
    if (draggedIndexCanjes === null || index === draggedIndexCanjes) return;
    const newCanjes = [...canjes];
    const draggedItem = newCanjes[draggedIndexCanjes];
    newCanjes.splice(draggedIndexCanjes, 1);
    newCanjes.splice(index, 0, draggedItem);
    setCanjes(newCanjes);
    setDraggedIndexCanjes(index);
  };

  const handleDragEndCanjes = () => {
    setDraggedIndexCanjes(null);
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const sumaPorcentajes = egresos?.reduce(
    (total, egreso) => total + parseFloat(egreso?.porcentaje),
    0
  );

  const sumaUtilizado = egresos.reduce(
    (total, egreso) => total + parseFloat(egreso.utilizado),
    0
  );

  const resultadoCalculos = egresos.reduce((resultados, egreso) => {
    const resultado = Number(
      (egreso.porcentaje * presupuestoAsignado) / 100 - egreso.utilizado
    );
    resultados.push(resultado);
    return resultados;
  }, []);

  const sumaTotal = resultadoCalculos.reduce(
    (total, resultado) => total + resultado,
    0
  );

  const sumaTotalPositivos = resultadoCalculos.reduce((total, resultado) => {
    if (resultado > 0) {
      return total + resultado;
    }
    return total;
  }, 0);

  const totalUtilizado = canjes?.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue?.utilizado, 10);
  }, 0);

  const hoy = new Date();
  console.log(hoy);

  function obtenerMes(fecha) {
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const date = new Date(fecha);
    return meses[date.getMonth()];
  }

  return (
    <section className="mx-10 my-10 max-md:mx-5">
      <div className="bg-white py-5 px-5 flex justify-between max-md:flex-col">
        <p className="font-bold text-lg text-blue-500">
          Generar los datos de la estadistica del mes 🖐️
        </p>
        <p className="text-gray-600 font-semibold flex gap-2">
          Fecha <p className="text-blue-500 font-extrabold">{formattedDate}</p>
        </p>
      </div>
      <div className="mt-6 mb-10 grid grid-cols-4 gap-5 bg-white max-md:grid-cols-1 max-md:gap-2 max-md:h-[13vh] max-md:overflow-y-scroll scroll-bar">
        <article className="cursor-pointer flex justify-between items-start p-8">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-green-100 p-4 text-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>

            <div>
              <p className="text-xl font-bold text-gray-900">
                {Number(presupuestoAsignado || 0).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-xs text-gray-600 underline">
                PRESUPUESTO ASIGNADO
              </p>
            </div>
          </div>
        </article>
        <article className="cursor-pointer flex justify-between items-start p-8">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-red-100 p-4 text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>

            <div>
              <p className="text-xl font-bold text-red-700">
                {" "}
                -
                {Number(
                  Number(sumaUtilizado || 0) + Number(totalUtilizado || 0)
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-xs text-gray-600 underline">UTILIZADO REAL</p>
            </div>
          </div>
        </article>

        <article className="cursor-pointer flex justify-between items-start p-8">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-red-100 p-4 text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-xl font-bold text-red-700">
                {sumaTotal.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-xs text-gray-600 underline">
                PERDIDAS/DIFERENCIA
              </p>
            </div>
          </div>
        </article>

        <article className="cursor-pointer flex justify-between items-start p-8">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-green-100 p-4 text-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-xl font-bold text-slate-800">
                {sumaTotalPositivos.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-xs text-gray-600 underline">
                NO PERDIDAS/DIFERENCIA
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-5 transition-all ease-linear cursor-pointer bg-white py-5 px-5 max-md:overflow-x-auto">
        <table className="min-w-full divide-y-1 divide-gray-200 bg-white text-sm table">
          <thead>
            <tr className="border-b-[1px]">
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left w-[100px]">
                NUM °
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                Tipo de egreso
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                Obs.
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                %
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                Presupuesto
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                Utilizado Real
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                Diferencia
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left max-md:hidden">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-left">
            {egresos.map((egreso, index) => (
              <tr
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOver(index)}
                onDragEnd={handleDragEnd}
                className={index === draggedIndex ? "bg-gray-100" : ""}
                // className="hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
              >
                <td className="py-6 px-3 text-xs text-left text-slate-700 uppercase w-[100px]">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white focus:border-blue-500 outline-none py-1 px-1 border-slate-300 border-[1px] w-[50px] text-center"
                      type="text"
                      value={nuevoNumero}
                      onChange={(e) => setNuevoNumero(e.target.value)}
                    />
                  ) : (
                    egreso.numero
                  )}
                </td>
                <td className="py-6 px-3 text-xs text-left text-slate-700 uppercase">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white focus:border-blue-500 outline-none py-1 px-3 border-slate-300 border-[1px]"
                      type="text"
                      value={nuevoTipo}
                      onChange={(e) => setNuevoTipo(e.target.value)}
                    />
                  ) : (
                    egreso.tipo
                  )}
                </td>
                <td className="py-6 px-3 text-xs text-left text-slate-700 uppercase">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white focus:border-blue-500 outline-none py-1 px-3 border-slate-300 border-[1px]"
                      type="text"
                      value={nuevaObs}
                      onChange={(e) => setNuevaObs(e.target.value)}
                    />
                  ) : (
                    egreso.obs
                  )}
                </td>
                <th className="py-6 px-3 text-xs text-left text-slate-700 uppercase">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white focus:border-blue-500 outline-none py-1 border-slate-300 border-[1px] w-[60px] text-center"
                      type="text"
                      value={nuevoPorcentaje}
                      onChange={(e) => setNuevoPorcentaje(e.target.value)}
                    />
                  ) : (
                    `${egreso.porcentaje}%`
                  )}
                </th>
                <td className="py-6 px-3 text-xs text-left text-slate-700 font-bold">
                  {editandoIndice === index ? (
                    // <input
                    //   className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                    //   type="text"
                    //   value={nuevoPresupuesto}
                    //   onChange={(e) => setNuevoPresupuesto(e.target.value)}
                    // />
                    <p></p>
                  ) : (
                    // Number(egreso.presupuesto).toLocaleString("es-AR", {
                    //   style: "currency",
                    //   currency: "ARS",
                    // })

                    `${Number(
                      (egreso.porcentaje * presupuestoAsignado) / 100
                    ).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}`
                  )}
                </td>
                <td className="py-6 px-3 text-xs text-left text-slate-700 font-bold">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white focus:border-blue-500 outline-none py-1 border-slate-300 border-[1px] w-[60px] text-center"
                      type="text"
                      value={nuevoUtilizado}
                      onChange={(e) => setNuevoUtilizado(e.target.value)}
                    />
                  ) : (
                    Number(egreso.utilizado).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })
                  )}
                </td>
                <td className="py-6 px-3 text-xs text-left text-slate-700">
                  {editandoIndice === index ? (
                    <p></p>
                  ) : (
                    <span
                      className={
                        Number(
                          Number(
                            (egreso.porcentaje * presupuestoAsignado) / 100
                          ) - egreso.utilizado
                        ) < 0
                          ? "text-red-700 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {Number(
                        Number(
                          (egreso.porcentaje * presupuestoAsignado) / 100
                        ) - egreso.utilizado
                      ).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </span>
                  )}
                </td>
                <td className="space-x-2 gap-2 max-md:hidden">
                  {editandoIndice === index ? (
                    <>
                      <button
                        className="bg-green-500 py-1 px-2 rounded text-white uppercase font-bold text-xs"
                        onClick={() => actualizarFila(index)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-red-500/20 py-1 px-2 rounded text-red-700 uppercase font-bold text-xs"
                        onClick={() => setEditandoIndice(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => editarFila(index)}
                        className="bg-blue-500 py-1 px-2 rounded text-white uppercase font-bold text-xs"
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500/20 py-1 px-2 rounded text-red-700 uppercase font-bold text-xs"
                        onClick={() => eliminarFila(index)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5 mx-5 mb-5 py-2">
          <p className="text-left text-slate-800 uppercase text-sm">
            Asignar presupuesto
          </p>
          <div onClick={handleInputClick}>
            {isEditable ? (
              <div className="flex gap-4 items-center mt-2">
                <input
                  className="bg-white focus:border-blue-500 outline-none py-1 border-slate-300 border-[1px] text-center"
                  type="text"
                  value={presupuestoAsignado}
                  onChange={handlePresupuestoChange}
                  onBlur={() => setIsEditable(false)}
                />
              </div>
            ) : (
              <div className="flex mt-2 w-full">
                <p className="bg-white border-slate-300 border-[1px] py-2 px-5 focus:border-blue-500 outline-none text-sm font-bold">
                  {formatearDinero(Number(presupuestoAsignado) || 0)}
                </p>
              </div>
            )}
          </div>
        </div>
        <form
          className="py-3 px-5 border-[1px] border-slate-300 mb-6 mx-5 flex gap-5 max-md:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            agregarFila();
          }}
        >
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nuevo-numero">
              Numero:
            </label>
            <input
              className="bg-white border-slate-300 border-[1px] py-2 px-5 focus:border-blue-500 outline-none text-sm font-bold"
              type="text"
              id="nuevo-numero"
              value={nuevoNumero}
              onChange={(e) => setNuevoNumero(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nuevo-tipo">
              Tipo de Egreso:
            </label>
            <input
              className="bg-white border-slate-300 border-[1px] py-2 px-5 focus:border-blue-500 outline-none text-sm font-bold"
              type="text"
              id="nuevo-tipo"
              value={nuevoTipo}
              onChange={(e) => setNuevoTipo(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nueva-obs">
              Observaciones:
            </label>
            <input
              className="bg-white border-slate-300 border-[1px] py-2 px-5 focus:border-blue-500 outline-none text-sm font-bold"
              type="text"
              id="nueva-obs"
              value={nuevaObs}
              onChange={(e) => setNuevaObs(e.target.value)}
            />
          </div>
          {/* Agregar más campos según sea necesario */}
          <button
            className="bg-blue-500 py-1 px-2 text-white uppercase rounded-xl text-xs font-bold"
            type="submit"
          >
            Agregar Fila
          </button>
        </form>
      </div>

      <div className="mt-6 flex">
        <p className="text-blue-600 bg-white py-3 px-5 font-bold ">
          TABLA DE CANJES
        </p>
      </div>

      <div className="py-5 px-5 cursor-pointer mt-5 transition-all ease-in-out bg-white  max-md:overflow-x-auto">
        <table className="min-w-full divide-y-1 divide-gray-200 bg-white text-sm table">
          <thead>
            <tr className="border-b-[1px]">
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left w-[100px]">
                NUM °
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                Tipo de canje
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                Obs.
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
                Utilizado en cajes
              </th>
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left max-md:hidden">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-left">
            {canjes.map((canjes, index) => (
              <tr
                key={index}
                draggable
                onDragStart={() => handleDragStartCanjes(index)}
                onDragOver={() => handleDragOverCanjes(index)}
                onDragEnd={handleDragEndCanjes}
                className={index === draggedIndexCanjes ? "bg-gray-100" : ""}
                // className="hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
              >
                <td className="py-6 px-3 text-xs text-left text-slate-700 uppercase w-[100px]">
                  {editandoIndiceCanjes === index ? (
                    <input
                      className="bg-white focus:border-blue-500 outline-none py-1 px-1 border-slate-300 border-[1px] w-[50px] text-center"
                      type="text"
                      value={canjesNumero}
                      onChange={(e) => setCanjesNumero(e.target.value)}
                    />
                  ) : (
                    canjes.numero
                  )}
                </td>
                <td className="py-6 px-3 text-xs text-left text-slate-700 uppercase">
                  {editandoIndiceCanjes === index ? (
                    <textarea
                      className="bg-white focus:border-blue-500 outline-none py-1 px-1 border-slate-300 border-[1px] text-center"
                      type="text"
                      value={canjesTipo}
                      onChange={(e) => setCanjesTipo(e.target.value)}
                    />
                  ) : (
                    canjes.tipo
                  )}
                </td>
                <td className="py-6 px-3 text-xs text-left text-slate-700 uppercase">
                  {editandoIndiceCanjes === index ? (
                    <textarea
                      className="bg-white focus:border-blue-500 outline-none py-1 px-1 border-slate-300 border-[1px] text-center"
                      type="text"
                      value={canjesObs}
                      onChange={(e) => setCanjesObs(e.target.value)}
                    />
                  ) : (
                    canjes.obs
                  )}
                </td>

                <td className="py-6 px-3 text-xs text-left text-slate-700 font-bold">
                  {editandoIndiceCanjes === index ? (
                    <input
                      className="bg-white focus:border-blue-500 outline-none py-1 px-1 border-slate-300 border-[1px] text-center"
                      type="text"
                      value={canjesUtilizado}
                      onChange={(e) => setCanjesUtilizado(e.target.value)}
                    />
                  ) : (
                    Number(canjes.utilizado).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })
                  )}
                </td>

                <td className="space-x-2 gap-2 max-md:hidden">
                  {editandoIndiceCanjes === index ? (
                    <>
                      <button
                        className="bg-green-500 py-1 px-2 rounded text-white uppercase font-bold text-xs"
                        onClick={() => actualizarFilaCanjes(index)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-red-100 py-1 px-2 rounded text-red-700 uppercase font-bold text-xs"
                        onClick={() => setEditandoIndiceCanjes(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => editarFilaCanjes(index)}
                        className="bg-blue-500 py-1 px-2 rounded text-white uppercase font-bold text-xs"
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-100 py-1 px-2 rounded text-red-700 uppercase font-bold text-xs"
                        onClick={() => eliminarFilaCanjes(index)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form
          className="py-3 px-5 border-[1px] mb-6 mx-5 flex gap-5 mt-10 max-md:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            agregarFilaCanjes();
          }}
        >
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nuevo-numero-dos">
              Numero:
            </label>
            <input
              className="bg-white border-slate-300 border-[1px] py-2 px-5 focus:border-blue-500 outline-none text-sm font-bold"
              type="text"
              id="nuevo-numero-dos"
              value={canjesNumero}
              onChange={(e) => setCanjesNumero(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nuevo-tipo-dos">
              Tipo de canje:
            </label>
            <input
              className="bg-white border-slate-300 border-[1px] py-2 px-5 focus:border-blue-500 outline-none text-sm font-bold"
              type="text"
              id="nuevo-numero-tipo"
              value={canjesTipo}
              onChange={(e) => setCanjesTipo(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nueva-obs">
              Observaciones canjes:
            </label>
            <input
              className="bg-white border-slate-300 border-[1px] py-2 px-5 focus:border-blue-500 outline-none text-sm font-bold"
              type="text"
              id="nueva-obs"
              value={canjesObs}
              onChange={(e) => setCanjesObs(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 py-1 px-2 text-white uppercase rounded-xl text-xs font-bold"
            type="submit"
          >
            Agregar Fila canje
          </button>
        </form>
      </div>
      <div className="bg-white py-2 px-5 mt-5 flex gap-3">
        <button
          onClick={() =>
            document.getElementById("my_modal_guardar_datos_update").showModal()
          }
          className="bg-green-500 py-2 px-5 text-white font-bold rounded-md text-sm max-md:hidden"
        >
          Guardar datos
        </button>
        <button
          onClick={() =>
            document.getElementById("my_modal_pdf_estadistica").showModal()
          }
          className="bg-blue-500 py-2 px-5 text-white font-bold rounded-md text-sm max-md:hidden"
        >
          Imprimir estadistica ahora
        </button>
        <PDFDownloadLink
          document={
            <PdfComprobantePresupuestos
              obtenerMes={obtenerMes}
              // month={hoy}
              // fechaObtenida={fechaObtenida}
              canjes={canjes}
              datos={egresos}
              presupuestoAsignado={presupuestoAsignado}
              data={datos}
              // month={month}
            />
          }
          className="bg-blue-500 py-2 px-5 text-white font-bold rounded-md text-sm md:hidden"
        >
          Imprimir estadistica ahora
        </PDFDownloadLink>
      </div>

      <ModalGuardarDatosUpdate
        params={params.id}
        presupuestoAsignado={presupuestoAsignado}
        canjes={canjes}
        egresos={egresos}
      />

      <ModalImprimirPresupuestos
        // month={hoy}
        obtenerMes={obtenerMes}
        canjes={canjes}
        egresos={egresos}
        presupuestoAsignado={presupuestoAsignado}
        datos={datos}
      />
    </section>
  );
};
