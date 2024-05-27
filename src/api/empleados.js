import axios from "./axios"; // Asegúrate de importar tu configuración de axios correctamente

export const getEmpleadosRequest = async () => axios.get("/empleados");

export const getEmpleadoRequest = async (id) => axios.get(`/empleados/${id}`);

export const createEmpleadoRequest = async (empleado) =>
  axios.post("/empleados", empleado);

export const updateEmpleadoRequest = async (id, empleado) =>
  axios.put(`/empleados/${id}`, empleado);

export const updateEmpleadoEstadoRequest = async (id, empleado) =>
  axios.patch(`/empleados/estado/${id}`, empleado);

export const createReciboRequest = async (id, recibo) =>
  axios.post(`/${id}/recibo`, recibo);

export const deleteEmpleadoRequest = async (id) =>
  axios.delete(`/empleados/${id}`);
