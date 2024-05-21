import React, { createContext, useContext, useState } from "react";
import {
  getIngresosRequest,
  getIngresoRequest,
  createIngresoRequest,
  deleteIngresoRequest,
  updateIngresoRequest,
  updateIngresoEstadoRequest,
} from "../api/ingresos"; // Importa las funciones API de ingresos
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showSuccessToastError } from "../helpers/toast";

const IngresoContext = createContext();

export const useIngreso = () => {
  const context = useContext(IngresoContext);
  if (!context) {
    throw new Error("Error al usar el contexto de ingreso");
  }
  return context;
};

export function IngresoProvider({ children }) {
  const [ingresos, setIngresos] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getIngresos = async () => {
    try {
      const res = await getIngresosRequest();
      setIngresos(res.data);
    } catch (error) {
      console.error("Error al obtener ingresos:", error);
      setError("Error al obtener ingresos");
    }
  };

  const getIngreso = async (id) => {
    try {
      const res = await getIngresoRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener ingreso:", error);
    }
  };

  const deleteIngreso = async (id) => {
    try {
      const res = await deleteIngresoRequest(id);
      if (res.status === 204) {
        setIngresos(ingresos.filter((ingreso) => ingreso._id !== id));
        showSuccessToastError("Ingreso eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar ingreso:", error);
      setError("Error al eliminar ingreso");
    }
  };

  const createIngreso = async (ingreso) => {
    try {
      const res = await createIngresoRequest(ingreso);
      const nuevoIngreso = res.data;

      setIngresos([...ingresos, nuevoIngreso]);

      showSuccessToast("Ingreso creado correctamente");
      navigate("/ingresos");
    } catch (error) {
      console.error("Error al crear ingreso:", error);
      setError("Error al crear ingreso");
    }
  };

  const updateIngreso = async (id, ingreso) => {
    try {
      const res = await updateIngresoRequest(id, ingreso);
      const ingresosActualizados = ingresos.map((i) =>
        i._id === id ? res.data : i
      );
      setIngresos(ingresosActualizados);
      showSuccessToast("Ingreso editado correctamente");
      // navigate('/ingresos');
    } catch (error) {
      console.error("Error al editar ingreso:", error);
      setError("Error al editar ingreso");
    }
  };

  const updateIngresoEstado = async (id, ingreso) => {
    try {
      const res = await updateIngresoEstadoRequest(id, ingreso);
      const ingresosActualizados = ingresos.map((i) =>
        i._id === id ? res.data : i
      );
      setIngresos(ingresosActualizados);
      showSuccessToast("Ingreso editado correctamente");
      // navigate('/ingresos');
    } catch (error) {
      console.error("Error al editar ingreso:", error);
      setError("Error al editar ingreso");
    }
  };

  return (
    <IngresoContext.Provider
      value={{
        ingresos,
        error,
        getIngreso,
        getIngresos,
        deleteIngreso,
        createIngreso,
        updateIngreso,
        updateIngresoEstado,
      }}
    >
      {children}
    </IngresoContext.Provider>
  );
}
