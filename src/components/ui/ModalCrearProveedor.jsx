import { Controller, useForm } from "react-hook-form";
import { useProveedor } from "../../context/ProveedoresContext";
import { Submit } from "./Submit";
import { FormInput } from "./FormInput";
import Select from "react-select";

export const ModalCrearProveedor = () => {
  const { createProveedor } = useProveedor();

  const { register, handleSubmit, control } = useForm();

  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 text-left">
            Crear proveedor
          </h3>
        </div>
        <form className="mt-3 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label className="font-semibold text-xs text-gray-700">
                Nombre del proveedor
              </label>
              <input
                {...register("nombre", { required: true })} // Registro del campo con validación
                type="text"
                placeholder="Escribe el nombre"
                className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="font-semibold text-xs text-gray-700">
                Apellido del proveedor
              </label>
              <input
                {...register("apellido", { required: true })} // Registro del campo con validación
                type="text"
                placeholder="Escribe el nombre"
                className="border border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-xs font-semibold"
              />
            </div>
            <FormInput
              labelText={"Telefono"}
              placeholder={"Escribe el telefono"}
              props={{ ...register("telefono", { required: true }) }}
              type={"tel"}
            />

            <FormInput
              labelText={"Dirección"}
              placeholder={"Escribe la dirección"}
              props={{ ...register("direccion", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Provincia"}
              placeholder={"Escribe la provincia"}
              props={{ ...register("provincia", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Localidad"}
              placeholder={"Escribe la localidad"}
              props={{ ...register("localidad", { required: true }) }}
              type={"text"}
            />

            <FormInput
              labelText={"Codigo postal"}
              placeholder={"Escribe el cp"}
              props={{ ...register("cp", { required: true }) }}
              type={"text"}
            />
            <FormInput
              labelText={"Codigo postal"}
              placeholder={"Escribe el cp"}
              props={{ ...register("cp", { required: true }) }}
              type={"text"}
            />

            <div>
              <label className="font-semibold text-xs text-gray-700">
                Seleccionar el país
              </label>
              <Controller
                name="categoria"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={paises}
                    classNamePrefix="react-select"
                    className="w-full z-[100]"
                    placeholder="Buscar o seleccionar categoria"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        textTransform: "capitalize",
                        borderRadius: "none",
                        color: "#4A5568", // text-slate-700
                        backgroundColor: "#F7FAFC", // bg-gray-100
                        padding: "0.31rem 0.75rem", // py-3 px-3
                        borderColor: state.isFocused ? "#3b82f6" : "#E2E8F0", // border-sky-500 or default border
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
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? "#3b82f6"
                          : state.isFocused
                          ? "#E2E8F0"
                          : null, // Change color on select and focus
                        color: state.isSelected ? "#FFFFFF" : "#4A5568", // White text on selected, default on focus
                        padding: "8px 12px",
                      }),
                    }}
                  />
                )}
              />
            </div>
          </div>
          <Submit>Guardar proveedor</Submit>
        </form>
      </div>
    </dialog>
  );
};

const paises = [
  { value: "AF", label: "Afganistán" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Argelia" },
  { value: "AS", label: "Samoa Americana" },
  { value: "AD", label: "Andorra" },
  { value: "AO", label: "Angola" },
  { value: "AI", label: "Anguila" },
  { value: "AQ", label: "Antártida" },
  { value: "AG", label: "Antigua y Barbuda" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AW", label: "Aruba" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaiyán" },
  { value: "BS", label: "Bahamas" },
  { value: "BH", label: "Baréin" },
  { value: "BD", label: "Bangladés" },
  { value: "BB", label: "Barbados" },
  { value: "BY", label: "Bielorrusia" },
  { value: "BE", label: "Bélgica" },
  { value: "BZ", label: "Belice" },
  { value: "BJ", label: "Benín" },
  { value: "BM", label: "Bermudas" },
  { value: "BT", label: "Bután" },
  { value: "BO", label: "Bolivia" },
  { value: "BA", label: "Bosnia y Herzegovina" },
  { value: "BW", label: "Botsuana" },
  { value: "BR", label: "Brasil" },
  { value: "IO", label: "Territorio Británico del Océano Índico" },
  { value: "BN", label: "Brunéi Darussalam" },
  { value: "BG", label: "Bulgaria" },
  { value: "BF", label: "Burkina Faso" },
  { value: "BI", label: "Burundi" },
  { value: "CV", label: "Cabo Verde" },
  { value: "KH", label: "Camboya" },
  { value: "CM", label: "Camerún" },
  { value: "CA", label: "Canadá" },
  { value: "KY", label: "Islas Caimán" },
  { value: "CF", label: "República Centroafricana" },
  { value: "TD", label: "Chad" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CX", label: "Isla de Navidad" },
  { value: "CC", label: "Islas Cocos (Keeling)" },
  { value: "CO", label: "Colombia" },
  { value: "KM", label: "Comoras" },
  { value: "CG", label: "Congo" },
  { value: "CD", label: "Congo, República Democrática del" },
  { value: "CK", label: "Islas Cook" },
  { value: "CR", label: "Costa Rica" },
  { value: "HR", label: "Croacia" },
  { value: "CU", label: "Cuba" },
  { value: "CY", label: "Chipre" },
  { value: "CZ", label: "República Checa" },
  { value: "DK", label: "Dinamarca" },
  { value: "DJ", label: "Yibuti" },
  { value: "DM", label: "Dominica" },
  { value: "DO", label: "República Dominicana" },
  { value: "EC", label: "Ecuador" },
  { value: "EG", label: "Egipto" },
  { value: "SV", label: "El Salvador" },
  { value: "GQ", label: "Guinea Ecuatorial" },
  { value: "ER", label: "Eritrea" },
  { value: "EE", label: "Estonia" },
  { value: "ET", label: "Etiopía" },
  { value: "FK", label: "Islas Malvinas (Falkland Islands)" },
  { value: "FO", label: "Islas Feroe" },
  { value: "FJ", label: "Fiyi" },
  { value: "FI", label: "Finlandia" },
  { value: "FR", label: "Francia" },
  { value: "GF", label: "Guayana Francesa" },
  { value: "PF", label: "Polinesia Francesa" },
  { value: "TF", label: "Territorios Australes Franceses" },
  { value: "GA", label: "Gabón" },
  { value: "GM", label: "Gambia" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Alemania" },
  { value: "GH", label: "Ghana" },
  { value: "GI", label: "Gibraltar" },
  { value: "GR", label: "Grecia" },
  { value: "GL", label: "Groenlandia" },
  { value: "GD", label: "Granada" },
  { value: "GP", label: "Guadalupe" },
  { value: "GU", label: "Guam" },
  { value: "GT", label: "Guatemala" },
  { value: "GG", label: "Guernsey" },
  { value: "GN", label: "Guinea" },
  { value: "GW", label: "Guinea-Bisáu" },
  { value: "GY", label: "Guyana" },
  { value: "HT", label: "Haití" },
  { value: "HN", label: "Honduras" },
  { value: "HK", label: "Hong Kong" },
  { value: "HU", label: "Hungría" },
  { value: "IS", label: "Islandia" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Irán" },
  { value: "IQ", label: "Irak" },
  { value: "IE", label: "Irlanda" },
  { value: "IM", label: "Isla de Man" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italia" },
  { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japón" },
  { value: "JE", label: "Jersey" },
  { value: "JO", label: "Jordania" },
  { value: "KZ", label: "Kazajistán" },
  { value: "KE", label: "Kenia" },
  { value: "KI", label: "Kiribati" },
  { value: "KP", label: "Corea del Norte" },
  { value: "KR", label: "Corea del Sur" },
  { value: "KW", label: "Kuwait" },
  { value: "KG", label: "Kirguistán" },
  { value: "LA", label: "Laos" },
  { value: "LV", label: "Letonia" },
  { value: "LB", label: "Líbano" },
  { value: "LS", label: "Lesoto" },
  { value: "LR", label: "Liberia" },
  { value: "LY", label: "Libia" },
  { value: "LI", label: "Liechtenstein" },
  { value: "LT", label: "Lituania" },
  { value: "LU", label: "Luxemburgo" },
  { value: "MO", label: "Macao" },
  { value: "MK", label: "Macedonia del Norte" },
  { value: "MG", label: "Madagascar" },
  { value: "MW", label: "Malaui" },
  { value: "MY", label: "Malasia" },
  { value: "MV", label: "Maldivas" },
  { value: "ML", label: "Malí" },
  { value: "MT", label: "Malta" },
  { value: "MH", label: "Islas Marshall" },
  { value: "MQ", label: "Martinica" },
  { value: "MR", label: "Mauritania" },
];
