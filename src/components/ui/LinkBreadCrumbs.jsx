import React from "react";
import { Link } from "react-router-dom";

export const LinkBreadCrumbs = ({ children, link }) => {
  return (
    <li className="font-bold text-blue-500">
      <Link to={`/${link}`}>{children}</Link>
    </li>
  );
};
