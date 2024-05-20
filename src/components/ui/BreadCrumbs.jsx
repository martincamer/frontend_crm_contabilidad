import React from "react";

export const BreadCrumbs = ({ children }) => {
  return (
    <div className="text-sm breadcrumbs px-5">
      <ul>{children}</ul>
    </div>
  );
};
