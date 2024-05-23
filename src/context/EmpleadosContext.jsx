import React, { createContext, useContext, useState } from "react";
import {
  getEmpleadosRequest,
  getEmpleadoRequest,
  createEmpleadoRequest,
  deleteEmpleadoRequest,
  updateEmpleadoRequest,
  createReciboRequest,
} from "../api/empleados"; // Asegúrate de importar las funciones API correctas
import { showSuccessToast } from "../helpers/toast";

const EmpleadoContext = createContext();

export const useEmpleado = () => {
  const context = useContext(EmpleadoContext);
  if (!context) {
    throw new Error("Error al usar el contexto de empleado");
  }
  return context;
};

export function EmpleadoProvider({ children }) {
  const [empleados, setEmpleados] = useState([]);
  const [recibo, setRecibo] = useState([]);
  const [error, setError] = useState("");

  const getEmpleados = async () => {
    try {
      const res = await getEmpleadosRequest();
      setEmpleados(res.data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      setError("Error al obtener empleados");
    }
  };

  const getEmpleado = async (id) => {
    try {
      const res = await getEmpleadoRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener empleado:", error);
    }
  };

  const deleteEmpleado = async (id) => {
    try {
      const res = await deleteEmpleadoRequest(id);
      if (res.status === 204) {
        setEmpleados(empleados.filter((empleado) => empleado._id !== id));
        showSuccessToast("Empleado eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      setError("Error al eliminar empleado");
    }
  };

  const createEmpleado = async (empleado) => {
    try {
      const res = await createEmpleadoRequest(empleado);
      const nuevoEmpleado = res.data;

      setEmpleados([...empleados, nuevoEmpleado]);

      showSuccessToast("Empleado creado correctamente");
    } catch (error) {
      console.error("Error al crear empleado:", error);
      setError("Error al crear empleado");
    }
  };

  const updateEmpleado = async (id, empleado) => {
    try {
      const res = await updateEmpleadoRequest(id, empleado);
      const empleadosActualizados = empleados.map((e) =>
        e._id === id ? res.data : e
      );
      setEmpleados(empleadosActualizados);
      showSuccessToast("Empleado editado correctamente");
    } catch (error) {
      console.error("Error al editar empleado:", error);
      setError("Error al editar empleado");
    }
  };

  const crearRecibo = async (id, recibo) => {
    try {
      const res = await createReciboRequest(id, recibo);

      setRecibo(res.data);
      console.log("recibo", recibo);
      showSuccessToast("Recibo creado correctamente");
    } catch (error) {
      console.error("Error al crear empleado:", error);
      setError("Error al crear empleado");
    }
  };

  return (
    <EmpleadoContext.Provider
      value={{
        empleados,
        error,
        getEmpleado,
        getEmpleados,
        deleteEmpleado,
        createEmpleado,
        updateEmpleado,
        crearRecibo,
        recibo,
      }}
    >
      {children}
    </EmpleadoContext.Provider>
  );
}
