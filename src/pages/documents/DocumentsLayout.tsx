import { Link, Outlet, useLocation } from "react-router-dom";

const DocumentsLayout = () => {
  const location = useLocation();

  // Determinar la pestaña activa según la URL
  const isAllDocumentsActive = location.pathname.includes("allDocuments");
  const isDigitizedActive = location.pathname.includes("digitized");

  return (
    <div className="p-6 space-y-4">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold">Repositorio de Documentos</h1>
          <p className="text-gray-500">Gestiona toda la documentación y registros del cementerio</p>
        </div>
      </header>

      <div className="flex space-x-4 border-b pb-2">
        <Link
          to="allDocuments"
          className={`px-4 py-2 ${
            isAllDocumentsActive
              ? "border-b-2 border-black text-black font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Todos los Documentos
        </Link>
        <Link
          to="digitized"
          className={`px-4 py-2 ${
            isDigitizedActive
              ? "border-b-2 border-black text-black font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Digitalizados
        </Link>
      </div>

      <Outlet />
    </div>
  );
};

export default DocumentsLayout;