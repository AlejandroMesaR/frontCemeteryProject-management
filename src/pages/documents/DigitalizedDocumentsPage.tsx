import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck2 } from "lucide-react";

export default function DigitalizedDocumentsPage() {
  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-10 text-center flex flex-col items-center justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Documentos Digitalizados</h2>
            <p className="text-muted-foreground text-base">
              Documentos procesados mediante OCR y digitalización con IA
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <FileCheck2 className="h-12 w-12 text-black" />
            <p className="text-2xl font-semibold">12,546 Documentos Digitalizados</p>
            <p className="text-muted-foreground">
              Todos los documentos físicos que han sido digitalizados mediante nuestro sistema de OCR con IA
            </p>
          </div>

          <Button className="bg-black text-white text-base px-6 py-2 rounded-xl hover:bg-gray-800">
            Subir Nuevo Documento para Digitalización
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
