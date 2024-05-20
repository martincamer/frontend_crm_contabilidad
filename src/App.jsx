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

function App() {
  return (
    <CajaProvider>
      <GastoProvider>
        <ProveedorProvider>
          <CategoriaProvider>
            <Navbar />
            <Routes>
              <Route index path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route index path="/home" element={<HomeApp />} />
                <Route index path="/caja" element={<PageCaja />} />
                <Route path="/gastos" element={<Gastos />} />
                <Route path="/crear-gasto" element={<PageCrearGasto />} />
                <Route path="/perfil" element={<Perfil />} />
              </Route>
            </Routes>
          </CategoriaProvider>
        </ProveedorProvider>
      </GastoProvider>
    </CajaProvider>
  );
}

export default App;
