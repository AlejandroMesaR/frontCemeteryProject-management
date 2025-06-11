import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileCheck2, AlertCircle } from "lucide-react";
import { CuerpoInhumado } from "@/models/CuerpoInhumado"; 
import { uploadDocument } from "@/services/managementService"; 

export default function DigitalizedDocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<CuerpoInhumado | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResponseData(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const response = await uploadDocument(file);
      setResponseData(response);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      const message = err.message || "Error al procesar el archivo. Por favor, intenta de nuevo.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-lg border border-gray-100">
        <CardContent className="p-10 text-center flex flex-col items-center justify-center space-y-8">
          {/* Title and description */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-800">Subir Documentos para Digitalización</h2>
            <p className="text-gray-500 text-base max-w-md">
              Aquí puedes subir tus archivos del cementerio y el sistema los procesará usando la IA.
            </p>
          </div>

          {/* File upload section */}
          <div className="w-full max-w-md space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-3 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,application/pdf"
                />
                <label
                  htmlFor="file-upload"
                  className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                >
                  {file ? file.name : "Seleccionar archivo"}
                </label>
                <Button
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Upload className="h-5 w-5" />
                  <span>{isLoading ? "Subiendo..." : "Subir"}</span>
                </Button>
              </div>
            </div>

            {/* Success message */}
            {responseData && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl flex items-start space-x-2">
                <FileCheck2 className="h-5 w-5 mt-1" />
                <div className="text-sm font-medium text-left">
                  <p>Procesado con éxito</p>
                  <p>
                    <strong>Nombre:</strong> {responseData.nombre} {responseData.apellido}
                  </p>
                  <p>
                    <strong>Documento:</strong> {responseData.documentoIdentidad}
                  </p>
                  <p>
                    <strong>Causa de Muerte:</strong> {responseData.causaMuerte}
                  </p>
                  <p>
                    <strong>Fecha de Ingreso:</strong>{" "}
                    {responseData.fechaIngreso
                      ? new Date(responseData.fechaIngreso).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}