import React from "react";
import { Link } from "react-router-dom";

export const NavegacionLink = ({ link, children, estilos }) => {
  return (
    <div className={`${estilos}`}>
      <Link to={`${link}`}>{children}</Link>
    </div>
  );
};
