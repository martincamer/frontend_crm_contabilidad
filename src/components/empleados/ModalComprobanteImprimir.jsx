import React, { useEffect, useState } from "react";
import { useEmpleado } from "../../context/EmpleadosContext";
import { updateFecha } from "../../helpers/FechaUpdate";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ComprobantePago } from "../comprobantes/ComprobantePago";

export const ModalComprobantePago = () => {
  const { recibo } = useEmpleado();

  console.log("empleado", recibo);

  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
  };

  const { years, months } = calculateAntiquity(recibo.fecha_ingreso);

  return (
    <dialog id="my_modal_comprobante" className="modal">
      <div className="modal-box rounded-none w-full max-w-6xl scroll-bar">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex gap-2 items-center">
          <div>
            <PDFDownloadLink
              document={<ComprobantePago recibo={recibo} />}
              className="font-semibold bg-blue-500 py-2 px-5 text-white rounded-full text-sm"
            >
              Descargar o imprimir comprobante
            </PDFDownloadLink>
          </div>
          <button
            type="button"
            className="font-semibold bg-blue-500 py-2 px-5 text-white rounded-full text-sm"
            onClick={() => document.getElementById("my_modal_pdf").showModal()}
          >
            Ver comprobante e imprimir
          </button>
        </div>
        <dialog id="my_modal_pdf" className="modal">
          <div className="modal-box max-w-full rounded-none">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <PDFViewer
              style={{
                width: "100%",
                height: "100vh",
              }}
            >
              <ComprobantePago recibo={recibo} />
            </PDFViewer>
          </div>
        </dialog>
        {/* Mostrar nombre del empleado seleccionado */}
        <div className="mt-5 bg-blue-500 py-5 px-5 text-white font-medium">
          Empleado del recibo{" "}
          <span className="font-extrabold capitalize">
            {recibo?.nombre} {recibo?.apellido}
          </span>
        </div>

        <div className="border py-5 px-5 mt-6">
          <div className="justify-between flex items-center">
            <div className="flex flex-col gap-2">
              <img
                className="w-40"
                src="https://www.viviendastecnohouse.com.ar/storage/img/logo.png"
                alt=""
              />
            </div>
            <div className="font-semibold">
              {updateFecha(recibo.created_at)}
            </div>
          </div>
          <div className="bg-gray-200 py-5 px-5 mt-5 rounded-xl">
            <p className="font-bold text-center">
              Pago De Haberes - Comprobante{" "}
              {recibo.sueldo === "quincenal"
                ? recibo.termino_pago === "quincena_veinte"
                  ? "quincena del 20"
                  : "quincena del 5"
                : "mensual"}
            </p>
          </div>
          <div className="border mt-5 py-5 px-5 rounded-xl grid grid-cols-3 gap-5">
            <div className="bg-gray-200 py-5 px-5 rounded-xl">
              <p className="font-medium uppercase">
                Empleado{" "}
                <span className="font-extrabold">
                  {recibo.nombre} {recibo.apellido}
                </span>
              </p>
            </div>

            <div className="bg-gray-200 py-5 px-5 rounded-xl">
              <p className="font-medium uppercase">
                Fecha de ingreso{" "}
                <span className="font-extrabold">
                  {updateFecha(recibo.fecha_ingreso)}
                </span>
              </p>
            </div>

            <div className="bg-gray-200 py-5 px-5 rounded-xl">
              <p className="font-medium uppercase">
                Antiguedad{" "}
                <span className="font-extrabold">
                  <th>{`${years} años, ${months} meses`}</th>{" "}
                </span>
              </p>
            </div>

            <div className="bg-gray-200 py-5 px-5 rounded-xl">
              <p className="font-medium uppercase">
                Tipo de sueldo{" "}
                <span className="font-extrabold">{recibo.sueldo}</span>
              </p>
            </div>

            <div className="bg-gray-200 py-5 px-5 rounded-xl">
              <p className="font-medium uppercase">
                Fabrica o Suc.{" "}
                <span className="font-extrabold">
                  {recibo.fabrica_sucursal}
                </span>
              </p>
            </div>

            <div className="bg-gray-200 py-5 px-5 rounded-xl">
              <p className="font-medium uppercase">
                Sector/Rol.{" "}
                <span className="font-extrabold">{recibo.sector_trabajo}</span>
              </p>
            </div>

            <div className="bg-gray-200 py-5 px-5 rounded-xl col-span-3 text-center">
              <p className="font-medium uppercase">
                Remuneración asignada{" "}
                <span className="font-extrabold">
                  {formatearDinero(
                    recibo.sueldo === "quincenal"
                      ? recibo.termino_pago === "quincena_veinte"
                        ? Number(recibo?.recibo?.quincena_veinte) +
                          Number(recibo?.recibo?.comida) -
                          Number(recibo?.recibo?.descuento_del_veinte)
                        : Number(recibo?.recibo?.quincena_cinco) +
                          Number(recibo?.recibo?.premio_produccion) +
                          Number(recibo?.recibo?.premio_asistencia) +
                          Number(recibo?.recibo?.otros) +
                          -Number(recibo?.recibo?.descuento_del_cinco)
                      : Number(recibo?.recibo?.sueldo_basico) +
                          Number(recibo?.recibo?.premio_produccion) +
                          Number(recibo?.recibo?.premio_asistencia) +
                          Number(recibo?.recibo?.otros) +
                          Number(recibo?.recibo?.comida) -
                          Number(recibo?.recibo?.descuento_del_cinco)
                  )}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-5 border py-5 px-5">
            <p className="font-bold text-base">Observaciones</p>

            <p className="text-sm font-semibold uppercase mb-3">
              {recibo?.sueldo === "quincenal"
                ? recibo?.recibo?.termino_pago === "quincena_veinte"
                  ? recibo?.recibo?.observacion_veinte
                  : recibo?.recibo?.observacion_cinco
                : recibo?.recibo?.observacion}
            </p>

            <p className="text-sm font-semibold uppercase">
              -{" "}
              {formatearDinero(
                Number(
                  recibo?.sueldo === "quincenal"
                    ? recibo?.recibo?.termino_pago === "quincena_veinte"
                      ? recibo?.recibo?.descuento_del_veinte
                      : recibo?.recibo?.descuento_del_cinco
                    : recibo?.recibo?.descuento_del_cinco
                )
              )}{" "}
              Descuento por faltas/prestamos/otros/etc
            </p>
            <p className="text-sm font-semibold uppercase">
              {recibo?.sueldo === "quincenal" && recibo?.recibo?.banco
                ? recibo?.recibo?.termino_pago === "quincena_veinte"
                  ? `- ${formatearDinero(
                      Number(recibo?.recibo?.banco)
                    )} COBRADO EN EL BANCO`
                  : `- ${formatearDinero(
                      Number(recibo?.recibo?.banco)
                    )} COBRADO EN EL BANCO`
                : recibo?.recibo?.banco
                ? `- ${formatearDinero(
                    Number(recibo?.recibo?.banco)
                  )} COBRADO EN EL BANCO`
                : ""}
            </p>
            <p className="text-sm font-semibold uppercase">
              {recibo?.sueldo === "quincenal" &&
              recibo?.recibo?.premio_produccion
                ? recibo?.recibo?.termino_pago === "quincena_veinte"
                  ? `+ ${formatearDinero(
                      Number(recibo?.recibo?.premio_produccion)
                    )} PREMIO PRODUCCIÓN`
                  : `+ ${formatearDinero(
                      Number(recibo?.recibo?.premio_produccion)
                    )} PREMIO PRODUCCIÓN`
                : recibo?.recibo?.premio_produccion
                ? `+ ${formatearDinero(
                    Number(recibo?.recibo?.premio_produccion)
                  )} PREMIO PRODUCCIÓN`
                : ""}
            </p>
            <p className="text-sm font-semibold uppercase">
              {recibo?.sueldo === "quincenal" &&
              recibo?.recibo?.premio_asistencia
                ? recibo?.recibo?.termino_pago === "quincena_veinte"
                  ? `+ ${formatearDinero(
                      Number(recibo?.recibo?.premio_asistencia)
                    )} PREMIO ASISTENCIA`
                  : `+ ${formatearDinero(
                      Number(recibo?.recibo?.premio_asistencia)
                    )} PREMIO ASISTENCIA`
                : recibo?.recibo?.premio_asistencia
                ? `+ ${formatearDinero(
                    Number(recibo?.recibo?.premio_asistencia)
                  )} PREMIO ASISTENCIA`
                : ""}
            </p>
            <p className="text-sm font-semibold uppercase">
              {recibo?.sueldo === "quincenal" && recibo?.recibo?.comida
                ? recibo?.recibo?.termino_pago === "quincena_veinte"
                  ? `+ ${formatearDinero(
                      Number(recibo?.recibo?.comida)
                    )} COMIDA`
                  : `+ ${formatearDinero(
                      Number(recibo?.recibo?.comida)
                    )} COMIDA`
                : recibo?.recibo?.comida
                ? `+ ${formatearDinero(Number(recibo?.recibo?.comida))} COMIDA`
                : ""}
            </p>
            <p className="text-sm font-semibold uppercase">
              {recibo?.sueldo === "quincenal"
                ? recibo?.recibo?.termino_pago === "quincena_veinte"
                  ? `+  ${formatearDinero(
                      Number(recibo?.recibo?.otros || 0)
                    )} OTRO IMPORTE`
                  : `+  ${formatearDinero(
                      Number(recibo?.recibo?.otros || 0)
                    )} OTRO IMPORTE`
                : ` + ${formatearDinero(
                    Number(recibo?.recibo?.otros || 0)
                  )} OTRO IMPORTE`}
            </p>
            {recibo.termino_pago === "sueldo" ||
            recibo.termino_pago === "quincena_cinco" ? (
              <p className="text-sm font-semibold uppercase">
                + {formatearDinero(Number(recibo.antiguedad_total))} de
                antiguedad
              </p>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="border py-5 px-5 mt-5">
          <p className="flex justify-between font-medium">
            SubTotal
            <span className="font-extrabold">
              {formatearDinero(
                recibo.sueldo === "quincenal"
                  ? recibo.termino_pago === "quincena_veinte"
                    ? Number(recibo?.recibo?.quincena_veinte) +
                      Number(recibo?.recibo?.comida) -
                      Number(recibo?.recibo?.descuento_del_veinte)
                    : Number(recibo?.recibo?.quincena_cinco) +
                      Number(recibo?.recibo?.premio_produccion) +
                      Number(recibo?.recibo?.premio_asistencia) +
                      Number(recibo?.recibo?.otros) +
                      Number(recibo.antiguedad_total) -
                      Number(recibo?.recibo?.descuento_del_cinco)
                  : Number(recibo?.recibo?.sueldo_basico) +
                      Number(recibo?.recibo?.premio_produccion) +
                      Number(recibo?.recibo?.premio_asistencia) +
                      Number(recibo?.recibo?.otros) +
                      Number(recibo?.recibo?.comida) -
                      Number(recibo?.recibo?.descuento_del_cinco)
              )}
            </span>
          </p>
          <p className="flex justify-between font-medium">
            Total a cobrar efectivo
            <span className="font-extrabold">
              {formatearDinero(
                recibo.sueldo === "quincenal"
                  ? recibo.termino_pago === "quincena_veinte"
                    ? Number(recibo?.recibo?.quincena_veinte) +
                      Number(recibo?.recibo?.comida) -
                      Number(recibo?.recibo?.descuento_del_veinte)
                    : Number(recibo?.recibo?.quincena_cinco) +
                      Number(recibo?.recibo?.premio_produccion) +
                      Number(recibo?.recibo?.premio_asistencia) +
                      Number(recibo?.recibo?.otros) +
                      Number(recibo.antiguedad_total) -
                      Number(recibo?.recibo?.banco) -
                      Number(recibo?.recibo?.descuento_del_cinco)
                  : Number(recibo?.recibo?.sueldo_basico) +
                      Number(recibo?.recibo?.premio_produccion) +
                      Number(recibo?.recibo?.premio_asistencia) +
                      Number(recibo?.recibo?.otros) +
                      Number(recibo?.recibo?.comida) -
                      Number(recibo?.recibo?.banco) -
                      Number(recibo?.recibo?.descuento_del_cinco)
              )}
            </span>
          </p>
        </div>
      </div>
    </dialog>
  );
};
