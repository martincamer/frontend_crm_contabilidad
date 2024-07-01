import axios from "./axios";

export const getBancosChequesRequest = async () => {
  return await axios.get("/bancos-cheques");
};

export const getBancoChequesRequest = async (id) => {
  return await axios.get(`/bancos-cheques/${id}`);
};

export const createBancoChequesRequest = async (bancoCheques) => {
  return await axios.post("/bancos-cheques", bancoCheques);
};

export const deleteBancoChequesRequest = async (id) => {
  return await axios.delete(`/bancos-cheques/${id}`);
};
export const deleteBancoChequeRequest = async (id) => {
  return await axios.delete(`/eliminar-cheque/${id}`);
};

export const updateBancoChequesRequest = async (id, bancoCheques) => {
  return await axios.put(`/bancos-cheques/${id}`, bancoCheques);
};

export const agregarChequeRequest = async (cheque) => {
  return await axios.post(`/cheques`, cheque);
};
