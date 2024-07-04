import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { ComprobanteRecursosHumanos } from "../comprobantes/ComprobanteRecursosHumanos";

export const ModalDocumentoRecursosHumanos = ({ empleados }) => {
  function agruparEmpleados(datos) {
    // Objeto para almacenar los datos agrupados
    let agrupados = {};

    // Verificar si datos?.empleados es un array y si tiene elementos
    if (Array.isArray(empleados) && datos.length > 0) {
      datos?.forEach((empleado) => {
        // Obtener la fábrica y el tipo de pago del empleado
        const fabrica = empleado?.fabrica_sucursal;
        const tipoPago = empleado?.termino_pago;

        // Verificar si la fábrica ya está en el objeto agrupados
        if (!agrupados[fabrica]) {
          agrupados[fabrica] = {
            fabrica_sucursal: fabrica,
            empleados: [],
          };
        }

        // Agregar empleado al arreglo
        agrupados[fabrica].empleados.push({
          nombre: empleado?.nombre,
          apellido: empleado?.apellido,
          dni: empleado?.dni,
          fecha_ingreso: empleado?.fecha_ingreso,
          sector_trabajo: empleado?.sector_trabajo,
          termino_pago: tipoPago,
          fecha: empleado.date,
          sueldo:
            tipoPago === "mensual" ? empleado?.sueldo[0] : empleado?.sueldo,
        });
      });
    }

    // Convertir el objeto agrupados a un array y retornarlo
    return Object.values(agrupados);
  }

  // Llamar a la función y obtener el resultado
  const resultado = agruparEmpleados(empleados);

  return (
    <dialog id="my_modal_recursos_humanos" className="modal">
      <div className="modal-box rounded-none w-full max-w-6xl scroll-bar">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="w-full h-full">
          <PDFViewer
            style={{
              width: "100%",
              height: "100vh",
            }}
          >
            <ComprobanteRecursosHumanos empleados={resultado} />
          </PDFViewer>
        </div>
      </div>
    </dialog>
  );
};
