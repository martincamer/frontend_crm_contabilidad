import { useEffect, useState } from "react";

export function HomeApp() {
  const today = new Date();

  // Formatear la fecha como "dd/mm/yyyy"
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [egresos, setEgresos] = useState(
    JSON.parse(localStorage.getItem("egresos")) || []
  );

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
  const [canjesNumero, setCanjesNumero] = useState("");
  const [canjesTipo, setCanjesTipo] = useState("");
  const [canjesObs, setCanjesObs] = useState("");
  const [canjesUtilizado, setCanjesUtilizado] = useState("");
  const [editandoIndiceCanjes, setEditandoIndiceCanjes] = useState(null);

  // Guardar en localStorage cada vez que egresos cambie
  useEffect(() => {
    localStorage.setItem("egresos", JSON.stringify(egresos));
  }, [egresos]);

  // Arreglo para guardar el valor del presupuesto asignado
  const [presupuestoValor, setPresupuestoValor] = useState([]);

  // Efecto para cargar el presupuesto asignado del localStorage al cargar el componente
  useEffect(() => {
    const presupuestoGuardado = localStorage.getItem("presupuestoAsignado");
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
    localStorage.setItem("presupuestoAsignado", JSON.stringify(valor));
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

  return (
    <section className="mx-10 my-10">
      <div className="bg-white py-5 px-5 flex justify-between">
        <p className="font-bold text-lg text-blue-500">
          Generar los datos de la estadistica del mes 🖐️
        </p>
        <p className="text-gray-600 font-semibold flex gap-2">
          Fecha <p className="text-blue-500 font-extrabold">{formattedDate}</p>
        </p>
      </div>
      <div className="mt-5 transition-all ease-linear cursor-pointer bg-white py-5 px-5">
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
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
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
                      className="bg-white rounded-xl py-1 px-1 border-slate-300 border-[1px] w-[50px] text-center"
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
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
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
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                      type="text"
                      value={nuevaObs}
                      onChange={(e) => setNuevaObs(e.target.value)}
                    />
                  ) : (
                    egreso.obs
                  )}
                </td>
                <td className="py-6 px-3 text-xs text-left text-slate-700 uppercase">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white rounded-xl py-1 border-slate-300 border-[1px] w-[60px] text-center"
                      type="text"
                      value={nuevoPorcentaje}
                      onChange={(e) => setNuevoPorcentaje(e.target.value)}
                    />
                  ) : (
                    `${egreso.porcentaje}%`
                  )}
                </td>
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
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
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
                <td className="py-6 px-3 text-sm text-left text-slate-700">
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
                <td className="space-x-2 gap-2">
                  {editandoIndice === index ? (
                    <>
                      <button
                        className="bg-green-500 py-2 px-3 rounded-xl text-white uppercase font-bold"
                        onClick={() => actualizarFila(index)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-red-500/20 py-2 px-3 rounded-xl text-red-700 uppercase font-bold"
                        onClick={() => setEditandoIndice(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => editarFila(index)}
                        className="bg-blue-500 py-2 px-3 rounded-xl text-white uppercase font-bold"
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500/20 py-2 px-3 rounded-xl text-red-700 uppercase font-bold"
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
          <div className="flex gap-4 items-center mt-2">
            <input
              className="bg-white border-slate-300 border-[1px] py-2 px-5 rounded-xl shadow"
              type="text"
              value={presupuestoAsignado}
              onChange={handlePresupuestoChange}
            />
            <p className="bg-blue-500 py-2 px-2 rounded-xl text-white font-semibold text-sm">
              {Number(presupuestoAsignado).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>
        </div>
        <form
          className="py-3 px-5 rounded-xl border-[1px] mb-6 mx-5 flex gap-5"
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
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5 w-[100px]"
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
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5"
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
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5"
              type="text"
              id="nueva-obs"
              value={nuevaObs}
              onChange={(e) => setNuevaObs(e.target.value)}
            />
          </div>
          {/* Agregar más campos según sea necesario */}
          <button
            className="bg-blue-500 py-2 px-2 text-white uppercase rounded-xl text-sm shadow font-semibold"
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

      <div className="py-5 px-5 cursor-pointer mt-5 transition-all ease-in-out bg-white">
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
              <th className="py-4 px-2 uppercase text-xs text-slate-800 font-bold text-left">
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
                      className="bg-white rounded-xl py-1 px-1 border-slate-300 border-[1px] w-[50px] text-center"
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
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
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
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
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
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
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

                <td className="space-x-2 gap-2">
                  {editandoIndiceCanjes === index ? (
                    <>
                      <button
                        className="bg-green-500 py-2 px-3 rounded-xl text-white uppercase font-bold"
                        onClick={() => actualizarFilaCanjes(index)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-red-500/20 py-2 px-3 rounded-xl text-red-700 uppercase font-bold"
                        onClick={() => setEditandoIndiceCanjes(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => editarFilaCanjes(index)}
                        className="bg-indigo-500 py-2 px-3 rounded-xl text-white uppercase font-bold"
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500/20 py-2 px-3 rounded-xl text-red-700 uppercase font-bold"
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
          className="py-3 px-5 rounded-xl border-[1px] mb-6 mx-5 flex gap-5 mt-10"
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
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5 w-[100px]"
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
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5"
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
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5"
              type="text"
              id="nueva-obs"
              value={canjesObs}
              onChange={(e) => setCanjesObs(e.target.value)}
            />
          </div>
          {/* Agregar más campos según sea necesario */}
          <button
            className="bg-indigo-500 py-2 px-2 text-white uppercase rounded-xl text-sm shadow font-semibold"
            type="submit"
          >
            Agregar Fila Canje
          </button>
        </form>
      </div>
    </section>
  );
}
