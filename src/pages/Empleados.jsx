import React, { useState } from "react";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { FormInput } from "../components/ui/FormInput";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { FormInputDate } from "../components/ui/FormInputDate";
import { SelectInput } from "../components/ui/SelectInput";
import { Submit } from "../components/ui/Submit";
import { formatearDinero } from "../helpers/FormatearDinero";
import { Texto } from "../components/ui/Texto";

export const Empleados = () => {
  const { register, handleSubmit, watch } = useForm();

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

  console.log(antiquity);

  const total_antiguedad =
    Number(Number(quincena_cinco) + Number(quincena_veinte)) *
    (0.01 * antiquity.years);

  console.log(total_antiguedad);

  const onSubmit = async (formData) => {
    try {
      // Subimos la imagen a Cloudinary y obtenemos la URL

      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const clienteData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
      };

      //   await createCliente(clienteData);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  //totales
  const totalQuincenaCinco =
    Number(quincena_cinco) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) -
    Number(descuento_del_cinco) -
    Number(banco);

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
              <div className="p-4 w-1/3 min-h-full bg-white flex flex-col gap-5">
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
                  </div>
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
                            {formatearDinero(Number(premio_produccion) || 0)}
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
                        ...register("observacion", {
                          required: true,
                        }),
                      }}
                      labelText={"Observación"}
                    />
                  </div>

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
                  <div>
                    <Submit>Registrar nuevo empleado</Submit>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Navegacion>
    </section>
  );
};
