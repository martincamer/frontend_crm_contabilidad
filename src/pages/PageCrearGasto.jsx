import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Librería para generar IDs únicos
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ModalCrearCategoria } from "../components/ui/ModalCrearCategoria";
import { ModalCrearProveedor } from "../components/ui/ModalCrearProveedor";
import { useProveedor } from "../context/ProveedoresContext";
import { useCategoria } from "../context/CategoriasContext";
import axios from "axios"; // Importamos axios para la llamada a Cloudinary
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import FileDropZone from "../components/ui/FileDropZone";
import Select from "react-select";
import { IoClose } from "react-icons/io5";
import { formatearDinero } from "../helpers/FormatearDinero";
import { useGasto } from "../context/GastosContext";
import useLoading from "../helpers/useLoading";
import { Skeleton } from "../components/ui/Skeleton";
import { tiposDePagos } from "../../src/data/TiposDePagos";

dayjs.extend(utc);

export function PageCrearGasto() {
  const { proveedores, getProveedores } = useProveedor();
  const { categorias, getCategorias } = useCategoria();
  const { createGasto } = useGasto();

  const { register, handleSubmit, control } = useForm();

  //obtener datos
  useEffect(() => {
    getProveedores();
    getCategorias();
  }, []);

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
      const productData = {
        ...formData,
        total: totalImportes,
        total_final: totalFinal,
        descuentos_total: totalDescuentos,
        impuestos_total: totalImpuestos,
        detalles: detalles,
        comprobante: imageURL,
        date: dayjs.utc(formData.date).format(),
      };

      await createGasto(productData);
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

  const [detalles, setDetalles] = useState([
    {
      id: uuidv4(),
      descripcion: "",
      cantidad: "",
      unidad: "",
      precio: "",
      precioBruto: "",
      descuento: "",
      impuesto: "",
      importe: "",
    },
  ]);

  console.log(detalles);

  const handleAddDetalle = () => {
    const newDetalle = {
      id: uuidv4(),
      descripcion: "",
      cantidad: "",
      unidad: "",
      precio: "",
      precioBruto: "",
      descuento: "",
      impuesto: "",
      importe: "",
    };
    setDetalles([...detalles, newDetalle]);
  };

  const handleDeleteDetalle = (id) => {
    const updatedDetalles = detalles.filter((detalle) => detalle.id !== id);
    setDetalles(updatedDetalles);
  };

  const handleChange = (id, field, value) => {
    const updatedDetalles = detalles.map((detalle) =>
      detalle.id === id ? { ...detalle, [field]: value } : detalle
    );
    setDetalles(updatedDetalles);
  };

  console.log(detalles);
  // Calcular el total de los importes
  const totalImportes = detalles.reduce((total, detalle) => {
    return total + parseFloat(detalle.precioBruto);
  }, 0);

  const totalDescuentos = detalles.reduce((total, detalle) => {
    return total + parseFloat(detalle.descuento);
  }, 0);

  const totalImpuestos = detalles.reduce((total, detalle) => {
    const precioBruto = parseFloat(detalle.precioBruto);
    const impuestoPorcentaje = parseFloat(detalle.impuesto) / 100; // Convertir el impuesto a porcentaje decimal
    const impuestoCalculado = precioBruto * impuestoPorcentaje;
    return total + impuestoCalculado;
  }, 0);

  // Calcular el total final con impuestos incluidos y descuentos aplicados
  const totalFinal = detalles.reduce((total, detalle) => {
    const precioBruto = parseFloat(detalle.precioBruto);
    const precioConDescuento = precioBruto; // Aplicar descuento al precio bruto

    const impuestoPorcentaje = parseFloat(detalle.impuesto) / 100; // Convertir el impuesto a porcentaje decimal
    const impuestoCalculado = precioConDescuento * impuestoPorcentaje;
    const precioFinal =
      Number(precioConDescuento) +
      Number(impuestoCalculado) +
      Number(detalle.importe) -
      Number(detalle.descuento); // Precio final con impuesto incluido

    return total + precioFinal;
  }, 0);

  //skeleton
  const loading = useLoading(3000); // 3000ms = 3 seconds

  if (loading) {
    return <Skeleton />;
  }

  return (
    <section>
      <div>
        <Navegacion>
          <div className="flex">
            <NavegacionLink
              link={"/gastos"}
              estilos={
                "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5 z-[100]"
              }
            >
              Gastos
            </NavegacionLink>
            <NavegacionLink
              link={"/crear-gasto"}
              estilos={
                "bg-orange-500 text-white text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
              }
            >
              Crear nuevo gasto
            </NavegacionLink>
          </div>
          <div className="px-5 flex gap-2">
            <Link
              to={"/crear-gasto"}
              className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow hover:bg-blue-500 transition-all"
            >
              Crear nuevo gasto
            </Link>
            <Link
              to={"/crear-gasto"}
              className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow transition-all hover:bg-blue-500"
            >
              Crear categorias gastos
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="w-full mx-auto flex gap-2">
                      <Controller
                        name="empresa_proveedor"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={proveedores.map((option) => ({
                              value: option.nombre,
                              label: option.nombre,
                            }))} // Asegúrate de que options tenga las propiedades value y label
                            classNamePrefix="react-select"
                            className="w-full"
                            placeholder="Buscar o seleccionar proveedor"
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                textTransform: "capitalize",
                                padding: "5px 0px",
                                borderRadius: "none",
                                color: "#4A5568",
                                backgroundColor: "#F7FAFC",
                                padding: "0.35rem 0.75rem",
                                borderColor: state.isFocused
                                  ? "#3b82f6"
                                  : "#E2E8F0",
                                boxShadow: state.isFocused
                                  ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                                  : null,
                                transition: "all 0.2s ease",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }),
                              placeholder: (provided) => ({
                                ...provided,
                                color: "#A0AEC0",
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                color: "#4A5568",
                              }),
                              menu: (provided) => ({
                                ...provided,
                                fontSize: "11px",
                                fontWeight: "bold",
                                borderRadius: "none",
                                padding: 0,
                                margin: 0,
                                textTransform: "capitalize",
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected
                                  ? "#3b82f6"
                                  : state.isFocused
                                  ? "#E2E8F0"
                                  : null,
                                color: state.isSelected ? "#FFFFFF" : "#4A5568",
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
                      <input
                        {...register("numero_factura", { required: true })}
                        className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
                      />
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
                          {...register("fecha", { required: true })}
                          type="date"
                          className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-semibold text-sm text-gray-700">
                          Fecha de vencimiento
                        </label>
                        <input
                          {...register("fecha_vencimiento", { required: true })}
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
                        <select
                          {...register("terminos_pago", { required: true })}
                          className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold capitalize"
                        >
                          <option className="capitalize font-bold text-blue-500">
                            Seleccionar termino
                          </option>
                          {tiposDePagos.map((pago) => (
                            <option
                              className="capitalize font-semibold"
                              key={pago.id}
                              value={pago.nombre}
                            >
                              {pago.nombre}
                            </option>
                          ))}
                          {/* <option value="efectivo">Efectivo</option>
                          <option value="transferencia">Transferencia</option>
                          <option value="cheque a terceros">
                            Cheque a terceros
                          </option>
                          <option value="chequeres">Cheque</option>
                          <option value="tarjetas">Tarjeta</option> */}
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
                                options={categorias.map((option) => ({
                                  value: option.nombre,
                                  label: option.nombre,
                                }))} // Asegúrate de que options tenga las propiedades value y label
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
                                    textTransform: "capitalize",
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-full w-full border-t-[2px] border-blue-200 border-dashed mt-5">
                  <div>
                    <p className="text-base mt-3 font-medium text-gray-600">
                      Detalles del gasto
                    </p>
                  </div>

                  <div className="mt-3">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Descripción
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Cantidad
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Unidad
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Precio
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Precio bruto
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Dto. (%)
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Impuesto
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Importe
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Acciones</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detalles.map((detalle) => (
                          <tr key={detalle.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <textarea
                                type="text"
                                value={detalle.descripcion}
                                onChange={(e) =>
                                  handleChange(
                                    detalle.id,
                                    "descripcion",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-2 focus:border-blue-500 outline-none w-full text-xs font-semibold text-gray-700"
                                placeholder="Descripción"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={detalle.cantidad}
                                onChange={(e) =>
                                  handleChange(
                                    detalle.id,
                                    "cantidad",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-2 focus:border-blue-500 outline-none w-full text-xs font-semibold text-gray-700"
                                placeholder="Cantidad"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                type="text"
                                value={detalle.unidad}
                                onChange={(e) =>
                                  handleChange(
                                    detalle.id,
                                    "unidad",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 px-2 py-2 focus:border-blue-500 outline-none w-full text-xs font-semibold text-gray-700 scroll-bar"
                              >
                                <option className="font-bold text-blue-500">
                                  Tipo Und
                                </option>
                                <option value="unidad">Unidades</option>
                                <option value="kilometros">Kilometros</option>
                                <option value="kilogramos">Kilogramos</option>
                                <option value="metros">Metros</option>
                                <option value="litros">Litros</option>
                                <option value="centimetros">Centímetros</option>
                                <option value="millas">Millas</option>
                                <option value="pulgadas">Pulgadas</option>
                                <option value="libras">Libras</option>
                                <option value="toneladas">Toneladas</option>
                                <option value="galones">Galones</option>
                                <option value="metros_cuadrados">
                                  Metros cuadrados
                                </option>
                                <option value="metros_cubicos">
                                  Metros cúbicos
                                </option>
                                <option value="litros_por_minuto">
                                  Litros por minuto
                                </option>
                                <option value="kilowatts">Kilowatts</option>
                                <option value="gramos">Gramos</option>
                                <option value="mililitros">Mililitros</option>
                                <option value="hectáreas">Hectáreas</option>
                                <option value="pie_cúbico">Pies cúbicos</option>
                                <option value="toneladas_cortas">
                                  Toneladas cortas
                                </option>
                                <option value="toneladas_largas">
                                  Toneladas largas
                                </option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={detalle.precio}
                                onChange={(e) =>
                                  handleChange(
                                    detalle.id,
                                    "precio",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-2 focus:border-blue-500 outline-none w-full text-xs font-semibold text-gray-700"
                                placeholder="Precio"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={detalle.precioBruto}
                                onChange={(e) =>
                                  handleChange(
                                    detalle.id,
                                    "precioBruto",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-2 focus:border-blue-500 outline-none w-full text-xs font-semibold text-gray-700"
                                placeholder="Precio bruto"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={detalle.descuento}
                                onChange={(e) =>
                                  handleChange(
                                    detalle.id,
                                    "descuento",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-2 focus:border-blue-500 outline-none w-full text-xs font-semibold text-gray-700"
                                placeholder="Descuento (%)"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={detalle.impuesto}
                                onChange={(e) =>
                                  handleChange(
                                    detalle.id,
                                    "impuesto",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-2 focus:border-blue-500 outline-none w-full text-xs font-semibold text-gray-700"
                                placeholder="Impuesto"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={detalle.importe}
                                onChange={(e) =>
                                  handleChange(
                                    detalle.id,
                                    "importe",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-2 focus:border-blue-500 outline-none w-full text-xs font-semibold text-gray-700"
                                placeholder="Importe"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => handleDeleteDetalle(detalle.id)}
                                className="text-red-600 hover:text-red-900 font-bold"
                              >
                                <IoClose className="bg-red-100 py-2 px-2 text-3xl" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleAddDetalle}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-500"
                      >
                        Agregar nuevo detalle
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100/40 w-full h-full  mt-5 flex justify-between">
                  <div className="flex flex-col gap-2 py-5 px-12">
                    <p className="text-gray-700 text-sm font-bold">
                      Total del gasto
                    </p>
                    <p className="text-blue-700 text-xl font-bold">
                      {formatearDinero(totalImportes || 0)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 py-5">
                    <p className="text-gray-700 text-sm font-bold">Impuestos</p>
                    <p className="text-blue-700 text-xl font-bold">
                      {formatearDinero(totalImpuestos || 0)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 py-5">
                    <p className="text-gray-700 text-sm font-bold">
                      Descuentos
                    </p>
                    <p className="text-blue-700 text-xl font-bold">
                      {formatearDinero(totalDescuentos || 0)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 bg-blue-950 py-3 px-10">
                    <p className="text-orange-300 text-sm font-bold">
                      Total final
                    </p>
                    <p className="text-white text-xl font-bold">
                      {formatearDinero(totalFinal || 0)}
                    </p>
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

      {/* MODAL CREAR VALORES  */}
      <ModalCrearProveedor />
      <ModalCrearCategoria />
    </section>
  );
}
