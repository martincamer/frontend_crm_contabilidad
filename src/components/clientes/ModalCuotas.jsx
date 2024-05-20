import React, { useState } from "react";
import { Submit } from "../ui/Submit";
import { FormInput } from "../ui/FormInput";
import { useForm } from "react-hook-form";
import { SelectInput } from "../ui/SelectInput";
import { useCliente } from "../../context/ClientesContext";
import FileDropZone from "../ui/FileDropZone";
import dayjs from "dayjs";
import { formatearDinero } from "../../helpers/FormatearDinero";
import axios from "axios";

export const ModalCuotas = ({ id, cliente }) => {
  const { register, handleSubmit, reset, watch } = useForm();

  const totalFinal = watch("total");

  const { updateCliente } = useCliente();

  const [uploadedFile, setUploadedFile] = useState(null);

  const [dragging, setDragging] = useState(false);

  const uploadFile = async (file) => {
    if (!file) {
      return null;
    }

    const data = new FormData();
    data.append("file", file);

    // Set the upload preset based on the file type
    const uploadPreset = file.type.startsWith("image/")
      ? "imagenes"
      : "documentos";
    data.append("upload_preset", uploadPreset);

    try {
      const api = `https://api.cloudinary.com/v1_1/dw8oesxzr/${
        file.type.startsWith("image/") ? "image" : "raw"
      }/upload`;
      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const onSubmit = async (formData) => {
    const imageURL = await uploadFile(uploadedFile);
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const cajaData = {
        ...formData,
        comprobante: imageURL,
        date: dayjs.utc(formData.date).format(),
      };

      await updateCliente(id, cajaData);

      document.getElementById("my_modal_nueva_cuota").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Event handlers for drag and drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setDragging(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  return (
    <dialog id="my_modal_nueva_cuota" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Cargar nueva cuota
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <div className="flex flex-col gap-3">
            <SelectInput
              labelText={"Seleccionar cuota"}
              props={{ ...register("cuotaId", { required: true }) }}
            >
              <option>Seleccionar cuotas existentes</option>
              {cliente?.cuotas_plan?.map(
                (c, index) =>
                  c.total <= 0 && (
                    <option className="font-bold" key={index} value={c._id}>
                      {c.numero}
                    </option>
                  )
              )}
            </SelectInput>
            <FormInput
              labelText={"Total de la cuota"}
              placeholder={"Total de la cuota"}
              props={{ ...register("total", { required: true }) }}
              type={"text"}
            />

            <FileDropZone
              dragging={dragging}
              handleDragLeave={handleDragLeave}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
              setDragging={setDragging}
              setUploadedFile={setUploadedFile}
              uploadedFile={uploadedFile}
            />
          </div>
          <div className="mt-5 flex">
            <p className="bg-blue-500 py-1.5 px-3 rounded text-white font-semibold">
              {formatearDinero(Number(totalFinal))}
            </p>
          </div>
          <Submit type={"submit"}>Cargar cuota</Submit>
        </form>
      </div>
    </dialog>
  );
};
