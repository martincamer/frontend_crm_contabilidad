import { useState, useEffect } from "react";

const useLoading = (duration = 3000) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return loading;
};

export default useLoading;
