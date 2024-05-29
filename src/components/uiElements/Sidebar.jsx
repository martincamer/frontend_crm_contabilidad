import React from "react";
import { useAuth } from "../../context/authContext";
import { Link, useLocation } from "react-router-dom";
import { BsClipboardData } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { PiSuitcaseSimpleLight } from "react-icons/pi";
import { TbUserFilled } from "react-icons/tb";
import { MdOutlinePersonPin } from "react-icons/md";
import { Disclosure, Transition } from "@headlessui/react";

export const SideBar = () => {
  const { user, isOpen } = useAuth();

  const location = useLocation();

  return (
    <div
      className={`${
        isOpen ? "w-64 opacity-1 shadow-lg" : "w-0 opacity-0"
      } transition-all ease-linear flex flex-col bg-white min-h-screen max-h-full h-full `}
    >
      <div className="flex flex-col gap-5 py-5 px-6">
        {/* <Link
          className={`flex gap-2 ${
            location.pathname === "/home" ? "text-blue-600" : "text-gray-700"
          } font-bold items-center text-base`}
          to={"/home"}
        >
          <BsClipboardData /> Analisis/estadisticas
        </Link> */}

        {/* <Disclosure>
          <Disclosure.Button className="">
            <button
              type="button"
              className={`flex gap-2 ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-700"
              } font-bold items-center text-base hover:text-blue-600`}
              // to={"/home"}
            >
              <FaFileAlt /> Acciones
            </button>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform translateY(-10%) opacity-0"
            enterTo="transform translateY(0%) opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform translateY(0%) opacity-100"
            leaveTo="transform translateY(-10%) opacity-0"
          >
            {" "}
            <Disclosure.Panel className="text-gray-500">
              <ul className="flex flex-col gap-2">
                <Link
                  to="/gastos"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Gastos
                </Link>

                <Link
                  to="/ingresos"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Ingresos
                </Link>

                <Link
                  to="/crear-factura"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Crear nueva orden de compra
                </Link>

                <Link
                  to="/crear-factura"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Crear una nota de credito
                </Link>
                <Link
                  to="/crear-factura"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Crear una nota de debito
                </Link>
              </ul>
            </Disclosure.Panel>
          </Transition>
        </Disclosure>

        <Disclosure>
          <Disclosure.Button className="">
            <button
              type="button"
              className={`flex gap-2 ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-700"
              } font-bold items-center text-base hover:text-blue-600`}
              // to={"/home"}
            >
              <TbUserFilled className="text-xl" /> Clientes/Contratos
            </button>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform translateY(-10%) opacity-0"
            enterTo="transform translateY(0%) opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform translateY(0%) opacity-100"
            leaveTo="transform translateY(-10%) opacity-0"
          >
            {" "}
            <Disclosure.Panel className="text-gray-500">
              <ul className="flex flex-col gap-2">
                <Link
                  to="/clientes"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Clientes/contratos
                </Link>
              </ul>
            </Disclosure.Panel>
          </Transition>
        </Disclosure>

        <Disclosure>
          <Disclosure.Button className="">
            <button
              type="button"
              className={`flex gap-2 ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-700"
              } font-bold items-center text-base hover:text-blue-600`}
            >
              <GiCash className="text-xl" /> Caja/Banco
            </button>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform translateY(-10%) opacity-0"
            enterTo="transform translateY(0%) opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform translateY(0%) opacity-100"
            leaveTo="transform translateY(-10%) opacity-0"
          >
            {" "}
            <Disclosure.Panel className="text-gray-500">
              <ul className="flex flex-col gap-2">
                <Link
                  to="/caja"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Caja {user.fabrica}
                </Link>
                <Link
                  to="/banco"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Banco {user.fabrica}
                </Link>
              </ul>
            </Disclosure.Panel>
          </Transition>
        </Disclosure> */}
        <button
          type="button"
          className={`flex gap-2 ${
            location.pathname === "/" ? "text-blue-600" : "text-gray-700"
          } font-bold items-center text-base hover:text-blue-600`}
        >
          <MdOutlinePersonPin className="text-xl" />{" "}
          <Link to={"/empleados"}>Empleados</Link>
        </button>
        {/* <Disclosure>
          <Disclosure.Button className=""></Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform translateY(-10%) opacity-0"
            enterTo="transform translateY(0%) opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform translateY(0%) opacity-100"
            leaveTo="transform translateY(-10%) opacity-0"
          >
            {" "}
            <Disclosure.Panel className="text-gray-500">
              <ul className="flex flex-col gap-2">
                <Link
                  to="/empleados"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Empleados
                </Link>
              </ul>
            </Disclosure.Panel>
          </Transition>
        </Disclosure> */}

        {/* <Disclosure>
          <Disclosure.Button className="">
            <button
              type="button"
              className={`flex gap-2 ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-700"
              } font-bold items-center text-base hover:text-blue-600`}
            >
              <PiSuitcaseSimpleLight className="text-xl" /> Proyectos
            </button>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform translateY(-10%) opacity-0"
            enterTo="transform translateY(0%) opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform translateY(0%) opacity-100"
            leaveTo="transform translateY(-10%) opacity-0"
          >
            {" "}
            <Disclosure.Panel className="text-gray-500">
              <ul className="flex flex-col gap-2">
                <Link
                  to="/pruebas-comprobantes"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Caja {user.localidad}
                </Link>
                <Link
                  to="/caja"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Banco {user.localidad}
                </Link>
              </ul>
            </Disclosure.Panel>
          </Transition>
        </Disclosure> */}
      </div>
    </div>
  );
};
