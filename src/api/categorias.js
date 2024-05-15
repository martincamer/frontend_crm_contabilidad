import axios from "./axios";

export const getCategoriasRequest = async () => axios.get("/categorias");

export const createCategoriaRequest = async (categoria) =>
  axios.post("/categorias", categoria);

export const updateCategoriaRequest = async (id, categoria) =>
  axios.put(`/categorias/${id}`, categoria);

export const deleteCategoriaRequest = async (id) =>
  axios.delete(`/categorias/${id}`);

export const getCategoriaRequest = async (id) => axios.get(`/categorias/${id}`);
