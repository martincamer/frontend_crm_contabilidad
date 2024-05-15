import RegisterPage from "./pages/RegisterPage";
import VentasProvider from "./context/VentasContext";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./routes";
import { LoginPage } from "./pages/LoginPage";
import { Perfil } from "./pages/Perfil";
import { HomeApp } from "./pages/HomeApp";
import { Gastos } from "./pages/Gastos";

function App() {
  return (
    <VentasProvider>
      <Navbar />
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route index path="/home" element={<HomeApp />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </VentasProvider>
  );
}

export default App;
