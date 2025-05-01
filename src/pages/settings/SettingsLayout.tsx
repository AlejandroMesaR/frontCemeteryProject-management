import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react"; // Añadimos useEffect

const SettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirigir a /settings/general si estamos en /settings
  useEffect(() => {
    if (location.pathname === "/settings" || location.pathname === "/settings/") {
      navigate("general", { replace: true });
    }
  }, [location, navigate]);

  // Determinar la pestaña activa según la URL
  const isGeneralActive = location.pathname.includes("general");
  const isUsersActive = location.pathname.includes("users");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Configuración</h1>
      <p className="text-gray-500">Administre la configuración de su sistema de gestión de cementerios</p>
      
      <div className="flex space-x-4 border-b pb-2">
        <Link
          to="general"
          className={`px-4 py-2 ${
            isGeneralActive
              ? "border-b-2 border-black text-black font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          General
        </Link>
        <Link
          to="users"
          className={`px-4 py-2 ${
            isUsersActive
              ? "border-b-2 border-black text-black font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Usuarios
        </Link>
      </div>

      <Outlet />
    </div>
  );
};

export default SettingsLayout;