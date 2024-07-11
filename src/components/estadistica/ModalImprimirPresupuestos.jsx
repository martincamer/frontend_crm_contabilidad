import { PDFViewer } from "@react-pdf/renderer";
import { PdfComprobantePresupuestos } from "./PdfComprobantePresupuestos";

export const ModalImprimirPresupuestos = ({
  canjes,
  egresos,
  presupuestoAsignado,
  fechaObtenida,
  datos,
  month,
  obtenerMes,
}) => {
  return (
    <dialog id="my_modal_pdf_estadistica" className="modal ">
      <div className="modal-box rounded-none max-w-6xl py-10 scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex">
          <h3 className="font-bold text-lg text-blue-500 border-b-2 border-blue-500">
            Imprimir la estadistica/presupuesto
          </h3>
        </div>

        <div className="w-full h-full py-10 px-10">
          <PDFViewer className="w-full h-screen">
            <PdfComprobantePresupuestos
              fechaObtenida={fechaObtenida}
              canjes={canjes}
              datos={egresos}
              presupuestoAsignado={presupuestoAsignado}
              data={datos}
              month={month}
              obtenerMes={obtenerMes}
            />
          </PDFViewer>
        </div>
      </div>
    </dialog>
  );
};
