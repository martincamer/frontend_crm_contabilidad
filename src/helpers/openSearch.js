import { useState } from "react";

export const useSearch = () => {
  const [click, setClick] = useState(false);

  const openSearch = () => setClick(!click);

  return { click, openSearch };
};
