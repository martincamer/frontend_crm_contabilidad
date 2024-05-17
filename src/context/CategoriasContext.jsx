import React, { createContext, useContext, useState } from "react";
import {
  getCategoriasRequest,
  createCategoriaRequest,
  deleteCategoriaRequest,
  updateCategoriaRequest,
} from "../api/categoria"; // Asegúrate de importar las funciones de API correctas
import { showSuccessToast, showSuccessToastError } from "../helpers/toast";

const CategoriaContext = createContext();

export const useCategoria = () => {
  const context = useContext(CategoriaContext);
  if (!context) {
    throw new Error("Error al usar el contexto de categoría");
  }
  return context;
};

export function CategoriaProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");

  const getCategorias = async () => {
    try {
      const res = await getCategoriasRequest();
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setError("Error al obtener categorías");
    }
  };

  const createCategoria = async (categoria) => {
    try {
      const res = await createCategoriaRequest(categoria);
      const nuevaCategoria = res.data;
      setCategorias([...categorias, nuevaCategoria]);
      //   toast.success("Categoría creada correctamente");

      // navigate("/categorias");

      showSuccessToast("Categoria creada correctamente");
    } catch (error) {
      console.error("Error al crear categoría:", error);
      setError("Error al crear categoría");
    }
  };

  const deleteCategoria = async (id) => {
    try {
      const res = await deleteCategoriaRequest(id);
      if (res.status === 204) {
        setCategorias(categorias.filter((cat) => cat._id !== id));
        ("Categoría eliminada correctamente");
      }
      showSuccessToastError("Categoria eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      setError("Error al eliminar categoría");
    }
  };

  const updateCategoria = async (id, categoria) => {
    try {
      const res = await updateCategoriaRequest(id, categoria);
      const categoriasActualizadas = categorias.map((cat) =>
        cat._id === id ? res.data : cat
      );
      setCategorias(categoriasActualizadas);
      showSuccessToast("Categoria actualizada correctamente");
      // navigate("/categorias");
    } catch (error) {
      console.error("Error al editar categoría:", error);
      setError("Error al editar categoría");
    }
  };

  return (
    <CategoriaContext.Provider
      value={{
        categorias,
        error,
        getCategorias,
        createCategoria,
        deleteCategoria,
        updateCategoria,
      }}
    >
      {children}
    </CategoriaContext.Provider>
  );
}
