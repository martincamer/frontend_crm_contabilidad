import axios from "./axios";

export const registerRequest = async (user) =>
  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => axios.post(`/auth/login`, user);

export const verifyTokenRequest = async () => axios.get(`/auth/verify`);

// export const updateUser = async (id, data) => axios.put(`/user/${id}`, data);
export const updateUser = async (id, user) =>
  axios.patch(`/auth/user/${id}`, user);

export const updateUserImagenUrl = async (id, user) =>
  axios.patch(`/auth/user-img/${id}`, user);

export const logoutRequest = async () => axios.post("/logout");
