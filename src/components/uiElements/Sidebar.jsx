import React from "react";
import { useAuth } from "../../context/authContext";
import { Link, useLocation } from "react-router-dom";
import { MdEvStation, MdLocalOffer, MdOutlinePersonPin } from "react-icons/md";
import { FaDatabase, FaMoneyBillWave } from "react-icons/fa";

export const SideBar = () => {
  const { isOpen } = useAuth();

  const location = useLocation();

  return (
    <div
      className={`${
        !isOpen ? "w-64 opacity-1 shadow-lg" : "w-0 opacity-0"
      } transition-all ease-linear flex flex-col bg-white min-h-screen max-h-full h-full max-md:fixed max-md:z-[999]`}
    >
      <div className="flex flex-col gap-5 py-5 px-6">
        <button
          type="button"
          className={`flex gap-2 ${
            location.pathname === "/presupuesto"
              ? "text-blue-600"
              : "text-gray-700"
          } font-bold items-center text-base hover:text-blue-600`}
        >
          <FaDatabase className="text-xl" />{" "}
          <Link to={"/presupuesto"}>Presupuesto</Link>
        </button>
        <button
          type="button"
          className={`flex gap-2 ${
            location.pathname === "/bancos" ? "text-blue-600" : "text-gray-700"
          } font-bold items-center text-base hover:text-blue-600`}
        >
          <FaMoneyBillWave className="text-xl" />{" "}
          <Link to={"/bancos"}>Bancos/Cheques</Link>
        </button>
        <button
          type="button"
          className={`flex gap-2 max-md:hidden ${
            location.pathname === "/" ? "text-blue-600" : "text-gray-700"
          } font-bold items-center text-base hover:text-blue-600`}
        >
          <MdOutlinePersonPin className="text-xl" />{" "}
          <Link to={"/empleados"}>Empleados</Link>
        </button>
        <button
          type="button"
          className={`flex gap-2 md:hidden ${
            location.pathname === "/empleados-mobile"
              ? "text-blue-600"
              : "text-gray-700"
          } font-bold items-center text-base hover:text-blue-600`}
        >
          <MdOutlinePersonPin className="text-xl" />{" "}
          <Link to={"/empleados-mobile"}>Empleados</Link>
        </button>
        <button
          type="button"
          className={`flex gap-2 max-md:hidden ${
            location.pathname === "/" ? "text-blue-600" : "text-gray-700"
          } font-bold items-center text-base hover:text-blue-600`}
        >
          <MdLocalOffer className="text-xl" />{" "}
          <Link to={"/empleados-aguinaldo"}>Empleados aguinaldo</Link>
        </button>
        <button
          type="button"
          className={`flex gap-2 md:hidden ${
            location.pathname === "/" ? "text-blue-600" : "text-gray-700"
          } font-bold items-center text-base hover:text-blue-600`}
        >
          <MdLocalOffer className="text-xl" />{" "}
          <Link to={"/empleados-aguinaldo-mobile"}>Empleados aguinaldo</Link>
        </button>
      </div>
    </div>
  );
};
