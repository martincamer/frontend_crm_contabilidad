import { FaCheck } from "react-icons/fa";

export const ModalPagado = () => {
  return (
    <dialog id="my_modal_cobrado" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <p className="font-bold text-xl text-center text-blue-500">
            ¡Comprobante generado correctamente!
          </p>

          <div className="flex justify-center mt-5">
            <div className="bg-green-500 py-8 px-8 w-auto rounded-full text-white text-4xl">
              <FaCheck />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
