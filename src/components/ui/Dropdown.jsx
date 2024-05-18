import React from "react";
import { CgMenuRightAlt } from "react-icons/cg";

export const Dropdown = ({ children }) => {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="bg-gray-100 py-2 px-2 rounded-full text-sm hover:bg-gray-200 hover:text-gray-900 transition-all outline-none"
      >
        <CgMenuRightAlt />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[105] shadow-xl border border-gray-200 py-5 px-5 rounded-none bg-base-100 w-52 cursor-pointer flex flex-col gap-2 mt-2"
      >
        {children}
      </ul>
    </div>
  );
};
