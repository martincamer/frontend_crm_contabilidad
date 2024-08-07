import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "../../components/ui/FormInput";
import { FormInputDate } from "../../components/ui/FormInputDate";
import { SelectInput } from "../../components/ui/SelectInput";
import { Submit } from "../../components/ui/Submit";
import { useEmpleado } from "../../context/EmpleadosContext";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { Texto } from "../../components/ui/Texto";
import { IoAdd } from "react-icons/io5";
import dayjs from "dayjs";

export const ModalCrearEmpleadoMobile = () => {
  const { register, handleSubmit, watch } = useForm();

  const { createEmpleado, getSectores, getFabricas, fabricas, sectores } =
    useEmpleado();

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    getSectores();
    getFabricas();
  }, []);

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
  const estado = watch("estado");
  const aguinaldo_proporcional = watch("aguinaldo_proporcional");

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
      (0.01 * Number(antiquity.years));
  }

  //totales
  const totalQuincenaCinco =
    Number(quincena_cinco) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) -
    Number(descuento_del_cinco) -
    Number(Number(banco));
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
    Number(descuento_del_cinco);

  const totalSueldoNetoConDescuentos =
    Number(sueldo_basico) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) +
    Number(comida) -
    Number(descuento_del_cinco) -
    Number(Number(banco));

  const totalSueldo =
    Number(quincena_cinco) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) +
    Number(quincena_veinte) +
    Number(comida) -
    Number(descuento_del_veinte) -
    Number(descuento_del_cinco);

  // Crear nuevo empleado
  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const clienteData = {
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
                      quincena_cinco: quincena_cinco || 0,
                      otros: otros || 0,
                      premio_produccion: premio_produccion || 0,
                      premio_asistencia: premio_asistencia || 0,
                      banco: banco || 0,
                      descuento_del_cinco: descuento_del_cinco || 0,
                      observacion_cinco: observacion_cinco || "",
                    },
                  ],
                },
                {
                  quincena_veinte: [
                    {
                      quincena_veinte: quincena_veinte || 0,
                      comida: comida || 0,
                      descuento_del_veinte: descuento_del_veinte || 0,
                      observacion_veinte: observacion_veinte || 0,
                    },
                  ],
                },
              ]
            : [
                {
                  sueldo_basico: sueldo_basico || 0,
                  otros: otros || 0,
                  premio_produccion: premio_produccion || 0,
                  premio_asistencia: premio_asistencia || 0,
                  comida: comida || 0,
                  banco: banco || 0,
                  descuento_del_cinco: descuento_del_cinco || 0,
                  observacion: observacion || "",
                },
              ],
        date: dayjs.utc(formData.date).format(),
      };

      await createEmpleado(clienteData);
      document.getElementById("my_modal_crear_empleado").close();
    } catch (error) {}
  };

  return (
    <dialog id="my_modal_crear_empleado" className="modal">
      <div className="modal-box rounded-none w-full h-full max-h-full">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="px-0 py-5 w-full min-h-full bg-white flex flex-col gap-5">
          <div>
            <p className="font-bold text-xl text-blue-500 border-b-2 pb-1 border-orange-500">
              Crear nuevo del empleado.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="font-bold text-sm mb-3">
              <p>Datos del empleador</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
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
              <div className="flex gap-2 items-center">
                <SelectInput
                  labelText={"Sector de trabajo"}
                  type={"text"}
                  props={{
                    ...register("sector_trabajo", { required: true }),
                  }}
                >
                  <option className="font-bold text-blue-500">
                    Seleccionar sector
                  </option>
                  {sectores.map((s, index) => (
                    <option
                      key={index}
                      className="font-semibold text-black"
                      value={s.nombre}
                    >
                      {s.nombre}
                    </option>
                  ))}
                </SelectInput>
                <div
                  onClick={() => {
                    document
                      .getElementById("my_modal_crear_sectores")
                      .showModal();
                  }}
                  className="flex justify-center items-center h-auto"
                >
                  <IoAdd className="text-3xl bg-blue-100/30 py-1 px-1 text-blue-500 cursor-pointer border" />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <SelectInput
                  labelText={"Fabrica o sucursal"}
                  type={"text"}
                  props={{
                    ...register("fabrica_sucursal", { required: true }),
                  }}
                >
                  <option className="font-bold text-blue-500">
                    Seleccionar fabrica/sucursal
                  </option>
                  {fabricas.map((s, index) => (
                    <option
                      key={index}
                      className="font-semibold text-black"
                      value={s.nombre}
                    >
                      {s.nombre}
                    </option>
                  ))}
                </SelectInput>
                <div
                  onClick={() => {
                    document
                      .getElementById("my_modal_crear_fabrica")
                      .showModal();
                  }}
                  className="flex justify-center items-center h-auto"
                >
                  <IoAdd className="text-3xl bg-blue-100/30 py-1 px-1 text-blue-500 cursor-pointer border" />
                </div>
              </div>
            </div>
            {termino_pago === "quincenal" ? (
              <>
                <div className="font-bold text-sm mb-3 mt-5">
                  <p>Datos de la quincena del cinco</p>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-5">
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
                  {sector_trabajo === "armado" ? (
                    ""
                  ) : (
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
                            {formatearDinero(Number(premio_produccion) || 0)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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
                          {formatearDinero(Number(premio_asistencia) || 0)}
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
                          {formatearDinero(Number(descuento_del_cinco) || 0)}
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
                <div className="grid grid-cols-1 gap-3 mb-5">
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
                          {formatearDinero(Number(descuento_del_veinte) || 0)}
                        </p>
                      </div>
                    )}
                  </div>
                  {sector_trabajo === "gerente" && (
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
                            {formatearDinero(Number(premio_produccion) || 0)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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

                <div className="font-semibold bg-blue-100/50 text-blue-500 py-5 px-5 flex flex-col gap-2">
                  <p className="flex gap-2 items-center">
                    Total a cobrar quincena del 5{" "}
                    <span className="font-extrabold bg-white py-1 px-2">
                      {formatearDinero(totalQuincenaCinco)}
                    </span>
                  </p>
                  <p className="flex gap-2 items-center">
                    Total a cobrar quincena del 20{" "}
                    <span className="font-extrabold bg-white py-1 px-2">
                      {formatearDinero(totalQuincenaVeinte)}
                    </span>
                  </p>
                  <p className="flex gap-2 items-center">
                    Sueldo neto
                    <span className="font-extrabold bg-white py-1 px-2">
                      {" "}
                      {formatearDinero(totalSueldo)}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="font-bold text-sm mb-3 mt-5">
                  <p>Datos del sueldo mensual</p>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-5">
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
                          {formatearDinero(Number(premio_asistencia) || 0)}
                        </p>
                      </div>
                    )}
                  </div>

                  {sector_trabajo === "gerente" && (
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
                            {formatearDinero(Number(premio_produccion) || 0)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {sector_trabajo === "producción" && (
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
                            {formatearDinero(Number(premio_produccion) || 0)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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
                          {formatearDinero(Number(descuento_del_cinco) || 0)}
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

                <div className="font-semibold bg-blue-100/50 text-blue-500 py-5 px-5 flex flex-col gap-2">
                  <p className="flex gap-2 items-center">
                    Total a cobrar{" "}
                    <span className="font-extrabold bg-white py-1 px-2">
                      {formatearDinero(totalSueldoNetoConDescuentos)}
                    </span>
                  </p>
                  <p className="flex gap-2 items-center">
                    Sueldo neto
                    <span className="font-extrabold bg-white py-1 px-2">
                      {" "}
                      {formatearDinero(totalSueldoNeto)}
                    </span>
                  </p>
                </div>
              </>
            )}

            <div className="mb-5">
              <Submit>Guardar el empleado</Submit>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};
