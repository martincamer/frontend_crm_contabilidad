import axios from "./axios";

export const getCajasRequest = async () => {
  return await axios.get("/cajas");
};

export const getCajaRequest = async (id) => {
  return await axios.get(`/cajas/${id}`);
};

export const createCajaRequest = async (caja) => {
  return await axios.post("/cajas", caja);
};

export const deleteCajaRequest = async (id) => {
  return await axios.delete(`/cajas/${id}`);
};

export const updateCajaRequest = async (id, caja) => {
  return await axios.put(`/cajas/${id}`, caja);
};
