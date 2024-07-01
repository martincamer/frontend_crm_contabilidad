import React, { useState } from "react";
import { Submit } from "../ui/Submit";
import { FormInput } from "../ui/FormInput";
import { useForm } from "react-hook-form";
import { useBancoCheque } from "../../context/BancoChequesContext";
import { SelectInput } from "../ui/SelectInput";
import dayjs from "dayjs";
import { formatearDinero } from "../../helpers/FormatearDinero";

export const ModalCrearCheque = ({ bancos }) => {
  const { crearCheque } = useBancoCheque();

  const { register, handleSubmit, reset, watch } = useForm();

  const total = watch("total");

  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const cajaData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
      };

      await crearCheque(cajaData);

      document.getElementById("my_modal_crear_cheque").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_crear_cheque" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Crear nuevo cheque
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 text-left">
          <div className="flex flex-col gap-3">
            <SelectInput
              labelText={"Seleccionar el banco"}
              props={{ ...register("banco", { required: true }) }}
            >
              <option className="font-bold text-blue-500">
                Seleccionar el banco existente
              </option>
              {bancos.map((b) => (
                <option value={b.nombre} className="font-semibold" key={b._id}>
                  {b.nombre}
                </option>
              ))}
            </SelectInput>
            <SelectInput
              labelText={"Seleccionar el tipo"}
              props={{ ...register("tipo", { required: true }) }}
            >
              <option className="font-bold text-blue-500">
                Seleccionar el tipo de cheque
              </option>
              <option value={"local"} className="font-semibold">
                Local
              </option>
              <option value={"terceros"} className="font-semibold">
                Terceros
              </option>
            </SelectInput>

            <FormInput
              labelText={"Para quien"}
              placeholder={"Escribe el cliente/etc del cheque"}
              props={{ ...register("datos", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Numero del cheque"}
              placeholder={"Numero del cheque"}
              props={{ ...register("numero_cheque", { required: true }) }}
              type={"text"}
            />
            <FormInput
              labelText={"Numero de la ruta"}
              placeholder={"Numero de la ruta"}
              props={{ ...register("numero_ruta", { required: true }) }}
              type={"text"}
            />

            <div onClick={handleInputClick}>
              {isEditable ? (
                <FormInput
                  labelText={"Total del cheque"}
                  placeholder={"Escribe el total"}
                  props={{
                    ...register("total", {
                      required: true,
                    }),
                    onBlur: () => setIsEditable(false), // Save the value and set back to display mode
                  }}
                  type={"text"}
                />
              ) : (
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-semibold text-xs text-gray-700">
                    Total del cheque
                  </label>
                  <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold">
                    {formatearDinero(Number(total) || 0)}
                  </p>
                </div>
              )}
            </div>
          </div>
          <Submit type={"submit"}>Guardar el cheque</Submit>
        </form>
      </div>
    </dialog>
  );
};
