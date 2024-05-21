import React, { createContext, useContext, useState } from "react";
import {
  getClientesRequest,
  getClienteRequest,
  createClienteRequest,
  deleteClienteRequest,
  updateClienteRequest,
  createEntregaRequest,
} from "../api/cliente"; // Asegúrate de importar las funciones API correctas
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../helpers/toast";

const ClienteContext = createContext();

export const useCliente = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error("Error al usar el contexto de cliente");
  }
  return context;
};

export function ClienteProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [cliente, setCliente] = useState([]);

  const navigate = useNavigate();

  const getClientes = async () => {
    try {
      const res = await getClientesRequest();
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setError("Error al obtener clientes");
    }
  };

  const getCliente = async (id) => {
    try {
      const res = await getClienteRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener cliente:", error);
    }
  };

  const deleteCliente = async (id) => {
    try {
      const res = await deleteClienteRequest(id);
      if (res.status === 204) {
        setClientes(clientes.filter((cliente) => cliente._id !== id));
        showSuccessToast("Cliente eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      setError("Error al eliminar cliente");
    }
  };

  const createCliente = async (cliente) => {
    try {
      const res = await createClienteRequest(cliente);
      const nuevoCliente = res.data;

      setClientes([...clientes, nuevoCliente]);

      showSuccessToast("Cliente creado correctamente");
      navigate("/clientes");
    } catch (error) {
      console.error("Error al crear cliente:", error);
      setError("Error al crear cliente");
    }
  };

  const updateCliente = async (id, cliente) => {
    try {
      const res = await updateClienteRequest(id, cliente);
      console.log("data", res.data);
      const clientesActualizados = clientes.map((c) =>
        c._id === id ? res.data : c
      );
      setClientes(clientesActualizados);

      setCliente(res.data);
      showSuccessToast("Cuota cargada correctamente");
    } catch (error) {
      console.error("Error al editar cliente:", error);
      setError("Error al editar cliente");
    }
  };

  const createEntrega = async (clienteId, entregaData) => {
    try {
      // Llamar a la función API para crear la entrega
      const res = await createEntregaRequest(clienteId, entregaData);

      console.log(res);

      const clientesActualizados = clientes.map((c) =>
        c._id === clienteId ? res.data : c
      );
      setClientes(clientesActualizados);

      setCliente(res.data);

      // Mostrar mensaje de éxito
      showSuccessToast("Entrega creada correctamente");
    } catch (error) {
      console.error("Error al crear entrega:", error);
    }
  };

  // const updateCliente = async (id, cliente) => {
  //   try {
  //     const res = await updateClienteRequest(id, cliente);

  //     console.log(res);

  //     const clientesActualizados = clientes.map((c) =>
  //       c._id === id ? res.data : c
  //     );
  //     setClientes(clientesActualizados);
  //     showSuccessToast("Cliente editado correctamente");
  //     // navigate('/clientes');
  //   } catch (error) {
  //     console.error("Error al editar cliente:", error);
  //     setError("Error al editar cliente");
  //   }
  // };

  return (
    <ClienteContext.Provider
      value={{
        clientes,
        error,
        getCliente,
        getClientes,
        deleteCliente,
        createCliente,
        updateCliente,
        setCliente,
        cliente,
        createEntrega,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}
