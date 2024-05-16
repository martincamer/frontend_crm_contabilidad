import React from "react";

export const Navegacion = ({ children }) => {
  return (
    <nav className="bg-white flex justify-between items-center h-full">
      {children}
    </nav>
  );
};
