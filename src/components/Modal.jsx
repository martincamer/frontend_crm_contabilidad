import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

export const Modal = ({ children, isVisible, onClose }) => {
  if (!isVisible) return null; // Si no es visible, no renderizar

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      // Cierra si se hace clic fuera del contenido
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick} // Manejo del clic fuera
    >
      <div className="relative bg-white rounded-lg shadow-xl p-5 w-3/4 max-w-md">
        <button
          onClick={onClose} // Botón para cerrar
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-800"
        >
          <IoClose className="text-2xl" />
        </button>
        {children} {/* Contenido dinámico */}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired, // Define si el modal está visible
  onClose: PropTypes.func.isRequired, // Función para cerrar el modal
  children: PropTypes.node.isRequired, // Contenido dinámico
};
