import axios from "./axios"; // Importa tu configuración de axios

export const getProveedoresRequest = async () => axios.get("/proveedores");

export const createProveedorRequest = async (proveedor) =>
  axios.post("/proveedores", proveedor);

export const getProveedorRequest = async (id) =>
  axios.get(`/proveedores/${id}`);

export const updateProveedorRequest = async (id, proveedor) =>
  axios.put(`/proveedores/${id}`, proveedor);

export const deleteProveedorRequest = async (id) =>
  axios.delete(`/proveedores/${id}`);
