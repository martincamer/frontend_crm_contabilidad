import axios from "./axios"; // Importa tu configuración de axios

export const getVentasRequest = async () => axios.get("/salidas");

export const createVentaRequest = async (venta) =>
  axios.post("/salidas", venta);

export const getVentaRequest = async (id) => axios.get(`/salidas/${id}`);

export const updateVentaRequest = async (id, venta) =>
  axios.put(`/salidas/${id}`, venta);

export const deleteVentaRequest = async (id) => axios.delete(`/salidas/${id}`);

export const getVentasDelMesRequest = async () => axios.get("/salidas/mes");

// REMUOLEGAL
export const getRemuolegalesRequest = async () => axios.get("/remuolegal");

export const createRemuolegalRequest = async (remuolegal) =>
  axios.post("/remuolegal", remuolegal);

export const getRemuolegalRequest = async (id) =>
  axios.get(`/remuolegal/${id}`);

export const updateRemuolegalRequest = async (id, remuolegal) =>
  axios.put(`/remuolegal/${id}`, remuolegal);

export const deleteRemuolegalRequest = async (id) =>
  axios.delete(`/remuolegal/${id}`);

export const getRemuolegalesDelMesRequest = async () =>
  axios.get("/remuolegal/mes");

//CHOFERES
export const getChoferesRequest = async () => axios.get("/choferes");

export const createChoferRequest = async (chofer) =>
  axios.post("/choferes", chofer);

export const getChoferRequest = async (id) => axios.get(`/chofer/${id}`);

export const updateChoferRequest = async (id, chofer) =>
  axios.put(`/choferes/${id}`, chofer);

export const deleteChoferRequest = async (id) =>
  axios.delete(`/choferes/${id}`);

export const getChoferesDelMesRequest = async () => axios.get("/choferes/mes");
