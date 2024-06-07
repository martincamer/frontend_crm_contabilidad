import React, { createContext, useContext, useState } from "react";
import {
  getEstadisticasRequest,
  createEstadisticaRequest,
  deleteEstadisticaRequest,
  updateEstadisticaRequest,
} from "../api/estadistica";
import { showSuccessToast } from "../helpers/toast";

const EstadisticaContext = createContext();

export const useEstadistica = () => {
  const context = useContext(EstadisticaContext);
  if (!context) {
    throw new Error("Error al usar el contexto de estadística");
  }
  return context;
};

export function EstadisticaProvider({ children }) {
  const [estadisticas, setEstadisticas] = useState([]);
  const [error, setError] = useState("");

  const getEstadisticas = async () => {
    try {
      const res = await getEstadisticasRequest();
      setEstadisticas(res.data);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      setError("Error al obtener estadísticas");
    }
  };

  const createEstadistica = async (estadistica) => {
    try {
      const res = await createEstadisticaRequest(estadistica);
      const nuevaEstadistica = res.data;
      setEstadisticas([...estadisticas, nuevaEstadistica]);
      showSuccessToast("Estadística creada correctamente");
    } catch (error) {
      console.error("Error al crear estadística:", error);
      setError("Error al crear estadística");
    }
  };

  const deleteEstadistica = async (id) => {
    try {
      const res = await deleteEstadisticaRequest(id);
      if (res.status === 204) {
        setEstadisticas(estadisticas.filter((stat) => stat._id !== id));
        showSuccessToast("Estadística eliminada correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar estadística:", error);
      setError("Error al eliminar estadística");
    }
  };

  const updateEstadistica = async (id, estadistica) => {
    try {
      const res = await updateEstadisticaRequest(id, estadistica);
      const estadisticasActualizadas = estadisticas.map((stat) =>
        stat._id === id ? res.data : stat
      );
      setEstadisticas(estadisticasActualizadas);
      showSuccessToast("Estadística actualizada correctamente");
    } catch (error) {
      console.error("Error al editar estadística:", error);
      setError("Error al editar estadística");
    }
  };

  return (
    <EstadisticaContext.Provider
      value={{
        estadisticas,
        error,
        getEstadisticas,
        createEstadistica,
        deleteEstadistica,
        updateEstadistica,
      }}
    >
      {children}
    </EstadisticaContext.Provider>
  );
}
