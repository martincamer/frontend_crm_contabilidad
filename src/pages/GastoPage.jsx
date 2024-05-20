import { useEffect, useState } from "react";
import { useGasto } from "../context/GastosContext";
import { useParams } from "react-router-dom";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { BreadCrumbs } from "../components/ui/BreadCrumbs";
import { LinkBreadCrumbs } from "../components/ui/LinkBreadCrumbs";
import { updateFecha } from "../helpers/FechaUpdate";
import { formatearDinero } from "../helpers/FormatearDinero";

export const GastoPage = () => {
  const params = useParams();
  const [gasto, setGasto] = useState([]);
  const { getGasto } = useGasto();

  useEffect(() => {
    async function loadData() {
      const res = await getGasto(params.id);

      setGasto(res);
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

  const isPDF = gasto?.comprobante?.toLowerCase().endsWith(".pdf");

  return (
    <section>
      <Navegacion>
        <div className="flex">
          <NavegacionLink
            link={"/gastos"}
            estilos={
              "text-orange-400 bg-orange-50 text-white font-semibold h-10 flex items-center px-5"
            }
          >
            Gastos
          </NavegacionLink>
          <NavegacionLink
            link={`/gasto/${params.id}`}
            estilos={
              "bg-orange-500 text-white text-white font-semibold h-10 flex items-center px-5 z-[100]"
            }
          >
            Detalles del gasto
          </NavegacionLink>
        </div>
        <BreadCrumbs>
          <LinkBreadCrumbs link={"home"}>Inicio</LinkBreadCrumbs>
          <LinkBreadCrumbs link={"gastos"}>Gastos</LinkBreadCrumbs>
        </BreadCrumbs>
      </Navegacion>

      <div className="flex my-10 mx-10">
        <div className="bg-white py-5 px-5">
          <p className="font-bold text-blue-500">
            Detalles del gasto obtenido / referencia{" "}
            {truncateText(gasto?._id, 6)}
          </p>
        </div>
      </div>

      <div className="mx-10 w-1/2">
        <div className="bg-white py-5 px-5 flex flex-col gap-4">
          <p className="font-bold text-gray-600">Resumen del gasto</p>

          <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-orange-500 flex gap-2">
                Empresa/proveedor{" "}
                <span className="font-bold capitalize text-gray-600">
                  {gasto?.empresa_proveedor?.value}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                N° de factura/gasto{" "}
                <span className="font-bold capitalize text-gray-600">
                  {gasto?.numero_factura}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Termino del pago{" "}
                <span className="font-bold capitalize text-gray-600">
                  {gasto?.terminos_pago}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Categoria{" "}
                <span className="font-bold capitalize text-gray-600">
                  {gasto?.categoria?.value}
                </span>
              </p>
            </div>
            {/* //col 2  */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-orange-500 flex gap-2">
                Fecha{" "}
                <span className="font-bold capitalize text-gray-600">
                  {updateFecha(gasto?.fecha)}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2">
                Fecha de vencimiento{" "}
                <span className="font-bold capitalize text-gray-600">
                  {updateFecha(gasto?.fecha_vencimiento)}
                </span>
              </p>

              <p className="font-medium text-orange-500 flex gap-2 items-center">
                Estado{" "}
                <span
                  className={`font-semibold capitalize ${
                    gasto.estado === "aceptado"
                      ? "text-green-600 bg-green-100 py-1 px-2 rounded"
                      : gasto.estado === "pendiente"
                      ? "text-orange-600 bg-orange-100 py-1 px-2 rounded"
                      : gasto.estado === "rechazado"
                      ? "text-red-600 bg-red-100 py-1 px-2 rounded"
                      : "text-gray-600"
                  }`}
                >
                  {gasto?.estado}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-10 my-10 w-1/2">
        <div className="bg-white py-5 px-5 flex flex-col gap-4">
          <p className="font-bold text-gray-600">Resumen del gasto</p>

          <div className="flex flex-wrap gap-5">
            <p className="font-medium text-orange-500 flex gap-2">
              Total{" "}
              <span className="font-bold capitalize text-gray-600">
                {formatearDinero(gasto?.total)}
              </span>
            </p>

            <p className="font-medium text-orange-500 flex gap-2">
              Impuestos{" "}
              <span className="font-bold capitalize text-gray-600">
                {formatearDinero(gasto?.impuestos_total)}
              </span>
            </p>

            <p className="font-medium text-orange-500 flex gap-2">
              Descuentos{" "}
              <span className="font-bold capitalize text-gray-600">
                {formatearDinero(gasto?.descuentos_total)}
              </span>
            </p>

            <p className="font-medium text-orange-500 flex gap-2">
              Total bruto{" "}
              <span className="font-extrabold capitalize text-gray-600">
                {formatearDinero(gasto?.total_final)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white w-1/2 py-5 px-5 mx-10 flex flex-col items-start gap-5">
        <p className="font-bold text-gray-600">Comprobante del gasto</p>
        <div className="bg-white w-1/2 py-5 px-5 mx-10 flex flex-col items-start gap-5">
          {isPDF ? (
            <>
              <iframe
                className="w-full h-64"
                src={gasto?.comprobante}
                title="Comprobante PDF"
              ></iframe>
              <a
                href={gasto?.comprobante}
                download
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-full font-semibold text-sm hover:bg-orange-500 focus:outline-none"
              >
                Descargar Archivo
              </a>
            </>
          ) : (
            <img
              className="w-auto h-auto"
              src={gasto?.comprobante}
              alt="Comprobante"
            />
          )}
        </div>
      </div>

      <div className="bg-white py-5 px-5 mx-10 my-10">
        <table className="table">
          <thead>
            <tr className="text-gray-800">
              <th>Descripcion</th>
              <th>Cantidad/Unidad</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Iva/Impuesto</th>
              <th>Descuentos</th>
              <th>Importes/extras</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody className="text-xs capitalize">
            {gasto?.detalles?.map((g, index) => (
              <tr key={index}>
                <th>{g.descripcion}</th>
                <th>{g.cantidad}</th>
                <th>{g.unidad}</th>
                <th>{formatearDinero(Number(g.precio))}</th>
                <th>{formatearDinero(Number(g.impuesto))}</th>
                <th>{formatearDinero(Number(g.descuento))}</th>
                <th>{formatearDinero(Number(g.importe))}</th>
                <th className="text-blue-500 font-extrabold">
                  {formatearDinero(Number(g.precioBruto))}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
