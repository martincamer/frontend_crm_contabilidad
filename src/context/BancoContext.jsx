import React, { createContext, useContext, useState } from "react";
import {
  getBancosRequest,
  getBancoRequest,
  createBancoRequest,
  deleteBancoRequest,
  updateBancoRequest,
} from "../api/banco"; // Asegúrate de importar las funciones API correctas para Banco
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showSuccessToastError } from "../helpers/toast";

const BancoContext = createContext();

export const useBanco = () => {
  const context = useContext(BancoContext);
  if (!context) {
    throw new Error("Error al usar el contexto de banco");
  }
  return context;
};

export function BancoProvider({ children }) {
  const [bancos, setBancos] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getBancos = async () => {
    try {
      const res = await getBancosRequest();
      setBancos(res.data);
    } catch (error) {
      console.error("Error al obtener bancos:", error);
      setError("Error al obtener bancos");
    }
  };

  const getBanco = async (id) => {
    try {
      const res = await getBancoRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener banco:", error);
    }
  };

  const deleteBanco = async (id) => {
    try {
      const res = await deleteBancoRequest(id);
      if (res.status === 204) {
        setBancos(bancos.filter((banco) => banco._id !== id));
        showSuccessToastError("Banco eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar banco:", error);
      setError("Error al eliminar banco");
    }
  };

  const createBanco = async (banco) => {
    try {
      const res = await createBancoRequest(banco);
      const nuevoBanco = res.data;

      setBancos([...bancos, nuevoBanco]);

      showSuccessToast("Banco creado correctamente");
      // navigate("/bancos");
    } catch (error) {
      console.error("Error al crear banco:", error);
      setError("Error al crear banco");
    }
  };

  const updateBanco = async (id, banco) => {
    try {
      const res = await updateBancoRequest(id, banco);
      const bancosActualizados = bancos.map((b) =>
        b._id === id ? res.data : b
      );
      setBancos(bancosActualizados);
      showSuccessToast("Banco editado correctamente");
    } catch (error) {
      console.error("Error al editar banco:", error);
      setError("Error al editar banco");
    }
  };

  return (
    <BancoContext.Provider
      value={{
        bancos,
        error,
        getBanco,
        getBancos,
        deleteBanco,
        createBanco,
        updateBanco,
      }}
    >
      {children}
    </BancoContext.Provider>
  );
}
