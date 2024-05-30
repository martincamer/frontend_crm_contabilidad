import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { RxHamburgerMenu } from "react-icons/rx";

export function Navbar() {
  const { isAuthenticated, logout, user, handleToggle } = useAuth();

  return (
    <header
      className={`${
        isAuthenticated ? "bg-blue-500 shadow-sm" : "bg-white py-3 hidden"
      } z-[-100]`}
    >
      <nav className="flex justify-between items-center py-1 px-10">
        <div className="text-xl font-semibold flex gap-8 items-center">
          <div>
            <RxHamburgerMenu
              onClick={() => handleToggle()}
              className="text-white text-[28px] hover:text-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <ul className="flex gap-x-4 z-[1000]">
          {isAuthenticated ? (
            <div className="flex justify-between items-center gap-36 w-full">
              <div className="dropdown dropdown-end z-[999]">
                <div tabIndex={0} role="button">
                  <div className="w-12">
                    {user?.imagen ? (
                      <img src={user?.imagen} className="rounded-full" />
                    ) : (
                      <div className="rounded-xl py-4 my-0.5 px-6 bg-gray-200 text-[10px] font-bold flex justify-center">
                        User
                      </div>
                    )}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-60 cursor-pointer"
                >
                  <div className="py-2 px-2">
                    {user.imagen ? (
                      <img
                        className="rounded-full w-28 mx-auto"
                        src={user.imagen}
                        alt=""
                      />
                    ) : (
                      <Link
                        to={"/perfil"}
                        className="rounded-xl w-16 mx-auto py-5 px-6 bg-gray-200 text-[10px] font-bold flex justify-center"
                      >
                        User
                      </Link>
                    )}
                    <div className="py-2 ">
                      <p className="font-semibold text-blue-400 capitalize text-center">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="font-semibold text-gray-500 text-xs capitalize text-center">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <li className="mb-1">
                    <Link
                      to={"/perfil"}
                      className="justify-between hover:bg-blue-600 py-2 transition-all hover:text-white font-semibold"
                    >
                      Perfil
                      <span className="badge">Nuevo</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => logout()}
                      type="button"
                      className="justify-between hover:bg-blue-600 py-2 transition-all hover:text-white font-semibold"
                    >
                      Salir de la aplicación
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <li>
                <Link
                  className="font-semibold text-white bg-blue-600 py-2 px-6 rounded-full text-sm hover:shadow-md  transition-all"
                  to="/login"
                >
                  Iniciar Sesion
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
