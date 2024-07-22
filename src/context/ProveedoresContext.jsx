import React, { createContext, useContext, useState } from "react";
import {
  getProveedoresRequest,
  getProveedorRequest,
  createProveedorRequest,
  deleteProveedorRequest,
  updateProveedorRequest,
} from "../api/proveedor.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProveedorContext = createContext();

export const useProveedor = () => {
  const context = useContext(ProveedorContext);
  if (!context) {
    throw new Error("Error al usar el contexto de proveedor");
  }
  return context;
};

export function ProveedorProvider({ children }) {
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getProveedores = async () => {
    try {
      const res = await getProveedoresRequest();
      setProveedores(res.data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      setError("Error al obtener proveedores");
    }
  };

  // Obtener una venta por ID
  const getProveedor = async (id) => {
    try {
      const res = await getProveedorRequest(id); // Solicitud para obtener una venta por ID
      return res.data; // Devuelve los datos de la venta
    } catch (error) {
      console.error("Error al obtener venta:", error); // Manejo de errores
    }
  };

  const deleteProveedor = async (id) => {
    try {
      const res = await deleteProveedorRequest(id);
      if (res.status === 204) {
        setProveedores(proveedores.filter((proveedor) => proveedor._id !== id));
        toast.success("Proveedor eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      setError("Error al eliminar proveedor");
    }
  };

  const createProveedor = async (proveedor) => {
    try {
      const res = await createProveedorRequest(proveedor);
      const nuevoProveedor = res.data;

      setProveedores([...proveedores, nuevoProveedor]);
      toast.success("Proveedor creado correctamente");
      // navigate("/proveedores");
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      setError("Error al crear proveedor");
    }
  };

  const updateProveedor = async (id, proveedor) => {
    try {
      const res = await updateProveedorRequest(id, proveedor);
      const proveedoresActualizados = proveedores.map((p) =>
        p._id === id ? res.data : p
      );
      setProveedores(proveedoresActualizados);
      toast.success("Proveedor editado correctamente");
      // navigate("/proveedores");
    } catch (error) {
      console.error("Error al editar proveedor:", error);
      setError("Error al editar proveedor");
    }
  };

  return (
    <ProveedorContext.Provider
      value={{
        proveedores,
        error,
        getProveedor,
        getProveedores,
        deleteProveedor,
        createProveedor,
        updateProveedor,
      }}
    >
      {children}
    </ProveedorContext.Provider>
  );
}
