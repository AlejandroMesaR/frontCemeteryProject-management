import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const SettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirigir a /settings/users si estamos en /settings
  useEffect(() => {
    if (location.pathname === "/settings" || location.pathname === "/settings/") {
      navigate("users", { replace: true });
    }
  }, [location, navigate]);

  // Determinar la pestaña activa según la URL
  const isUsersActive = location.pathname.includes("users");

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className='bg-gray-100 px-4 mt-5'>
        <Card className="w-full p-4 pb-0 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Settings className="mr-2 h-5 w-5 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
            </div>
            <p className="text-sm text-gray-500">
              Administre la configuración de su sistema de gestión de cementerios
            </p>
          </div>
          
          <div className="flex space-x-4 border-b">
            <Link
              to="users"
              className={`px-4 py-2 border-b-2 ${
                isUsersActive
                  ? "border-gray-700 text-gray-900 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              Usuarios
            </Link>
          </div>
        </Card>

        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;