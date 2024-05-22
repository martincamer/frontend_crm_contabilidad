import React, { useEffect, useState } from "react";
import { Navegacion } from "../components/ui/Navegacion";
import { NavegacionLink } from "../components/ui/NavegacionLink";
import { LinkBreadCrumbs } from "../components/ui/LinkBreadCrumbs";
import { useParams } from "react-router-dom";
import { useCliente } from "../context/ClientesContext";
import { BreadCrumbs } from "../components/ui/BreadCrumbs";
import { updateFecha } from "../helpers/FechaUpdate";
import { formatearDinero } from "../helpers/FormatearDinero";
import { ModalCuotas } from "../components/clientes/ModalCuotas";
import { ModalEntrega } from "../components/clientes/ModalEntrega";

export const ClientePage = () => {
  const params = useParams();
  const { getCliente, cliente, setCliente } = useCliente();

  useEffect(() => {
    async function loadData() {
      const res = await getCliente(params.id);

      setCliente(res);
    }

    loadData();
  }, [params.id]);

  return (
    <section>
      <Navegacion>
        <div className="flex">
          <NavegacionLink
            link={"/clientes"}
            estilos={
              "bg-orange-50 text-orange-500 font-semibold h-10 flex items-center px-5"
            }
          >
            Clientes
          </NavegacionLink>
          <NavegacionLink
            link={`/cliente/${params.id}`}
            estilos={
              "bg-orange-500 text-white font-semibold h-10 flex items-center px-5 z-[100] capitalize"
            }
          >
            Cliente {cliente.nombre} {cliente.apellido} /{" "}
            {cliente.numero_contrato}
          </NavegacionLink>
        </div>
        <BreadCrumbs>
          <LinkBreadCrumbs link={"home"}>Inicio</LinkBreadCrumbs>
          <LinkBreadCrumbs link={"clientes"}>Clientes</LinkBreadCrumbs>
        </BreadCrumbs>
      </Navegacion>

      <div className="flex my-10 mx-10">
        <div className="bg-white py-5 px-5">
          <p className="font-bold text-blue-500">
            Detalles del cliente obtenido{" "}
            <span className="capitalize text-orange-500">
              {cliente?.nombre} {cliente.apellido} / N°{" "}
              {cliente.numero_contrato}
            </span>
          </p>
        </div>
      </div>

      <div className="mx-10 grid grid-cols-2 gap-10 items-start">
        <div className="bg-white py-5 px-5 flex flex-col gap-4">
          <p className="font-bold text-gray-600">Resumen del cliente</p>

          <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-orange-500 flex gap-2">
                Nombre{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente.nombre}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Apellido{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente.apellido}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Provincia{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente.provincia}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Localidad{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente.localidad}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Direccion{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente.direccion}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                N° contrato{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente.numero_contrato}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Dni{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente.dni}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Plan de cuotas{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente.plan} cuotas
                </span>
              </p>
            </div>
            {/* //col 2  */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-orange-500 flex gap-2">
                Alta{" "}
                <span className="font-bold capitalize text-gray-600">
                  {updateFecha(cliente?.date)}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Telefono{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente?.telefono}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Email{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente?.email}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Edad{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente?.edad} años
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Vendedor{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente?.username}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2">
                Sucursal{" "}
                <span className="font-bold capitalize text-gray-600">
                  {cliente?.user_fabrica}
                </span>
              </p>
              <p className="font-medium text-orange-500 flex gap-2 items-center">
                Estado{" "}
                <span
                  className={`font-semibold capitalize ${
                    cliente.estado === "aceptado"
                      ? "text-green-600 bg-green-100 py-1 px-2 rounded"
                      : cliente.estado === "pendiente"
                      ? "text-orange-600 bg-orange-100 py-1 px-2 rounded"
                      : cliente.estado === "rechazado"
                      ? "text-red-600 bg-red-100 py-1 px-2 rounded"
                      : "text-gray-600"
                  }`}
                >
                  {cliente?.estado}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white py-10 px-10 flex justify-around">
          <p className="font-bold text-gray-500 text-xl flex flex-col gap-1">
            Señado{" "}
            <span className="font-extrabold text-blue-500">
              {formatearDinero(cliente.seña)}
            </span>
          </p>
          <p className="font-bold text-gray-500 text-xl flex flex-col gap-1">
            Total de la vivienda{" "}
            <span className="font-extrabold text-blue-500">
              {formatearDinero(cliente.total_vivienda)}
            </span>
          </p>
          <p className="font-bold text-gray-500 text-xl flex flex-col gap-1">
            Cuotas total{" "}
            <span className="font-extrabold text-blue-500">
              {cliente?.cuotas_plan?.length} cuotas
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white py-5 px-5 my-10 mx-10 flex gap-2">
        <button
          onClick={() =>
            document.getElementById("my_modal_nueva_cuota").showModal()
          }
          type="button"
          className="bg-blue-500 py-2 px-8 rounded-full font-semibold text-white text-sm"
        >
          Cargar nueva cuota
        </button>
        <button
          onClick={() =>
            document.getElementById("my_modal_nueva_entrega").showModal()
          }
          type="button"
          className="bg-blue-500 py-2 px-8 rounded-full font-semibold text-white text-sm"
        >
          Cargar nueva entrega
        </button>

        <a
          href={cliente?.comprobante}
          target="_blank"
          download
          className="bg-green-500 py-2 px-8 rounded-full font-semibold text-white text-sm cursor-pointer"
        >
          Descargar contrato/cliente
        </a>
      </div>

      <div className="bg-white py-5 px-5 mx-10 my-10">
        <div className="flex">
          <div className="bg-blue-100/50 py-2.5 px-6 font-semibold text-blue-500">
            <p>Entregas cargadas</p>
          </div>
        </div>
        <div className="scroll-bar h-[50vh] overflow-y-scroll px-4">
          <table className="table">
            <thead>
              <tr className="text-gray-800">
                <th>Numero entregas</th>
                <th>Tipo de pago</th>
                <th>Fecha de carga</th>
                <th>Total del comprobante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs capitalize">
              {cliente?.entregas
                ?.filter((g) => g.total > 0) // Filtrar las cuotas con un total mayor que cero
                .map((g, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <th>{g.tipo_pago}</th>
                    <th>{updateFecha(g.created_at)}</th>
                    <th>{formatearDinero(g.total)}</th>
                    <th>
                      <button
                        type="button"
                        className="bg-green-100 text-green-700 py-1 px-6 rounded"
                      >
                        Descargar comprobante
                      </button>
                    </th>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white py-5 px-5 mx-10 my-10 h-full">
        <div className="flex gap-2">
          <div className="bg-blue-100/50 py-2.5 px-6 font-semibold text-blue-500">
            <p>Cuotas cargadas</p>
          </div>
          <div className="py-2.5 px-6 font-semibold text-gray-500">
            <p>
              Cuotas restantes{"  "}
              <span className="text-red-500 font-extrabold bg-red-100 py-1 px-2 rounded">
                {"  "}
                {
                  cliente?.cuotas_plan?.filter((cuota) => cuota.total === 0)
                    .length
                }
              </span>
            </p>
          </div>
        </div>
        <div className="scroll-bar h-[50vh] overflow-y-scroll px-4">
          <table className="table">
            <thead>
              <tr className="text-gray-800">
                <th>Cuota numero</th>
                <th>Total del comprobante</th>
                <th>Tipo de pago</th>
                <th>Fecha de carga</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs capitalize">
              {cliente?.cuotas_plan
                ?.filter((g) => g.total > 0) // Filtrar las cuotas con un total mayor que cero
                .map((g, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <th>{g.tipo_pago}</th>
                    <th>{updateFecha(g.created_at)}</th>
                    <th>{formatearDinero(g.total)}</th>
                    <th>
                      <a
                        href={g?.comprobante}
                        target="_blank"
                        download
                        className="bg-green-100 text-green-700 py-1 px-6 rounded"
                      >
                        Descargar comprobante
                      </a>
                    </th>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalEntrega cliente={cliente} id={params.id} setCliente={setCliente} />
      <ModalCuotas cliente={cliente} id={params.id} setCliente={setCliente} />
    </section>
  );
};
