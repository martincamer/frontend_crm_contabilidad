import { PDFViewer } from "@react-pdf/renderer";
import { PdfEstadistica } from "./PdfEstadistica";

export const ModalPdfEstadistica = ({
  canjes,
  egresos,
  presupuestoAsignado,
}) => {
  return (
    <dialog id="my_modal_pdf_estadistica" className="modal">
      <div className="modal-box rounded-none max-w-2xl py-10">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-blue-500 border-b-2 border-blue-500">
          Datos estadistica
        </h3>

        <div>
          {/* <PDFViewer>
            <PdfEstadistica
              canjes={canjes}
              datos={egresos}
              presupuestoAsignado={presupuestoAsignado}
              fechaObtenida={""}
            />
          </PDFViewer> */}
        </div>
      </div>
    </dialog>
  );
};
