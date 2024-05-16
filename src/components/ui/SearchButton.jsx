import React from "react";
import { CiSearch } from "react-icons/ci";

export const SearchButton = ({ open }) => {
  return (
    <div
      onClick={open}
      className="fixed right-5 top-[50%] bg-blue-500 py-2 rounded-full px-2 cursor-pointer"
    >
      <CiSearch className="text-white text-2xl" />
    </div>
  );
};
