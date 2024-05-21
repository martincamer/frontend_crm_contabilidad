import axios from "./axios"; // Asegúrate de importar tu configuración de axios correctamente

export const getClientesRequest = async () => axios.get("/clientes");

export const getClienteRequest = async (id) => axios.get(`/clientes/${id}`);

export const createClienteRequest = async (cliente) =>
  axios.post("/clientes", cliente);

export const updateClienteRequest = async (id, cliente) =>
  axios.put(`/clientes/${id}`, cliente);

export const deleteClienteRequest = async (id) =>
  axios.delete(`/clientes/${id}`);

// Crear una nueva entrega para un cliente
export const createEntregaRequest = async (clienteId, entrega) =>
  axios.post(`/clientes/${clienteId}/entregas`, entrega);
