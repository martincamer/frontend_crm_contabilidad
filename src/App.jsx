import RegisterPage from "./pages/RegisterPage";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./routes";
import { LoginPage } from "./pages/LoginPage";
import { Perfil } from "./pages/Perfil";
import { HomeApp } from "./pages/HomeApp";
import { Gastos } from "./pages/Gastos";
import { PageCrearGasto } from "./pages/PageCrearGasto";
import { ProveedorProvider } from "./context/ProveedoresContext";
import { CategoriaProvider } from "./context/CategoriasContext";
import { GastoProvider } from "./context/GastosContext";
import { CajaProvider } from "./context/CajasContext";
import { PageCaja } from "./pages/PageCaja";
import { GastoPage } from "./pages/GastoPage";
import { ClientesPage } from "./pages/ClientesPage";
import { ClienteProvider } from "./context/ClientesContext";
import { PageCrearCliente } from "./pages/PageCrearCliente";
import { ClientePage } from "./pages/ClientePage";
import { BancoProvider } from "./context/BancoContext";
import { PageBanco } from "./pages/PageBanco";
import { Ingresos } from "./pages/Ingresos";
import { IngresoProvider } from "./context/IngresosContext";
import { IngresoPage } from "./pages/IngresoPage";
import { Empleados } from "./pages/Empleados";
import { EmpleadoProvider } from "./context/EmpleadosContext";
import { Empleado } from "./pages/Empleado";
import { EmpleadosDatos } from "./pages/EmpleadosDatos";
import { EmpleadosDato } from "./pages/EmpleadosDato";
import InvoicePage from "./pages/PruebasComprobantes";

function App() {
  return (
    <CajaProvider>
      <BancoProvider>
        <ClienteProvider>
          <GastoProvider>
            <IngresoProvider>
              <ProveedorProvider>
                <CategoriaProvider>
                  <EmpleadoProvider>
                    <Navbar />
                    <Routes>
                      <Route index path="/" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<HomeApp />} />
                        <Route
                          index
                          path="/empleados"
                          element={<Empleados />}
                        />
                        <Route
                          path="/datos-empleados"
                          element={<EmpleadosDatos />}
                        />
                        <Route
                          path="/empleados-datos/:id"
                          element={<EmpleadosDato />}
                        />
                        <Route path="/empleado/:id" element={<Empleado />} />
                        <Route
                          path="/pruebas-comprobantes"
                          element={<InvoicePage />}
                        />
                        <Route index path="/caja" element={<PageCaja />} />
                        <Route index path="/banco" element={<PageBanco />} />
                        <Route path="/gastos" element={<Gastos />} />
                        <Route path="/ingresos" element={<Ingresos />} />
                        <Route
                          path="/crear-gasto"
                          element={<PageCrearGasto />}
                        />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/gasto/:id" element={<GastoPage />} />
                        <Route path="/ingreso/:id" element={<IngresoPage />} />
                        <Route path="/clientes" element={<ClientesPage />} />
                        <Route
                          path="/crear-cliente"
                          element={<PageCrearCliente />}
                        />
                        <Route path="/cliente/:id" element={<ClientePage />} />
                      </Route>
                    </Routes>
                  </EmpleadoProvider>
                </CategoriaProvider>
              </ProveedorProvider>
            </IngresoProvider>
          </GastoProvider>
        </ClienteProvider>
      </BancoProvider>
    </CajaProvider>
  );
}

export default App;
