import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaMapMarkerAlt, FaChartBar, FaFileAlt, FaCog, FaSignOutAlt} from 'react-icons/fa';
import { Button } from '../ui/button';
import LoginDialog from '../dialog/LoginDialog'; 
import { isAuthenticated, getUserRole } from '../../utils/auth';
import { logout } from '../../services/authService';

function Sidebar() {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  return (
    <aside className="w-1/6 bg-gray-800 text-white shadow h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex">
        <img src= "src\assets\logo.png" alt="Logo" className="h-14 w-auto pr-3" />
        <h1 className="text-xl font-bold">Gestión de Cementerio</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className="flex items-center space-x-3 text-gray-300 hover:text-blue-500 p-2 rounded-lg transition duration-300">
          <FaHome />
          <span>Inicio</span>
        </Link>

        {isAuth && (
          <>
            <Link to="/bodies" className="flex items-center space-x-3 text-gray-300 hover:text-blue-500 p-2 rounded-lg transition duration-300">
              <FaUser />
              <span>Registro de Cuerpos</span>
            </Link>
            <Link to="/map" className="flex items-center space-x-3 text-gray-300 hover:text-blue-500 p-2 rounded-lg transition duration-300">
              <FaMapMarkerAlt />
              <span>Distribucion del Cementerio</span>
            </Link>
            <Link to="/statistics" className="flex items-center space-x-3 text-gray-300 hover:text-blue-500 p-2 rounded-lg transition duration-300">
              <FaChartBar />
              <span>Estadísticas</span>
            </Link>
            <Link to="/documents" className="flex items-center space-x-3 text-gray-300 hover:text-blue-500 p-2 rounded-lg transition duration-300">
              <FaFileAlt />
              <span>Documentos</span>
            </Link>
            {userRole === 'ROLE_ADMIN' && (
              <>
                <Link to="/settings" className="flex items-center space-x-3 text-gray-300 hover:text-blue-500 p-2 rounded-lg transition duration-300">
                  <FaCog />
                  <span>Configuración</span>
                </Link>
              </>
            )}
          </>
        )}
      </nav>

      {/* Área de autenticación en la parte inferior */}
      <div className="p-4">
        {isAuth ? (
          <Button 
            onClick={logout}
            className="flex items-center justify-center text-base w-full bg-red-600 hover:bg-red-700 text-white rounded-lg p-5 transition duration-300"
          >
            <FaSignOutAlt/>
            <span>Cerrar Sesión</span>
          </Button>
        ) : (
          <div className="auth-button-container w-full">
            <LoginDialog buttonClassName="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition duration-300" />
          </div>
        )}
      </div>
      
    </aside>
  );
}

export default Sidebar;
