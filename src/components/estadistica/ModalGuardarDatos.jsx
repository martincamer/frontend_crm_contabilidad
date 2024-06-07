import { useEstadistica } from "../../context/estadisticaContext";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

export const ModalGuardarDatos = ({ canjes, egresos, presupuestoAsignado }) => {
  const { handleSubmit } = useForm();

  const { createEstadistica } = useEstadistica();

  const onSubmit = async (formData) => {
    let reciboData = {
      ...formData,
      presupuesto: presupuestoAsignado,
      canjes: canjes,
      egresos: egresos,
      date: dayjs.utc(formData.date).format(),
    };

    try {
      await createEstadistica(reciboData);

      //   document.getElementById("my_modal_guardar_datos").close();
    } catch (error) {
      console.error("Error creating receipt:", error);
    }
  };
  return (
    <dialog id="my_modal_datos" className="modal">
      <div className="modal-box rounded-none max-w-2xl py-10">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-blue-500 border-b-2 border-blue-500">
          Guardar los datos
        </h3>
        <p className="mt-2 text-gray-600 font-semibold">
          ¿Deseas guardar los datos del presupuesto?
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5 mt-5">
          <button
            type="submit"
            className="bg-green-500 py-1 px-4 rounded-full text-white font-semibold"
          >
            Guardar los datos
          </button>
          <button
            onClick={() => document.getElementById("my_modal_datos").close()}
            type="button"
            className="bg-red-500 py-1 px-4 rounded-full text-white font-semibold"
          >
            Cerrar ventana
          </button>
        </form>
      </div>
    </dialog>
  );
};
