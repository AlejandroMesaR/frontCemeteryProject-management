import { useState } from 'react';
import { Button } from "../ui/button";
import { FaEye, FaDownload } from 'react-icons/fa';

interface CloudinaryFileHandlerProps {
  fileUrl: string;
}

const CloudinaryFileHandler = ({ fileUrl }: CloudinaryFileHandlerProps) => {
  const [downloading, setDownloading] = useState(false);

  // Función para obtener un nombre de archivo significativo
  const getFileName = (url: string): string => {
    // Extraer nombre de archivo de la URL
    const urlParts = url.split('/');
    let fileName = urlParts[urlParts.length - 1];
    
    // Si contiene parámetros de consulta, eliminarlos
    if (fileName.includes('?')) {
      fileName = fileName.split('?')[0];
    }
    
    // Decodificar el nombre del archivo (por si tiene caracteres especiales)
    try {
      fileName = decodeURIComponent(fileName);
    } catch (e) {
      console.error("Error decodificando nombre de archivo:", e);
    }
    
    return fileName;
  };

  // Función para descargar el archivo
  const downloadFile = async () => {
    try {
      setDownloading(true);
      
      // Realizar petición para obtener el archivo
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.status} ${response.statusText}`);
      }
      
      // Convertir respuesta a blob
      const blob = await response.blob();
      
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento <a> temporal para la descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = getFileName(fileUrl);
      document.body.appendChild(link);
      
      // Disparar clic en el enlace para iniciar descarga
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error descargando archivo:", error);
      alert("No se pudo descargar el archivo. Por favor intente nuevamente.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center"
      >
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
          size="sm"
        >
          <FaEye className="mr-1" />
          Ver
        </Button>
      </a>
      
      <Button 
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
        size="sm"
        onClick={downloadFile}
        disabled={downloading}
      >
        <FaDownload className="mr-1" />
        {downloading ? "Descargando..." : "Descargar"}
      </Button>
    </div>
  );
};

export default CloudinaryFileHandler;