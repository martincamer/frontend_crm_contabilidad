import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import img from "../assets/logistica.jpg";

function Register() {
  const { signup, errors: registerErrors, isAuthenticated } = useAuth();
  const { register, handleSubmit } = useForm({});
  const navigate = useNavigate();

  const onSubmit = async (value) => {
    await signup(value);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated]);

  return (
    <div className="h-screen flex gap-12 items-center border-slate-200 border-[1px] w-full">
      <Card>
        {registerErrors?.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-2xl font-semibold text-center mb-5">
          Registrar usuario
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <article className="grid grid-cols-2 gap-5">
            <div>
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                type="text"
                name="username"
                placeholder="Pon el nombre del usuario"
                {...register("username")}
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="email">Correo electronico</Label>
              <Input
                name="email"
                placeholder="correo@gmail.com"
                {...register("email")}
              />
            </div>

            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                type="text"
                name="nombre"
                placeholder="nombre del usuario"
                {...register("nombre")}
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                type="text"
                name="apellido"
                placeholder="apellido del usuario"
                {...register("apellido")}
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="apellido">Fecha nacimiento</Label>
              <input
                className="text-sm w-full bg-gray-200/90 placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 rounded-xl focus:outline-violet-500 transition-all"
                type="date"
                name="fecha_nacimiento"
                {...register("fecha_nacimiento")}
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="puesto_sector">Puesto sector</Label>
              <select
                className="text-sm w-full bg-gray-200/90 placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 rounded-xl focus:outline-violet-500 transition-all"
                type="date"
                name="puesto_sector"
                {...register("puesto_sector")}
                autoFocus
              >
                <option>Seleccionar puesto/sector</option>
                <option value={"administración"}>Administración</option>
                <option value={"contabilidad"}>Contabilidad</option>
                <option value={"gerencia"}>Gerencia</option>
              </select>
            </div>

            <div>
              <Label htmlFor="fabrica">Fabrica</Label>
              <Input
                type="text"
                name="fabrica"
                placeholder="Fabrica del usuario"
                {...register("fabrica")}
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="localidad">Localidad</Label>
              <Input
                type="text"
                name="localidad"
                placeholder="Localidad del usuario"
                {...register("localidad")}
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="provincia">Provincia</Label>
              <Input
                type="text"
                name="provincia"
                placeholder="Provincia del usuario"
                {...register("provincia")}
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="dni">Dni</Label>
              <Input
                type="text"
                name="dni"
                placeholder="dni del usuario"
                {...register("dni")}
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                type="password"
                name="password"
                placeholder="********"
                {...register("password")}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="********"
                {...register("confirmPassword")}
              />
            </div>
          </article>
          <div className="mt-5">
            <Button>Crear cuenta ahora</Button>
          </div>
        </form>
        <p className="justify-between flex mt-5 text-sm">
          Ya tienes una cuenta?
          <Link to="/login" className="text-violet-500 font-semibold">
            Inicia Sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;
