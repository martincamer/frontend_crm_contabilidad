import React, { forwardRef } from "react";

export const Select = forwardRef((props, ref) => {
  // Separa la clase del resto de props para evitar duplicados.
  const { className, ...rest } = props;

  return (
    <select
      ref={ref}
      className={
        "uppercase text-sm w-full bg-white border-slate-200 border-[1px] text-slate-900 px-4 py-3 rounded-xl shadow " +
        (className || "")
      }
      {...rest} // Solo usa `...props` una vez
    >
      {props.children} // Inserta `children` donde correspondan.
    </select>
  );
});
