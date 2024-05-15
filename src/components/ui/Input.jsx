import { forwardRef } from "react";

export const Input = forwardRef((props, ref, styles) => (
  <input
    {...props}
    ref={ref}
    className={
      "text-sm w-full bg-gray-200/90 placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 rounded-xl focus:outline-violet-500 transition-all"
    }
  />
));
