import axios from "./axios";

// Obtener todos los clientes
export const getClientesRequest = async () => axios.get("/contratos");

// Obtener todos los clientes
export const getClienteRequest = async (id) => axios.get(`/contratos/${id}`);

// Crear un nuevo cliente
export const createClienteRequest = async (cliente) =>
  axios.post("/contratos", cliente);

// Actualizar un cliente por su ID
export const updateClienteRequest = async (id, cliente) =>
  axios.put(`/contratos/${id}`, cliente);

// Eliminar un cliente por su ID
export const deleteClienteRequest = async (id) =>
  axios.delete(`/contratos/${id}`);
