import React, { useState } from "react";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { FormInput } from "../components/ui/FormInput";
import { useForm } from "react-hook-form";
import { FormInputDate } from "../components/ui/FormInputDate";
import { SelectInput } from "../components/ui/SelectInput";
import { Submit } from "../components/ui/Submit";
import { useEmpleado } from "../context/EmpleadosContext";
import { formatearDinero } from "../helpers/FormatearDinero";
import { Texto } from "../components/ui/Texto";
import dayjs from "dayjs";
import { TableEmpleados } from "../components/empleados/TableEmpleados";

export const Empleados = () => {
  const { register, handleSubmit, watch } = useForm();

  const { createEmpleado } = useEmpleado();

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const quincena_cinco = watch("quincena_del_cinco");
  const quincena_veinte = watch("quincena_del_veinte");
  const otros = watch("otros");
  const premio_produccion = watch("premio_produccion");
  const premio_asistencia = watch("premio_asistencia");
  const banco = watch("banco");
  const descuento_del_cinco = watch("descuento_del_cinco");
  const fecha_ingreso = watch("fecha_ingreso");
  const descuento_del_veinte = watch("descuento_del_veinte");
  const comida = watch("comida");
  const termino_pago = watch("termino_pago");
  const sueldo_basico = watch("sueldo_basico");
  const observacion_cinco = watch("observacion_del_cinco");
  const observacion_veinte = watch("observacion_del_veinte");
  const observacion = watch("observacion");
  const nombre = watch("nombre");
  const apellido = watch("apellido");
  const dni = watch("dni");
  const fecha_nacimiento = watch("fecha_nacimiento");
  const sector_trabajo = watch("sector_trabajo");
  const fabrica_sucursal = watch("fabrica_sucursal");

  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
  };

  const antiquity = calculateAntiquity(fecha_ingreso);

  let total_antiguedad = 0;

  if (termino_pago === "mensual") {
    total_antiguedad = Number(sueldo_basico) * (0.01 * antiquity.years);
  } else {
    total_antiguedad =
      (Number(quincena_cinco) + Number(quincena_veinte)) *
      (0.01 * antiquity.years);
  }

  //totales
  const totalQuincenaCinco =
    Number(quincena_cinco) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) -
    Number(descuento_del_cinco) -
    Number(banco);
  //totales
  const totalQuincenaVeinte =
    Number(quincena_veinte) + Number(comida) - Number(descuento_del_veinte);

  const totalSueldoNeto =
    Number(sueldo_basico) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) +
    Number(comida) -
    Number(descuento_del_cinco) -
    Number(banco);

  //Crear nuevo empleado
  const onSubmit = async (formData) => {
    try {
      // Subimos la imagen a Cloudinary y obtenemos la URL

      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const clienteData = {
        // ...formData,
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        fecha_ingreso,
        termino_pago,
        fabrica_sucursal,
        sector_trabajo,
        sueldo:
          termino_pago === "quincenal"
            ? [
                {
                  quincena_cinco: [
                    {
                      quincena_cinco: quincena_cinco,
                      otros: otros,
                      premio_produccion: premio_produccion,
                      premio_asistencia: premio_asistencia,
                      banco: banco,
                      descuento_del_cinco: descuento_del_cinco,
                      observacion_cinco: observacion_cinco,
                    },
                  ],
                },
                {
                  quincena_veinte: [
                    {
                      quincena_veinte: quincena_veinte,
                      comida: comida,
                      descuento_del_veinte: descuento_del_veinte,
                      observacion_veinte: observacion_veinte,
                    },
                  ],
                },
              ]
            : [
                {
                  sueldo_basico: sueldo_basico,
                  otros: otros,
                  premio_produccion: premio_produccion,
                  premio_asistencia: premio_asistencia,
                  comida: comida,
                  banco: banco,
                  descuento_del_cinco: descuento_del_cinco,
                  observacion: observacion,
                },
              ],
        date: dayjs.utc(formData.date).format(),
      };

      await createEmpleado(clienteData);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <section>
      <Navegacion>
        <div>
          <NavegacionLink
            link={"/empleados"}
            estilos={
              "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5"
            }
          >
            Empleados
          </NavegacionLink>
        </div>
        <div className="px-5 flex gap-6 items-center">
          <div className="drawer drawer-end z-[999]">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label
                htmlFor="my-drawer-4"
                className="bg-orange-500 text-white font-semibold text-sm rounded-full py-1.5 px-5 hover:shadow hover:bg-blue-500 transition-all cursor-pointer"
              >
                Crear empleado
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer-4"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <div className="p-4 w-1/2 min-h-full bg-white flex flex-col gap-5">
                <div>
                  <p className="font-bold text-xl text-blue-500 border-b-2 pb-2 border-orange-500">
                    Registra un nuevo empleado
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="font-bold text-sm mb-3">
                    <p>Datos del empleador</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      labelText={"Nombre"}
                      placeholder={"Escribe el nombre"}
                      type={"text"}
                      props={{ ...register("nombre", { required: true }) }}
                    />
                    <FormInput
                      labelText={"Apellido"}
                      placeholder={"Escribe el apellido"}
                      type={"text"}
                      props={{ ...register("apellido", { required: true }) }}
                    />
                    <FormInput
                      labelText={"Dni"}
                      placeholder={"Escribe el dni"}
                      type={"text"}
                      props={{ ...register("dni", { required: true }) }}
                    />
                    <FormInputDate
                      labelText={"Fecha de Nacimiento"}
                      type={"date"}
                      props={{
                        ...register("fecha_nacimiento", { required: true }),
                      }}
                    />
                    <FormInputDate
                      labelText={"Fecha de Ingreso"}
                      type={"date"}
                      props={{
                        ...register("fecha_ingreso", { required: true }),
                      }}
                    />
                    <SelectInput
                      labelText={"Término de Pago"}
                      placeholder={"Escribe el término de pago"}
                      type={"text"}
                      props={{
                        ...register("termino_pago", { required: true }),
                      }}
                    >
                      <option className="font-bold text-blue-500">
                        Seleccionar pago
                      </option>
                      <option className="font-semibold" value={"quincenal"}>
                        Quincenal
                      </option>
                      <option className="font-semibold" value={"mensual"}>
                        Mensual
                      </option>
                    </SelectInput>
                    <SelectInput
                      labelText={"Sector de trabajo"}
                      type={"text"}
                      props={{
                        ...register("sector", { required: true }),
                      }}
                    >
                      <option className="font-bold text-blue-500">
                        Seleccionar sector
                      </option>
                      <option className="font-semibold" value={"armado"}>
                        Armado
                      </option>
                      <option className="font-semibold" value={"producción"}>
                        Producción
                      </option>
                      <option className="font-semibold" value={"ventas"}>
                        Ventas
                      </option>
                      <option className="font-semibold" value={"contabilidad"}>
                        Contabilidad
                      </option>
                      <option
                        className="font-semibold"
                        value={"administración"}
                      >
                        Administración
                      </option>
                      <option className="font-semibold" value={"gerencia"}>
                        Gerencia
                      </option>
                    </SelectInput>
                    <SelectInput
                      labelText={"Fabrica o sucursal"}
                      type={"text"}
                      props={{
                        ...register("fabrica", { required: true }),
                      }}
                    >
                      <option className="font-bold text-blue-500">
                        Seleccionar sector
                      </option>
                      <option className="font-semibold" value={"long"}>
                        Long
                      </option>
                      <option
                        className="font-semibold"
                        value={"parque industrial"}
                      >
                        Parque industrial
                      </option>
                      <option
                        className="font-semibold"
                        value={"marcos ciani 255"}
                      >
                        Marcos ciani 255
                      </option>
                      <option className="font-semibold" value={"aberturas"}>
                        Aberturas
                      </option>
                    </SelectInput>
                  </div>
                  {termino_pago === "quincenal" ? (
                    <>
                      <div className="font-bold text-sm mb-3 mt-5">
                        <p>Datos de la quincena del cinco</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Quincena del cinco"}
                              placeholder={"Escribe la quincena del 5"}
                              type={"text"}
                              props={{
                                ...register("quincena_del_cinco", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Quincena del cinco
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(quincena_cinco) || 0)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="font-semibold text-xs text-gray-700">
                            Antiguedad total
                          </label>
                          <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                            {formatearDinero(total_antiguedad || 0)}
                          </p>
                        </div>
                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Otros"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("otros", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Otros
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(otros) || 0)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Premio producción"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("premio_produccion", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Premio producción
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(
                                  Number(premio_produccion) || 0
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Premio asistencia"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("premio_asistencia", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Premio asistencia
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(
                                  Number(premio_asistencia) || 0
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Banco"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("banco", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Banco
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(banco) || 0)}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Descuento"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("descuento_del_cinco", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Descuento
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(
                                  Number(descuento_del_cinco) || 0
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                          <label className="font-semibold text-xs text-gray-700">
                            Total de la quincena cierre
                          </label>
                          <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                            {formatearDinero(totalQuincenaCinco || 0)}
                          </p>
                        </div>

                        <Texto
                          props={{
                            ...register("observacion_del_cinco", {
                              required: true,
                            }),
                          }}
                          labelText={"Observación"}
                        />
                      </div>
                      <div className="font-bold text-sm mb-3 mt-5">
                        <p>Datos de la quincena del veinte</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Quincena del veinte"}
                              placeholder={"Escribe la quincena del 20"}
                              type={"text"}
                              props={{
                                ...register("quincena_del_veinte", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Quincena del veinte
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(quincena_veinte) || 0)}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Descuento"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("descuento_del_veinte", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Descuento
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(
                                  Number(descuento_del_veinte) || 0
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Comida"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("comida", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Comida
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(comida) || 0)}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                          <label className="font-semibold text-xs text-gray-700">
                            Total de la quincena veinte cierre
                          </label>
                          <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                            {formatearDinero(totalQuincenaVeinte || 0)}
                          </p>
                        </div>

                        <Texto
                          props={{
                            ...register("observacion_del_veinte", {
                              required: true,
                            }),
                          }}
                          labelText={"Observación"}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-sm mb-3 mt-5">
                        <p>Datos del sueldo mensual</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Sueldo básico"}
                              placeholder={"Escribe el sueldo básico"}
                              type={"text"}
                              props={{
                                ...register("sueldo_basico", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Sueldo básico
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(sueldo_basico) || 0)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="font-semibold text-xs text-gray-700">
                            Antiguedad total
                          </label>
                          <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                            {formatearDinero(total_antiguedad || 0)}
                          </p>
                        </div>
                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Otros"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("otros", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Otros
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(otros) || 0)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Premio producción"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("premio_produccion", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Premio producción
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(
                                  Number(premio_produccion) || 0
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Premio asistencia"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("premio_asistencia", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Premio asistencia
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(
                                  Number(premio_asistencia) || 0
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Comida"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("comida", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Comida
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(comida) || 0)}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Banco"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("banco", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Banco
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(Number(banco) || 0)}
                              </p>
                            </div>
                          )}
                        </div>

                        <div onClick={handleInputClick}>
                          {isEditable ? (
                            <FormInput
                              labelText={"Descuento"}
                              placeholder={"Escribe el valor"}
                              type={"text"}
                              props={{
                                ...register("descuento_del_cinco", {
                                  required: true,
                                }),
                                onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                              }}
                            />
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <label className="font-semibold text-xs text-gray-700">
                                Descuento
                              </label>
                              <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                                {formatearDinero(
                                  Number(descuento_del_cinco) || 0
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                          <label className="font-semibold text-xs text-gray-700">
                            Total del sueldo neto a cobrar
                          </label>
                          <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                            {formatearDinero(totalSueldoNeto || 0)}
                          </p>
                        </div>

                        <Texto
                          props={{
                            ...register("observacion", {
                              required: true,
                            }),
                          }}
                          labelText={"Observación"}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Submit>Registrar nuevo empleado</Submit>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Navegacion>
      <TableEmpleados />
    </section>
  );
};
