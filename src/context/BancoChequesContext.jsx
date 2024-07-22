import React, { createContext, useContext, useState } from "react";
import {
  getBancosChequesRequest,
  getBancoChequesRequest,
  createBancoChequesRequest,
  deleteBancoChequesRequest,
  updateBancoChequesRequest,
  agregarChequeRequest,
  deleteBancoChequeRequest,
} from "../api/bancosCheques"; // Asegúrate de importar las funciones API correctas para Banco
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showSuccessToastError } from "../helpers/toast";

const BancoChequeContext = createContext();

export const useBancoCheque = () => {
  const context = useContext(BancoChequeContext);
  if (!context) {
    throw new Error("Error al usar el contexto de banco");
  }
  return context;
};

export function BancoChequeProvider({ children }) {
  const [bancos, setBancos] = useState([]);
  const [error, setError] = useState("");

  const getBancos = async () => {
    try {
      const res = await getBancosChequesRequest();
      setBancos(res.data);
    } catch (error) {
      console.error("Error al obtener bancos:", error);
      setError("Error al obtener bancos");
    }
  };

  const getBanco = async (id) => {
    try {
      const res = await getBancoChequesRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener banco:", error);
    }
  };

  const deleteBanco = async (id) => {
    try {
      const res = await deleteBancoChequesRequest(id);
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
      const res = await createBancoChequesRequest(banco);
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
      const res = await updateBancoChequesRequest(id, banco);
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

  const crearCheque = async (cheque) => {
    try {
      const res = await agregarChequeRequest(cheque);

      setBancos(res.data);

      showSuccessToast("Cheque creado correctamente");
    } catch (error) {
      console.error("Error al crear cheque:", error);
      setError("Error al crear cheque");
    }
  };

  const deleteChequeBanco = async (id) => {
    try {
      const res = await deleteBancoChequeRequest(id);
      setBancos(res.data);

      showSuccessToastError("Cheque eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar banco:", error);
      setError("Error al eliminar banco");
    }
  };

  return (
    <BancoChequeContext.Provider
      value={{
        bancos,
        error,
        getBanco,
        getBancos,
        deleteBanco,
        createBanco,
        updateBanco,
        crearCheque,
        deleteChequeBanco,
        setBancos,
      }}
    >
      {children}
    </BancoChequeContext.Provider>
  );
}
