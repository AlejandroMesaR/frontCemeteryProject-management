import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileCheck2 } from "lucide-react";

export default function DigitalizedDocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar la selección del archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessed(false); // Reiniciar el estado de "procesado"
    }
  };

  // Simular el procesamiento del archivo
  const handleUpload = () => {
    if (file) {
      // Simulamos el procesamiento (en el futuro aquí irá la integración con la IA)
      setTimeout(() => {
        setIsProcessed(true);
        // Reiniciar el input de archivo
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 1000); // Simulamos un pequeño retraso para que parezca un procesamiento real
    }
  };

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-lg border border-gray-100">
        <CardContent className="p-10 text-center flex flex-col items-center justify-center space-y-8">
          {/* Título y mensaje */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-800">Subir Documentos para Digitalización</h2>
            <p className="text-gray-500 text-base max-w-md">
              Aquí puedes subir tus archivos del cementerio y el sistema lo guardará para ti usando la IA.
            </p>
          </div>

          {/* Sección de subida de archivos */}
          <div className="w-full max-w-md space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-3 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,application/pdf" // Aceptar imágenes y PDFs
                />
                <label
                  htmlFor="file-upload"
                  className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                >
                  {file ? file.name : "Seleccionar archivo"}
                </label>
                <Button
                  onClick={handleUpload}
                  disabled={!file}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Upload className="h-5 w-5" />
                  <span>Subir</span>
                </Button>
              </div>
            </div>

            {/* Mensaje de éxito */}
            {isProcessed && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl flex items-center space-x-2">
                <FileCheck2 className="h-5 w-5" />
                <p className="text-sm font-medium">Procesado con éxito</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}