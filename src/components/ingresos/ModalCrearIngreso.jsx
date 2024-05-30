import React, { useState } from "react";
import { Submit } from "../ui/Submit";
import { FormInput } from "../ui/FormInput";
import { useForm } from "react-hook-form";
import { SelectInput } from "../ui/SelectInput";
import { useIngreso } from "../../context/IngresosContext";
import { tiposDePagos } from "../../../src/data/TiposDePagos";
import FileDropZone from "../ui/FileDropZone";
import dayjs from "dayjs";
import axios from "axios";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { Texto } from "../ui/Texto";

export const ModalCrearIngreso = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const { createIngreso } = useIngreso();

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
      const ingresoData = {
        ...formData,
        comprobante: imageURL,
        date: dayjs.utc(formData.date).format(),
      };

      await createIngreso(ingresoData);

      document.getElementById("my_modal_crear_ingreso").close();

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

  const total_final = watch("total_ingreso");

  return (
    <dialog id="my_modal_crear_ingreso" className="modal">
      <div className="modal-box rounded-none m-0 h-full w-full max-w-full max-h-full bg-[#ECF0F1]">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-2">
            ✕
          </button>
        </form>
        <div className="flex">
          <h3 className="text-lg text-left bg-white py-5 px-10 text-blue-500 font-bold">
            Cargar nuevo ingreso
          </h3>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-3 text-left bg-white py-10 px-10"
        >
          <div className="grid grid-cols-3 gap-5">
            <SelectInput
              labelText={"Seleccionar el tipo de pago"}
              props={{ ...register("tipo_pago", { required: true }) }}
            >
              <option>Seleccionar tipo de pago</option>
              {tiposDePagos.map((pago) => (
                <option key={pago.id} value={pago.nombre}>
                  {pago.nombre}
                </option>
              ))}
            </SelectInput>

            <FormInput
              labelText={"Total del ingreso"}
              placeholder={"Total del ingreso"}
              props={{ ...register("total_ingreso", { required: true }) }}
              type={"text"}
            />

            <Texto
              labelText={"Observación/Detalles"}
              placeholder={"Escribe la observación o detalles del ingreso"}
              props={{ ...register("observacion") }}
            />
            {/* <FormInput
              labelText={"Observación"}
              placeholder={"Observación"}
              props={{ ...register("observacion") }}
              type={"text"}
            /> */}

            <FormInput
              labelText={"Fecha de ingreso"}
              placeholder={"Fecha de ingreso"}
              props={{ ...register("fecha", { required: true }) }}
              type={"date"}
            />

            <FormInput
              labelText={"Fecha de vencimiento"}
              placeholder={"Fecha de vencimiento"}
              props={{ ...register("fecha_vencimiento", { required: true }) }}
              type={"date"}
            />

            <div className="col-span-2 max-w-lg">
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
          </div>

          <div className="mt-5 mb-5 flex bg-blue-50 justify-between">
            <p className="text-blue-700 text-2xl py-12 px-10 font-bold">
              Resumen final del ingreso
            </p>
            <p className="bg-blue-900  text-white py-12 px-10 text-xl font-bold">
              {formatearDinero(Number(total_final))}
            </p>
          </div>

          <Submit type={"submit"}>Cargar ingreso</Submit>
        </form>
      </div>
    </dialog>
  );
};
