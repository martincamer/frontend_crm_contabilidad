import axios from "./axios";

export const getEstadisticasRequest = async () => axios.get("/estadisticas");

export const createEstadisticaRequest = async (estadistica) =>
  axios.post("/estadisticas", estadistica);

export const updateEstadisticaRequest = async (id, estadistica) =>
  axios.put(`/estadisticas/${id}`, estadistica);

export const deleteEstadisticaRequest = async (id) =>
  axios.delete(`/estadisticas/${id}`);

export const getEstadisticaRequest = async (id) =>
  axios.get(`/estadisticas/${id}`);
