import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { ComprobantesTodos } from "../comprobantes/ComprobantesTodos";

export const ModalViewerEmpleados = ({
  empleados,
  selectedQuincena,
  selectedTerminoPago,
}) => {
  return (
    <dialog id="my_modal_comprobantes" className="modal">
      <div className="modal-box rounded-none max-w-full h-full max-h-full">
        <form method="dialog">
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
          <ComprobantesTodos
            empleados={empleados}
            selectedQuincena={selectedQuincena}
            selectedTerminoPago={selectedTerminoPago}
          />
        </PDFViewer>
      </div>
    </dialog>
  );
};
