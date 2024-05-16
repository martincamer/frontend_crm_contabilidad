import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import img from "../assets/logistica.jpg";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated]);

  return (
    <div className="h-screen flex gap-12 items-center">
      <img className="w-1/2 object-cover opacity-[0.8] h-[100%]" src={img} />

      <Card>
        {loginErrors?.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-xl font-semibold text-center mb-5">
          Te damos la bienvenida al{" "}
          <span className="text-violet-500 font-bold capitalize">
            CRM contable
          </span>{" "}
          👋
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <Label htmlFor="username">Nombre del usuario</Label>
            <Input
              label="Pon tu usuario"
              type="text"
              name="username"
              placeholder="pedro011"
              {...register("username", { required: true })}
            />
            <p>{errors.username?.message}</p>
          </div>

          <div>
            <Label htmlFor="password">Contraseña del registro</Label>
            <Input
              type="password"
              name="password"
              placeholder="******************"
              {...register("password", { required: true, minLength: 6 })}
            />
            <p>{errors.password?.message}</p>
          </div>

          <div className="text-sm mt-2">
            <Button>Iniciar Sesion</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
