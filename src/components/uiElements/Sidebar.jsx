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
        isOpen ? "w-64 opacity-1 border-r border-gray-300" : "w-0 opacity-0"
      } transition-all ease-linear flex flex-col bg-white min-h-screen max-h-full h-full `}
    >
      <div className="flex flex-col gap-5 py-5 px-6">
        <Link
          className={`flex gap-2 ${
            location.pathname === "/home" ? "text-blue-600" : "text-gray-700"
          } font-bold items-center text-base`}
          to={"/home"}
        >
          <BsClipboardData /> Analisis
        </Link>

        <Disclosure>
          <Disclosure.Button className="">
            <button
              type="button"
              className={`flex gap-2 ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-700"
              } font-bold items-center text-base hover:text-blue-600`}
              // to={"/home"}
            >
              <FaFileAlt /> Facturación
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
                  to="/crear-factura"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Crear nueva factura
                </Link>

                <Link
                  to="/crear-gasto"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Crear nuevo gastó
                </Link>

                <Link
                  to="/crear-ingreso"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Crear nuevo ingreso/cuota/etc.
                </Link>

                <Link
                  to="/gastos"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Gastós
                </Link>

                <Link
                  to="/ingresos"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Ingresos
                </Link>

                <Link
                  to="/facturas"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Facturas
                </Link>

                <Link
                  to="/pedidos-venta"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Pedidos de venta
                </Link>

                <Link
                  to="/pedidos-compra"
                  className="text-sm font-bold hover:text-blue-600"
                >
                  Pedidos de compra
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
              <GiCash className="text-xl" /> Cajas
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
        </Disclosure>

        <Disclosure>
          <Disclosure.Button className="">
            <button
              type="button"
              className={`flex gap-2 ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-700"
              } font-bold items-center text-base hover:text-blue-600`}
            >
              <MdOutlinePersonPin className="text-xl" /> Empleados
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
                  to="/empleados"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Empleados
                </Link>
                <Link
                  to="/crear-empleado"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Crear nuevo empleado
                </Link>
                <Link
                  to="/comprobantes"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Comprobantes
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
              <TbUserFilled className="text-xl" /> Clientes
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
                  to="/cliente"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Crear nuevo cliente
                </Link>
                <Link
                  to="/clientes"
                  className="text-sm font-bold hover:text-blue-600 capitalize"
                >
                  Clientes
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
                  to="/caja"
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
        </Disclosure>
      </div>
    </div>
  );
};
