import React, { createContext, useContext, useState } from "react";
import {
  getEmpleadosRequest,
  getEmpleadoRequest,
  createEmpleadoRequest,
  deleteEmpleadoRequest,
  updateEmpleadoRequest,
  createReciboRequest,
  updateEmpleadoEstadoRequest,
  createEmpleadoDatosRequest,
  aumentarSueldoRequest,
  getFabricasRequest,
  getSectoresRequest,
  createSectorRequest,
  createFabricaRequest,
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
  const [empleadosDatos, setEmpleadosDatos] = useState([]);
  const [recibo, setRecibo] = useState([]);
  const [fabricas, setFabricas] = useState([]);
  const [sectores, setSectores] = useState([]);
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
    } catch (error) {}
  };

  const deleteEmpleado = async (id) => {
    try {
      const res = await deleteEmpleadoRequest(id);
      if (res.status === 204) {
        setEmpleados(empleados.filter((empleado) => empleado._id !== id));
        showSuccessToast("Empleado eliminado correctamente");
      }
    } catch (error) {
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

  const aumentarSueldo = async (data) => {
    try {
      const empleadosActualizados = await aumentarSueldoRequest(data);

      console.log(empleadosActualizados);

      // Actualiza el estado de empleados si es necesario
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map(
          (empleado) =>
            empleadosActualizados.data.find((e) => e._id === empleado._id) ||
            empleado
        )
      );

      // console.log("Respuesta del servidor:", empleadosActualizados);

      showSuccessToast("Aumento de sueldo aplicado correctamente");
    } catch (error) {
      console.error("Error al aumentar el sueldo:", error);
      setError("Error al aumentar el sueldo");
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

  const updateEmpleadoEstado = async (id, empleado) => {
    try {
      const res = await updateEmpleadoEstadoRequest(id, empleado);
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
      // showSuccessToast("Recibo creado correctamente");
    } catch (error) {
      console.error("Error al crear empleado:", error);
      setError("Error al crear empleado");
    }
  };

  const createEmpleadoDatos = async (empleado) => {
    try {
      const res = await createEmpleadoDatosRequest(empleado);
      const nuevosDatos = res.data;

      setEmpleadosDatos([...empleadosDatos, nuevosDatos]);

      showSuccessToast(
        "Datos guardados correctamente, no guardes dos veces el mismo mes.."
      );
    } catch (error) {
      console.error("Error al crear empleado:", error);
      setError("Error al crear empleado");
      console.log(error);
    }
  };

  const getFabricas = async () => {
    try {
      const res = await getFabricasRequest();
      setFabricas(res.data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      setError("Error al obtener empleados");
    }
  };

  const getSectores = async () => {
    try {
      const res = await getSectoresRequest();
      setSectores(res.data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      setError("Error al obtener empleados");
    }
  };

  const createSectores = async (sector) => {
    try {
      const res = await createSectorRequest(sector);
      const nuevoSector = res.data;

      setSectores([...sectores, nuevoSector]);

      showSuccessToast("Sector creado correctamente");
    } catch (error) {
      console.error("Error al crear empleado:", error);
      setError("Error al crear empleado");
    }
  };

  const createFabricas = async (fabrica) => {
    try {
      const res = await createFabricaRequest(fabrica);
      const nuevaFabrica = res.data;

      setFabricas([...empleados, nuevaFabrica]);

      showSuccessToast("Fabrica creada correctamente");
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
        updateEmpleadoEstado,
        createEmpleadoDatos,
        recibo,
        aumentarSueldo,
        fabricas,
        getFabricas,
        getSectores,
        sectores,
        createSectores,
        createFabricas,
      }}
    >
      {children}
    </EmpleadoContext.Provider>
  );
}
