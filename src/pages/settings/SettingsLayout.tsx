import {Link, Outlet} from "react-router-dom";

const SettingsLayout = () => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Configuración</h1>
      <p className="text-gray-500">Administre la configuración de su sistema de gestión de cementerios</p>
      
      <div className="flex space-x-4 border-b pb-2">
        <Link to="general" className="px-4 py-2 text-gray-500">General</Link>
        <Link to="users" className="px-4 py-2 text-gray-500">Usuarios</Link>
      </div>

      <Outlet />
    </div>
  );
};

export default SettingsLayout;