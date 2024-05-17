import axios from "./axios"; // Asegúrate de importar tu configuración de axios

export const getCategoriasRequest = async () => axios.get("/categorias");

export const createCategoriaRequest = async (categoria) =>
  axios.post("/categorias", categoria);

export const getCategoriaRequest = async (id) => axios.get(`/categorias/${id}`);

export const updateCategoriaRequest = async (id, categoria) =>
  axios.put(`/categorias/${id}`, categoria);

export const deleteCategoriaRequest = async (id) =>
  axios.delete(`/categorias/${id}`);
