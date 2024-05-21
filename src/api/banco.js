import axios from "./axios";

export const getBancosRequest = async () => {
  return await axios.get("/bancos");
};

export const getBancoRequest = async (id) => {
  return await axios.get(`/bancos/${id}`);
};

export const createBancoRequest = async (banco) => {
  return await axios.post("/bancos", banco);
};

export const deleteBancoRequest = async (id) => {
  return await axios.delete(`/bancos/${id}`);
};

export const updateBancoRequest = async (id, banco) => {
  return await axios.put(`/bancos/${id}`, banco);
};
