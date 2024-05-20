import React, { createContext, useContext, useState } from "react";
import {
  getGastosRequest,
  getGastoRequest,
  createGastoRequest,
  deleteGastoRequest,
  updateGastoRequest,
  updateGastoEstadoRequest,
} from "../api/gasto"; // Asegúrate de importar las funciones API correctas
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../helpers/toast";

const GastoContext = createContext();

export const useGasto = () => {
  const context = useContext(GastoContext);
  if (!context) {
    throw new Error("Error al usar el contexto de gasto");
  }
  return context;
};

export function GastoProvider({ children }) {
  const [gastos, setGastos] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getGastos = async () => {
    try {
      const res = await getGastosRequest();
      setGastos(res.data);
    } catch (error) {
      console.error("Error al obtener gastos:", error);
      setError("Error al obtener gastos");
    }
  };

  const getGasto = async (id) => {
    try {
      const res = await getGastoRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener gasto:", error);
    }
  };

  const deleteGasto = async (id) => {
    try {
      const res = await deleteGastoRequest(id);
      if (res.status === 204) {
        setGastos(gastos.filter((gasto) => gasto._id !== id));
        toast.success("Gasto eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
      setError("Error al eliminar gasto");
    }
  };

  const createGasto = async (gasto) => {
    try {
      const res = await createGastoRequest(gasto);
      const nuevoGasto = res.data;

      setGastos([...gastos, nuevoGasto]);

      showSuccessToast("Gasto creado correctamente");
      navigate("/gastos");
    } catch (error) {
      console.error("Error al crear gasto:", error);
      setError("Error al crear gasto");
    }
  };

  const updateGasto = async (id, gasto) => {
    try {
      const res = await updateGastoRequest(id, gasto);
      const gastosActualizados = gastos.map((g) =>
        g._id === id ? res.data : g
      );
      setGastos(gastosActualizados);
      showSuccessToast("Gasto editado correctamente");
      // navigate('/gastos');
    } catch (error) {
      console.error("Error al editar gasto:", error);
      setError("Error al editar gasto");
    }
  };

  const updateGastoEstado = async (id, gasto) => {
    try {
      const res = await updateGastoEstadoRequest(id, gasto);
      const gastosActualizados = gastos.map((g) =>
        g._id === id ? res.data : g
      );
      setGastos(gastosActualizados);
      showSuccessToast("Gasto editado correctamente");
      // navigate('/gastos');
    } catch (error) {
      console.error("Error al editar gasto:", error);
      setError("Error al editar gasto");
    }
  };

  return (
    <GastoContext.Provider
      value={{
        gastos,
        error,
        getGasto,
        getGastos,
        deleteGasto,
        createGasto,
        updateGasto,
        updateGastoEstado,
      }}
    >
      {children}
    </GastoContext.Provider>
  );
}
