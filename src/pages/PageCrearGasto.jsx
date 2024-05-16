import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios"; // Importamos axios para la llamada a Cloudinary
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import FileDropZone from "../components/ui/FileDropZone";
import Select from "react-select";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ModalCrearCategoria } from "../components/ui/ModalCrearCategoria";
import { ModalCrearProveedor } from "../components/ui/ModalCrearProveedor";

dayjs.extend(utc);

export function PageCrearGasto() {
  const { register, handleSubmit, control } = useForm();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const options = [
    { value: "proveedor1", label: "Proveedor 1" },
    { value: "proveedor2", label: "Proveedor 2" },
    { value: "proveedor3", label: "Proveedor 3" },
    // Añade más opciones según sea necesario
  ];

  const optionsCategorias = [
    { value: "revestimiento", label: "Revestimiento" },
    { value: "maderas", label: "Maderas" },
    { value: "cheques", label: "Cheques a terceros" },
    // Añade más opciones según sea necesario
  ];

  // useEffect(() => {
  //   getColores();
  //   getCategorias();
  // }, []);

  // Función para subir la imagen a Cloudinary y obtener la URL
  // const uploadFile = async (file) => {
  //   if (!file) {
  //     return null;
  //   }

  //   const data = new FormData();
  //   data.append("file", file);
  //   data.append("upload_preset", "imagenes");

  //   try {
  //     const api = `https://api.cloudinary.com/v1_1/doguyttkd/image/upload`;
  //     const res = await axios.post(api, data);
  //     const { secure_url } = res.data; // Obtenemos la URL segura
  //     return secure_url;
  //   } catch (error) {
  //     console.error("Error uploading to Cloudinary:", error);
  //     return null;
  //   }
  // };

  // const onSubmit = async (formData) => {
  //   try {
  //     // Subimos la imagen a Cloudinary y obtenemos la URL
  //     const imageURL = await uploadFile(uploadedFile);

  //     // Creamos el objeto del producto con todos los datos y la URL de la imagen
  //     const productData = {
  //       ...formData,
  //       date: dayjs.utc(formData.date).format(),
  //       imagen: imageURL, // Añadimos la URL de la imagen
  //     };

  //     await createProducto(productData);
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //   }
  // };

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
    <section>
      <div>
        <Navegacion>
          <div>
            <NavegacionLink
              link={"/gastos"}
              estilos={
                "bg-orange-400 text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
              }
            >
              Gastos
            </NavegacionLink>
          </div>
          <div className="px-5 flex gap-2">
            <Link
              to={"/crear-gasto"}
              className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow hover:bg-blue-500 transition-all"
            >
              Crear nuevo gastó
            </Link>
            <Link
              to={"/crear-gasto"}
              className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow transition-all hover:bg-blue-500"
            >
              Crear categorias gastós
            </Link>
          </div>
        </Navegacion>
        <div className="w-full mt-5  px-5">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-blue-500 text-xl">Crear nuevo gasto</p>
            <p className="text-gray-500 font-medium text-sm">
              En esta sección podras crear nuevos gastos.
            </p>
          </div>

          <div className="bg-white my-5 flex flex-col gap-3">
            <div className="bg-gray-100 py-7">
              <p className="text-blue-600 text-center text-base font-bold"></p>
            </div>

            <div className="px-10 py-8 flex flex-col gap-5">
              <form onSubmit={handleSubmit()}>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="w-full mx-auto flex gap-2">
                      <Controller
                        name="proveedor"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={options}
                            classNamePrefix="react-select"
                            className="w-full"
                            placeholder="Buscar o seleccionar proveedor"
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                textTransform: "uppercase",
                                padding: "5px 0px",
                                borderRadius: "none",
                                color: "#4A5568", // text-slate-700
                                backgroundColor: "#F7FAFC", // bg-gray-100
                                padding: "0.35rem 0.75rem", // py-3 px-3
                                borderColor: state.isFocused
                                  ? "#3b82f6"
                                  : "#E2E8F0", // border-sky-500 or default border
                                boxShadow: state.isFocused
                                  ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                                  : null, // shadow-lg on focus
                                transition: "all 0.2s ease",
                                fontSize: "0.75rem", // text-xs
                                fontWeight: "500", // font-medium
                              }),
                              placeholder: (provided) => ({
                                ...provided,
                                color: "#A0AEC0", // text-slate-400
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                color: "#4A5568", // text-slate-700
                              }),
                              menu: (provided) => ({
                                ...provided,
                                fontSize: "11px",
                                fontWeight: "bold",
                                borderRadius: "none",
                                padding: 0,
                                margin: 0,
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected
                                  ? "#3b82f6"
                                  : state.isFocused
                                  ? "#E2E8F0"
                                  : null, // Change color on select and focus
                                color: state.isSelected ? "#FFFFFF" : "#4A5568", // White text on selected, default on focus
                                padding: "8px 12px",
                              }),
                            }}
                          />
                        )}
                      />
                      <div
                        className="tooltip font-semibold"
                        data-tip="Crear proveedor"
                      >
                        <div
                          className="border border-[#E2E8F0] bg-[#F7FAFC] text-blue-600 px-3 h-8 hover:shadow flex justify-center items-center font-bold cursor-pointer text-xl hover:border-blue-500 transition-all"
                          onClick={() =>
                            document.getElementById("my_modal_4").showModal()
                          }
                        >
                          <IoIosAddCircleOutline />
                        </div>
                        <ModalCrearProveedor />
                      </div>
                    </div>
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
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-semibold text-sm text-gray-700">
                        N° Factura/gasto
                      </label>
                      <input className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold" />
                      <p className="text-xs font-medium text-gray-400">
                        Número de la factura/etc
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-semibold text-sm text-gray-700">
                          Fecha
                        </label>
                        <input
                          type="date"
                          className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-semibold text-sm text-gray-700">
                          Fecha de vencimiento
                        </label>
                        <input
                          type="date"
                          className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-semibold text-sm text-gray-700">
                          Términos de pago
                        </label>
                        <select className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                          <option value="">Seleccionar termino</option>
                          <option value="">Efectivo</option>
                          <option value="">Transferencia</option>
                          <option value="">Cheque a terceros</option>
                          <option value="">Cheque</option>
                          <option value="">Tarjeta</option>
                        </select>
                      </div>
                      <div className="w-full mx-auto flex flex-col gap-1">
                        <label className="font-semibold text-sm text-gray-700">
                          Seleccionar categoria del gastó
                        </label>
                        <div className="flex gap-2">
                          <Controller
                            name="categoria"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={optionsCategorias}
                                classNamePrefix="react-select"
                                className="w-full"
                                placeholder="Buscar o seleccionar categoria"
                                styles={{
                                  control: (provided, state) => ({
                                    ...provided,
                                    textTransform: "capitalize",

                                    padding: "5px 0px",
                                    borderRadius: "none",
                                    color: "#4A5568", // text-slate-700
                                    backgroundColor: "#F7FAFC", // bg-gray-100
                                    padding: "0.31rem 0.75rem", // py-3 px-3
                                    borderColor: state.isFocused
                                      ? "#3b82f6"
                                      : "#E2E8F0", // border-sky-500 or default border
                                    boxShadow: state.isFocused
                                      ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                                      : null, // shadow-lg on focus
                                    transition: "all 0.2s ease",
                                    fontSize: "0.75rem", // text-xs
                                    fontWeight: "600", // font-medium
                                  }),
                                  placeholder: (provided) => ({
                                    ...provided,
                                    color: "#A0AEC0", // text-slate-400
                                  }),
                                  singleValue: (provided) => ({
                                    ...provided,
                                    color: "#4A5568", // text-slate-700
                                  }),
                                  menu: (provided) => ({
                                    ...provided,
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    borderRadius: "none",
                                    padding: 0,
                                    margin: 0,
                                  }),
                                  option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected
                                      ? "#3b82f6"
                                      : state.isFocused
                                      ? "#E2E8F0"
                                      : null, // Change color on select and focus
                                    color: state.isSelected
                                      ? "#FFFFFF"
                                      : "#4A5568", // White text on selected, default on focus
                                    padding: "8px 12px",
                                  }),
                                }}
                              />
                            )}
                          />
                          <div
                            className="tooltip font-semibold"
                            data-tip="Crear categoria"
                          >
                            <div
                              className="border border-[#E2E8F0] bg-[#F7FAFC] text-blue-600 px-3 h-8 hover:shadow flex justify-center items-center font-bold cursor-pointer text-xl hover:border-blue-500 transition-all"
                              onClick={() =>
                                document
                                  .getElementById("my_modal_3")
                                  .showModal()
                              }
                            >
                              <IoIosAddCircleOutline />
                            </div>

                            <ModalCrearCategoria />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    className="bg-blue-500 py-3 px-8 text-sm rounded-full font-semibold text-white mt-3 hover:bg-orange-500 transition-all cursor-pointer"
                  >
                    Emitir nuevo gasto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
