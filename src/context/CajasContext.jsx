import React, { createContext, useContext, useState } from "react";
import {
  getCajasRequest,
  getCajaRequest,
  createCajaRequest,
  deleteCajaRequest,
  updateCajaRequest,
} from "../api/caja"; // Asegúrate de importar las funciones API correctas
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showSuccessToastError } from "../helpers/toast";

const CajaContext = createContext();

export const useCaja = () => {
  const context = useContext(CajaContext);
  if (!context) {
    throw new Error("Error al usar el contexto de caja");
  }
  return context;
};

export function CajaProvider({ children }) {
  const [cajas, setCajas] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getCajas = async () => {
    try {
      const res = await getCajasRequest();
      setCajas(res.data);
    } catch (error) {
      console.error("Error al obtener cajas:", error);
      setError("Error al obtener cajas");
    }
  };

  const getCaja = async (id) => {
    try {
      const res = await getCajaRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener caja:", error);
    }
  };

  const deleteCaja = async (id) => {
    try {
      const res = await deleteCajaRequest(id);
      if (res.status === 204) {
        setCajas(cajas.filter((caja) => caja._id !== id));
        showSuccessToastError("Caja eliminada correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar caja:", error);
      setError("Error al eliminar caja");
    }
  };

  const createCaja = async (caja) => {
    try {
      const res = await createCajaRequest(caja);
      const nuevaCaja = res.data;

      setCajas([...cajas, nuevaCaja]);

      showSuccessToast("Caja creada correctamente");
      navigate("/cajas");
    } catch (error) {
      console.error("Error al crear caja:", error);
      setError("Error al crear caja");
    }
  };

  const updateCaja = async (id, caja) => {
    try {
      const res = await updateCajaRequest(id, caja);
      const cajasActualizadas = cajas.map((c) => (c._id === id ? res.data : c));
      setCajas(cajasActualizadas);
      showSuccessToast("Caja editada correctamente");
      // navigate('/cajas');
    } catch (error) {
      console.error("Error al editar caja:", error);
      setError("Error al editar caja");
    }
  };

  return (
    <CajaContext.Provider
      value={{
        cajas,
        error,
        getCaja,
        getCajas,
        deleteCaja,
        createCaja,
        updateCaja,
      }}
    >
      {children}
    </CajaContext.Provider>
  );
}
