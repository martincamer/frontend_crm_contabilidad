import React, { useEffect, useState } from "react";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { useForm } from "react-hook-form";
import { useEmpleado } from "../context/EmpleadosContext";
import { TableEmpleados } from "../components/empleados/TableEmpleados";
import dayjs from "dayjs";
import { TableEmpleadosAguinaldo } from "../components/empleados/TableEmpleadosAguinaldo";

export const EmpleadosAguinaldo = () => {
  const { register, handleSubmit, watch } = useForm();

  const { createEmpleado, sectores, getSectores, fabricas, getFabricas } =
    useEmpleado();

  useEffect(() => {
    getSectores();
    getFabricas();
  }, []);

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  // Totales
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

  // Calcular la edad
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

  // Totales
  const totalQuincenaCinco =
    Number(quincena_cinco) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) -
    Number(descuento_del_cinco) -
    Number(banco);

  // Totales
  const totalQuincenaVeinte =
    Number(quincena_veinte) + Number(comida) - Number(descuento_del_veinte);

  // Totales
  const totalSueldoNeto =
    Number(sueldo_basico) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) +
    Number(comida) -
    Number(descuento_del_cinco);

  // Totales
  const totalSueldoNetoConDescuentos =
    Number(sueldo_basico) +
    Number(otros) +
    Number(premio_produccion) +
    Number(premio_asistencia) +
    Number(total_antiguedad) +
    Number(comida) -
    Number(descuento_del_cinco) -
    Number(banco);

  // Totales
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
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <section>
      <Navegacion>
        <div className="">
          <NavegacionLink
            link={"/empleados-aguinaldo"}
            estilos={
              "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5"
            }
          >
            Empleados aguinaldo
          </NavegacionLink>
        </div>
      </Navegacion>
      <TableEmpleadosAguinaldo />
    </section>
  );
};
