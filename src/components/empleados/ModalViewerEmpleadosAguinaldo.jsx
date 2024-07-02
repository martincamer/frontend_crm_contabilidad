import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { ComprobantesTodos } from "../comprobantes/ComprobantesTodosAguinaldo";

export const ModalViewerEmpleadosAguinaldo = ({ empleados }) => {
  return (
    <dialog id="my_modal_aguinaldo_comprobante" className="modal">
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
          <ComprobantesTodos empleados={empleados} />
        </PDFViewer>
      </div>
    </dialog>
  );
};
