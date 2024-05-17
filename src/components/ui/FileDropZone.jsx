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
  const isImage = (file) => {
    return file.type.startsWith("image/");
  };

  const isPDF = (file) => {
    return file.type === "application/pdf";
  };

  return (
    <div className="bg-white border-[2px] border-dashed py-5 px-5 w-full">
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-500"
            >
              Cargar comprobante
            </label>
          </div>
        </div>
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
              <p className="text-gray-600">
                Archivo cargado: {uploadedFile.name}
              </p>
              {isImage(uploadedFile) && (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Vista previa"
                  className="mt-4 mx-auto rounded w-1/2"
                />
              )}
              {isPDF(uploadedFile) && (
                <iframe
                  src={URL.createObjectURL(uploadedFile)}
                  title="Documento PDF"
                  className="mt-4 mx-auto rounded w-full h-64"
                ></iframe>
              )}
              <button
                onClick={handleRemoveFile}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div>
              <div className="text-gray-500 text-sm">
                Arrastra y suelta o{" "}
                <span className="text-blue-500 font-semibold cursor-pointer">
                  carga tu imagen o documento aquí
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Máximo disponible para subir <b>una</b> imagen o archivo.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDropZone;
