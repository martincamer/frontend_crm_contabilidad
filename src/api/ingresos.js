import axios from "./axios"; // Asegúrate de importar tu configuración de axios correctamente

export const getIngresosRequest = async () => axios.get("/ingresos");

export const getIngresoRequest = async (id) => axios.get(`/ingresos/${id}`);

export const createIngresoRequest = async (ingreso) =>
  axios.post("/ingresos", ingreso);

export const updateIngresoRequest = async (id, ingreso) =>
  axios.put(`/ingresos/${id}`, ingreso);

export const deleteIngresoRequest = async (id) =>
  axios.delete(`/ingresos/${id}`);

export const updateIngresoEstadoRequest = async (id, ingreso) =>
  axios.put(`/ingresos/${id}/estado`, ingreso);
