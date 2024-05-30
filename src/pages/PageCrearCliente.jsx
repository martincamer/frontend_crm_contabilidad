import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { BreadCrumbs } from "../components/ui/BreadCrumbs";
import { LinkBreadCrumbs } from "../components/ui/LinkBreadCrumbs";
import { FormInput } from "../components/ui/FormInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCliente } from "../context/ClientesContext";
import { Submit } from "../components/ui/Submit";
import { SelectInput } from "../components/ui/SelectInput";
import { tiposDePagos } from "../../src/data/TiposDePagos";
import { formatearDinero } from "../helpers/FormatearDinero";
import FileDropZone from "../components/ui/FileDropZone";
import dayjs from "dayjs";
import axios from "axios";

export const PageCrearCliente = () => {
  const { createCliente } = useCliente();

  const { register, handleSubmit, watch } = useForm();

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
    try {
      // Subimos la imagen a Cloudinary y obtenemos la URL
      const imageURL = await uploadFile(uploadedFile);

      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const clienteData = {
        ...formData,
        comprobante: imageURL,
        date: dayjs.utc(formData.date).format(),
      };

      await createCliente(clienteData);
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

  const total_seña = watch("seña");
  const total_vivienda = watch("total_vivienda");

  return (
    <section>
      <Navegacion>
        <div className="flex">
          <NavegacionLink
            link={"/clientes"}
            estilos={
              "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5 z-[100]"
            }
          >
            Clientes
          </NavegacionLink>
          <NavegacionLink
            link={"/crear-cliente"}
            estilos={
              "bg-orange-500 text-white text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
            }
          >
            Crear nuevo cliente
          </NavegacionLink>
        </div>
        <div className="px-5 flex gap-2">
          <BreadCrumbs>
            <LinkBreadCrumbs link={"home"}>Inicio</LinkBreadCrumbs>
            <LinkBreadCrumbs link={"clientes"}>Clientes</LinkBreadCrumbs>
          </BreadCrumbs>
        </div>
      </Navegacion>
      <div className="w-full mt-5  px-5 flex flex-col items-start gap-5">
        <div className="flex flex-col gap-1">
          <div className="bg-white py-5 px-5">
            <p className="font-bold text-blue-500 text-xl">
              Crear nuevo cliente
            </p>
            <p className="text-gray-500 font-medium text-sm">
              En esta sección podras crear un nuevo cliente.
            </p>
          </div>
        </div>
        <div className="bg-white my-5 flex flex-col gap-3 w-1/2">
          <div className="bg-gray-100 py-7">
            <p className="text-blue-600 text-center text-base font-bold"></p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="py-10 px-10">
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                type={"text"}
                labelText={"Nombre del cliente"}
                placeholder={"Nombre"}
                props={{ ...register("nombre", { required: true }) }}
              />
              <FormInput
                type={"text"}
                labelText={"Apellido"}
                placeholder={"Apellido"}
                props={{ ...register("apellido", { required: true }) }}
              />
              <FormInput
                type={"text"}
                labelText={"Dni"}
                placeholder={"Dni"}
                props={{ ...register("dni", { required: true }) }}
              />

              <FormInput
                type={"text"}
                labelText={"Provincia"}
                placeholder={"Provincia"}
                props={{ ...register("provincia", { required: true }) }}
              />

              <FormInput
                type={"text"}
                labelText={"Localidad"}
                placeholder={"Localidad"}
                props={{ ...register("localidad", { required: true }) }}
              />

              <FormInput
                type={"text"}
                labelText={"Dirección"}
                placeholder={"Dirección"}
                props={{ ...register("direccion", { required: true }) }}
              />
              <FormInput
                type={"text"}
                labelText={"Telefono"}
                placeholder={"telefono"}
                props={{ ...register("telefono", { required: true }) }}
              />
              <FormInput
                type={"text"}
                labelText={"Email"}
                placeholder={"Email"}
                props={{ ...register("email", { required: true }) }}
              />
              <FormInput
                type={"text"}
                labelText={"Edad"}
                placeholder={"Edad"}
                props={{ ...register("edad", { required: true }) }}
              />
              <FormInput
                type={"text"}
                labelText={"Numero contrato"}
                placeholder={"000-5234"}
                props={{ ...register("numero_contrato", { required: true }) }}
              />
              <FormInput
                type={"text"}
                labelText={"Total de la seña"}
                placeholder={"100000"}
                props={{ ...register("seña", { required: true }) }}
              />
              <SelectInput
                props={{ ...register("termino_pago", { required: true }) }}
                labelText={"Seleccionar termino de pago seña"}
              >
                <option className="font-bold text-blue-500">
                  Seleccionar termino
                </option>
                {tiposDePagos.map((pago) => (
                  <option
                    className="font-semibold capitalize"
                    key={pago.id}
                    value={pago.nombre}
                  >
                    {pago.nombre}
                  </option>
                ))}
              </SelectInput>
              <FormInput
                type={"text"}
                labelText={"Total de cuotas / valor numerico"}
                placeholder={"12"}
                props={{ ...register("plan", { required: true }) }}
              />
              <FormInput
                type={"text"}
                labelText={"Total del valor de la vivienda"}
                placeholder={"14000000"}
                props={{ ...register("total_vivienda", { required: true }) }}
              />
            </div>

            <div className="mt-6">
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

            <div className="flex gap-5 mt-5">
              <p className="bg-blue-500 py-2 px-3 text-white font-meidum">
                Seña final{" "}
                <span className="font-bold">
                  {formatearDinero(Number(total_seña) || 0)}
                </span>
              </p>
              <p className="bg-blue-500 py-2 px-3 text-white font-meidum">
                Total vivienda final{" "}
                <span className="font-bold">
                  {formatearDinero(Number(total_vivienda) || 0)}
                </span>
              </p>
            </div>

            <div className="mt-2">
              <Submit type={"submit"}>Crear cliente</Submit>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
