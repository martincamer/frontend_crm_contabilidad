import { IoClose } from "react-icons/io5";

const FileDropZone = ({
  uploadedFile,
  dragging,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleRemoveFile,
}) => {
  return (
    <div className="bg-white py-5 px-5 rounded-xl shadow-xl w-full">
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* Input oculto para carga de archivos */}
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Label que actúa como botón, enlazado con el input por el ID */}
            <label
              htmlFor="file-upload"
              className="bg-sky-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-sky-700"
            >
              Cargar imagen
            </label>
          </div>
        </div>
        {/* Zona para arrastrar y soltar archivos */}
        <div
          className={`border-2 border-dashed border-gray-300 p-6 text-center ${
            dragging ? "bg-gray-100" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="relative">
              {/* Muestra el nombre del archivo */}
              <p className="text-gray-600">
                Archivo cargado: {uploadedFile.name}
              </p>
              {uploadedFile.type.startsWith("image/") && (
                <>
                  {/* Muestra la imagen cargada */}
                  <img
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Vista previa"
                    className="mt-4 mx-auto rounded w-1/2"
                  />

                  {/* Botón para eliminar el archivo */}
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  >
                    <IoClose className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="text-gray-500">
                Arrastra y suelta o{" "}
                <span className="text-sky-500 cursor-pointer">
                  carga tu imagen aquí
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Máximo disponible para subir <b>una</b> imagen.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDropZone;
