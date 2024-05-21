import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { BreadCrumbs } from "../components/ui/BreadCrumbs";
import { LinkBreadCrumbs } from "../components/ui/LinkBreadCrumbs";
import { updateFecha } from "../helpers/FechaUpdate";
import { formatearDinero } from "../helpers/FormatearDinero";
import { useIngreso } from "../context/IngresosContext";

export const IngresoPage = () => {
  const params = useParams();
  const [ingreso, setIngreso] = useState([]);
  const { getIngreso } = useIngreso();

  useEffect(() => {
    async function loadData() {
      const res = await getIngreso(params.id);

      setIngreso(res);
    }

    loadData();
  }, [params.id]);

  //truncate ID
  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) {
      return text;
    }
    return text?.substring(0, maxLength);
  };

  const isPDF = ingreso?.comprobante?.toLowerCase().endsWith(".pdf");

  return (
    <section>
      <Navegacion>
        <div className="flex">
          <NavegacionLink
            link={"/ingresos"}
            estilos={
              "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5"
            }
          >
            Ingresos
          </NavegacionLink>
          <NavegacionLink
            link={`/ingreso/${params.id}`}
            estilos={
              "bg-orange-500 text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
            }
          >
            Detalles del ingreso
          </NavegacionLink>
        </div>
        <BreadCrumbs>
          <LinkBreadCrumbs link={"home"}>Inicio</LinkBreadCrumbs>
          <LinkBreadCrumbs link={"ingresos"}>Ingresos</LinkBreadCrumbs>
        </BreadCrumbs>
      </Navegacion>

      <div className="flex my-10 mx-10">
        <div className="bg-white py-5 px-5">
          <p className="font-bold text-blue-500">
            Detalles del ingreso obtenido / referencia{" "}
            {truncateText(ingreso?._id, 6)}
          </p>
        </div>
      </div>

      <div className="mx-10 w-1/2">
        <div className="bg-white py-5 px-5 flex flex-col gap-4">
          <p className="font-bold text-gray-600">Resumen del gasto</p>

          <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-orange-500 flex gap-2">
                Termino del pago{" "}
                <span className="font-bold capitalize text-gray-600">
                  {ingreso?.terminos_pago}
                </span>
              </p>
            </div>
            {/* //col 2  */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-orange-500 flex gap-2">
                Fecha{" "}
                <span className="font-bold capitalize text-gray-600">
                  {updateFecha(ingreso?.fecha)}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Fecha de vencimiento{" "}
                <span className="font-bold capitalize text-gray-600">
                  {updateFecha(ingreso?.fecha_vencimiento)}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2 items-center">
                Estado{" "}
                <span
                  className={`font-semibold capitalize ${
                    ingreso.estado === "aceptado"
                      ? "text-green-600 bg-green-100 py-1 px-2 rounded"
                      : ingreso.estado === "pendiente"
                      ? "text-orange-600 bg-orange-100 py-1 px-2 rounded"
                      : ingreso.estado === "rechazado"
                      ? "text-red-600 bg-red-100 py-1 px-2 rounded"
                      : "text-gray-600"
                  }`}
                >
                  {ingreso?.estado}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-10 my-10 w-1/2">
        <div className="bg-white py-5 px-5 flex flex-col gap-4">
          <p className="font-bold text-gray-600">Resumen del ingreso</p>

          <div className="flex flex-wrap gap-5">
            <p className="font-medium text-orange-500 flex gap-2">
              Total{" "}
              <span className="font-bold capitalize text-gray-600">
                {formatearDinero(ingreso?.total_ingreso)}
              </span>
            </p>

            <p className="font-medium text-orange-500 flex gap-2">
              Total bruto{" "}
              <span className="font-extrabold capitalize text-gray-600">
                {formatearDinero(ingreso?.total_ingreso)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white w-1/2 py-5 px-5 mx-10 flex flex-col items-start gap-5">
        <p className="font-bold text-gray-600">Comprobante del ingreso</p>
        <div className="bg-white w-1/2 py-5 px-5 mx-10 flex flex-col items-start gap-5">
          {isPDF ? (
            <>
              <iframe
                className="w-full h-64"
                src={ingreso?.comprobante}
                title="Comprobante PDF"
              ></iframe>
              <a
                href={ingreso?.comprobante}
                download
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-full font-semibold text-sm hover:bg-orange-500 focus:outline-none"
              >
                Descargar Archivo
              </a>
            </>
          ) : (
            <img
              className="w-auto h-auto"
              src={ingreso?.comprobante}
              alt="Comprobante"
            />
          )}
        </div>
      </div>
    </section>
  );
};
