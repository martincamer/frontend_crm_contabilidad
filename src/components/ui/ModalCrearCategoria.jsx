import { Submit } from "./Submit";

export const ModalCrearCategoria = () => {
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Crear categoría de gasto
          </h3>
        </div>
        <form className="mt-3 text-left">
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold text-sm text-gray-700">
              Nombre de la categoria
            </label>
            <input
              type="text"
              placeholder="Escribe de la categoria"
              className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
            />
          </div>
          <Submit>Guardar la categoria</Submit>
        </form>
      </div>
    </dialog>
  );
};
