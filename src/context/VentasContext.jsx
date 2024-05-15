import { createContext, useContext, useEffect, useState } from "react";
import {
  getVentasRequest,
  createVentaRequest,
  deleteVentaRequest,
  updateVentaRequest,
  getVentaRequest,
} from "../api/ventas.js"; // Asegúrate de tener las funciones de solicitud correctas para ventas
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Crear el contexto para ventas
const VentasContext = createContext();

// Hook personalizado para usar el contexto de ventas
export const useVentas = () => {
  const context = useContext(VentasContext);
  if (!context) {
    throw new Error("Error al usar el context");
  }
  return context;
};

// Proveedor del contexto de ventas
export function VentasProvider({ children }) {
  const [ventas, setVentas] = useState([]); // Estado para guardar ventas
  const [remulegal, setRemuolegales] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [error, setError] = useState([]);

  // Obtener todas las ventas
  const getVentas = async () => {
    try {
      const res = await getVentasRequest(); // Solicitud para obtener todas las ventas
      setVentas(res.data); // Actualiza el estado con las ventas

      console.log("datos", res.data);
    } catch (error) {
      console.error("Error al obtener ventas:", error); // Manejo de errores
    }
  };

  // Eliminar una venta por ID
  const deleteVenta = async (id) => {
    try {
      const res = await deleteVentaRequest(id); // Solicitud para eliminar una venta
      if (res.status === 204) {
        // Venta eliminada correctamente
        setVentas(ventas.filter((venta) => venta._id !== id)); // Elimina del estado

        toast.error("Venta eliminada correctamente", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar,
          closeOnClick,
          pauseOnHover,
          draggable,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error al eliminar venta:", error); // Manejo de errores
    }
  };

  // Crear una nueva venta
  const createVenta = async (venta) => {
    try {
      const res = await createVentaRequest(venta); // Solicitud para crear una venta
      const nuevaVenta = res.data; // Datos de la venta creada

      setVentas([...ventas, nuevaVenta]); // Actualiza el estado para agregar la nueva venta

      toast.success("Salida creada correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          padding: "10px",
          borderRadius: "15px",
        },
        // transition: "Bounce",
      });
    } catch (error) {
      console.error("Error al crear venta:", error); // Manejo de errores
    }
  };

  // Obtener una venta por ID
  const getVenta = async (id) => {
    try {
      const res = await getVentaRequest(id); // Solicitud para obtener una venta por ID
      return res.data; // Devuelve los datos de la venta
    } catch (error) {
      console.error("Error al obtener venta:", error); // Manejo de errores
    }
  };

  const navigate = useNavigate();

  // Actualizar una venta por ID
  const updateVenta = async (id, venta) => {
    try {
      const res = await updateVentaRequest(id, venta); // Solicitud para actualizar una venta
      console.log(res);

      const ventasActualizadas = ventas.map((v) =>
        v._id === id ? res.data : v
      ); // Actualiza la venta en el estado

      setVentas(ventasActualizadas); // Actualiza el estado de las ventas

      toast.success("Salida editada correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          padding: "10px",
          borderRadius: "15px",
        },
        // transition: "Bounce",
      });

      setTimeout(() => {
        navigate("/ventas");
      }, 3000);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // Obtener todas las remuolegales
  const getRemuolegales = async () => {
    try {
      const res = await getRemuolegalesRequest(); // Solicitud para obtener todas las remuolegales
      setRemuolegales(res.data); // Actualiza el estado con las remuolegales

      console.log("datos", res.data);
    } catch (error) {
      console.error("Error al obtener remuolegales:", error); // Manejo de errores
    }
  };

  // Eliminar una remuolegal por ID
  const deleteRemuolegal = async (id) => {
    try {
      const res = await deleteRemuolegalRequest(id); // Solicitud para eliminar una remuolegal
      if (res.status === 204) {
        // Remuolegal eliminada correctamente
        setRemuolegales(
          remulegal.filter((remuolegal) => remuolegal._id !== id)
        ); // Elimina del estado

        toast.error("Remuolegal eliminada correctamente", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar,
          closeOnClick,
          pauseOnHover,
          draggable,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error al eliminar remuolegal:", error); // Manejo de errores
    }
  };

  // Crear una nueva remuolegal
  const createRemuolegal = async (remuolegal) => {
    try {
      const res = await createRemuolegalRequest(remuolegal); // Solicitud para crear una remuolegal
      const nuevaRemuolegal = res.data; // Datos de la remuolegal creada

      setRemuolegales([...remulegal, nuevaRemuolegal]); // Actualiza el estado para agregar la nueva remuolegal

      toast.success("Remuolegal creada correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          padding: "10px",
          borderRadius: "15px",
        },
        // transition: "Bounce",
      });
    } catch (error) {
      console.error("Error al crear remuolegal:", error); // Manejo de errores
    }
  };

  // Obtener una remuolegal por ID
  const getRemuolegal = async (id) => {
    try {
      const res = await getRemuolegalRequest(id); // Solicitud para obtener una remuolegal por ID
      return res.data; // Devuelve los datos de la remuolegal
    } catch (error) {
      console.error("Error al obtener remuolegal:", error); // Manejo de errores
    }
  };

  // Actualizar una remuolegal por ID
  const updateRemuolegal = async (id, remuolegal) => {
    try {
      const res = await updateRemuolegalRequest(id, remuolegal); // Solicitud para actualizar una remuolegal
      console.log(res);

      const remuolegalesActualizadas = remulegal.map((r) =>
        r._id === id ? res.data : r
      ); // Actualiza la remuolegal en el estado

      setRemuolegales(remuolegalesActualizadas); // Actualiza el estado de las remuolegales

      toast.success("Remuolegal editada correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          padding: "10px",
          borderRadius: "15px",
        },
        // transition: "Bounce",
      });

      setTimeout(() => {
        navigate("/remuolegales");
      }, 3000);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // Obtener todos los choferes
  const getChoferes = async () => {
    try {
      const res = await getChoferesRequest(); // Solicitud para obtener todos los choferes
      setChoferes(res.data); // Actualiza el estado con los choferes
    } catch (error) {
      console.error("Error al obtener choferes:", error); // Manejo de errores
    }
  };

  // Eliminar un chofer por ID
  const deleteChofer = async (id) => {
    try {
      const res = await deleteChoferRequest(id); // Solicitud para eliminar un chofer
      if (res.status === 204) {
        // Chofer eliminado correctamente
        setChoferes(choferes.filter((chofer) => chofer._id !== id)); // Elimina del estado

        toast.error("Chofer eliminado correctamente", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error al eliminar chofer:", error); // Manejo de errores
    }
  };

  // Crear un nuevo chofer
  const createChofer = async (chofer) => {
    try {
      const res = await createChoferRequest(chofer); // Solicitud para crear un chofer
      const nuevoChofer = res.data; // Datos del chofer creado

      setChoferes([...choferes, nuevoChofer]); // Actualiza el estado para agregar el nuevo chofer

      toast.success("Chofer creado correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error("Error al crear chofer:", error); // Manejo de errores
    }
  };

  // Obtener un chofer por ID
  const getChofer = async (id) => {
    try {
      const res = await getChoferRequest(id); // Solicitud para obtener un chofer por ID
      return res.data; // Devuelve los datos del chofer
    } catch (error) {
      console.error("Error al obtener chofer:", error); // Manejo de errores
    }
  };

  // Actualizar un chofer por ID
  const updateChofer = async (id, chofer) => {
    try {
      const res = await updateChoferRequest(id, chofer); // Solicitud para actualizar un chofer
      const choferesActualizados = choferes.map((c) =>
        c._id === id ? res.data : c
      ); // Actualiza el chofer en el estado

      setChoferes(choferesActualizados); // Actualiza el estado de los choferes

      toast.success("Chofer editado correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setTimeout(() => {
        navigate("/choferes");
      }, 3000);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <VentasContext.Provider
      value={{
        ventas,
        setVentas,
        getVentas,
        deleteVenta,
        createVenta,
        getVenta,
        updateVenta,
        remulegal,
        error,
        getRemuolegales,
        deleteRemuolegal,
        createRemuolegal,
        getRemuolegal,
        updateRemuolegal,
        getChoferes,
        deleteChofer,
        createChofer,
        getChofer,
        updateChofer,
        choferes,
      }}
    >
      {children}
    </VentasContext.Provider>
  );
}

export default VentasProvider;
