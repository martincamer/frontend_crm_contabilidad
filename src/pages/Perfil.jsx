import ModalCargarImagen from "../components/users/ModalCargarImagen";
import { useAuth } from "../context/authContext";
import { useModal } from "../helpers/modal";

export const Perfil = () => {
  const { user } = useAuth();

  const {
    closeModal: closeModalImagen,
    isOpen: isOpenImagen,
    openModal: openModalImagen,
  } = useModal();

  return (
    <section className="container mx-auto my-10">
      <div className="bg-white py-6 px-6 rounded-xl shadow-xl w-1/2 max-md:mx-5 max-md:w-auto mx-auto flex justify-between">
        <div className="flex gap-3 items-center">
          <img
            src={
              user.imagen ||
              "https://ppstatic.s3.amazonaws.com/expenses/uploads/people/app-243391-35471-888.blob"
            }
            className="w-[80px]
           rounded-full"
          />
          <div>
            <p className="font-semibold capitalize text-gray-700 text-sm">
              {user.username}
            </p>
          </div>
        </div>
        <div>
          <div>
            <p className="text-sm text-gray-700 font-semibold">
              Ultima actualización del perfil
            </p>
            <p className="font-bold capitalize text-gray-500 text-sm text-end">
              {new Date(user?.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex justify-end mt-5">
            <button
              onClick={() => openModalImagen()}
              type="button"
              className="border-[1px] border-blue-700 py-2 px-5 rounded-full text-blue-700 font-bold text-sm shadow"
            >
              Cargar imagen usuario
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-xl w-1/2 mx-auto mt-5 max-md:mx-5 max-md:w-auto">
        <div className="bg-gray-100 py-8 px-5 rounded-t-xl">
          <p className="text-blue-500 font-semibold text-sm">Mi Perfil</p>
        </div>
        <div className="bg-white py-8 px-8 gap-2 grid grid-cols-3 rounded-xl max-md:grid-cols-2 max-md:gap-8">
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Usuario{" "}
            <span className="font-semibold text-slate-400">
              {user.username}
            </span>
          </p>
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Nombre y Apellido{" "}
            <span className="font-semibold text-slate-400 capitalize">
              {user.nombre} {user.apellido}
            </span>
          </p>
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Email{" "}
            <span className="font-semibold text-slate-400">{user.email}</span>
          </p>
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Fabrica/suc{" "}
            <span className="font-semibold text-slate-400 capitalize">
              {user.fabrica}
            </span>
          </p>
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Puesto/Sector{" "}
            <span className="font-semibold text-slate-400 capitalize">
              {user.puesto_sector}
            </span>
          </p>
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Localidad{" "}
            <span className="font-semibold text-slate-400 capitalize">
              {user.localidad}
            </span>
          </p>
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Provincia{" "}
            <span className="font-semibold text-slate-400 capitalize">
              {user.provincia}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl w-1/2 mx-auto mt-5 max-md:mx-5 max-md:w-auto">
        <div className="bg-gray-100 py-8 px-5 rounded-t-xl">
          <p className="text-blue-500 font-semibold text-sm">Seguridad</p>
        </div>
        <div className="bg-white py-8 px-8  rounded-xl flex justify-between">
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Contraseña
            <span className="font-semibold text-slate-400">
              {"***************"}
            </span>
          </p>

          <div>
            <div>
              <p className="text-gray-400 font-semibold text-sm mb-2">
                Última modificación: Hace un año
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="border-[1px] border-blue-700 py-2 px-5 rounded-full text-blue-700 font-bold text-sm shadow"
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalCargarImagen closeModal={closeModalImagen} isOpen={isOpenImagen} />
    </section>
  );
};
