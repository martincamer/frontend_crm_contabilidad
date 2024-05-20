import axios from "./axios"; // Asegúrate de importar tu configuración de axios correctamente

export const getGastosRequest = async () => axios.get("/gastos");

export const getGastoRequest = async (id) => axios.get(`/gastos/${id}`);

export const createGastoRequest = async (gasto) => axios.post("/gastos", gasto);

export const updateGastoRequest = async (id, gasto) =>
  axios.put(`/gastos/${id}`, gasto);

export const deleteGastoRequest = async (id) => axios.delete(`/gastos/${id}`);

export const updateGastoEstadoRequest = async (id, gasto) =>
  axios.put(`/gastos/${id}/estado`, gasto);
