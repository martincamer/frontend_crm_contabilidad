import { Link } from "react-router-dom";

export const ButtonLink = ({ to, children }) => (
  <Link
    to={to}
    className="bg-violet-100 hover:shadow transition-all ease-linear px-4 py-2 text-violet-500 rounded-xl hover:bg-violet-500/80 hover:text-white flex items-center gap-2"
  >
    {children}
  </Link>
);
