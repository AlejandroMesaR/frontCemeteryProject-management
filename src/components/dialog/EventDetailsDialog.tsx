import { useState } from 'react';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { EventoCuerpo } from "../../models";

interface EventDetailsDialogProps {
  event: EventoCuerpo;
  trigger: React.ReactNode;
}

const EventDetailsDialog = ({ event, trigger }: EventDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  // Determinar el tipo de archivo basado en la URL
  const getFileType = (url: string | null): string => {
    if (!url) return 'unknown';
    
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('.pdf')) {
      return 'pdf';
    } else if (
      urlLower.includes('.jpg') || 
      urlLower.includes('.jpeg') || 
      urlLower.includes('.png') || 
      urlLower.includes('.gif') || 
      urlLower.includes('.svg')
    ) {
      return 'image';
    } else {
      return 'document';
    }
  };

  const fileType = getFileType(event.archivo);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Detalles del Evento: {event.tipoEvento}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="font-semibold">ID:</span>
              <span>{event.id}</span>
              
              <span className="font-semibold">ID Cadáver:</span>
              <span>{event.idCadaver}</span>
              
              <span className="font-semibold">Fecha:</span>
              <span>{event.fechaEvento}</span>
              
              <span className="font-semibold">Tipo:</span>
              <span>{event.tipoEvento}</span>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Resumen del Evento:</h4>
              <p className="bg-gray-50 p-3 rounded-md">{event.resumenEvento}</p>
            </div>
            
            {event.archivo && (
              <div>
                <h4 className="font-semibold mb-2">Archivo Adjunto:</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {fileType === 'image' ? (
                    <div className="mb-2">
                      <img 
                        src={event.archivo} 
                        alt="Imagen del evento" 
                        className="max-w-full max-h-[300px] mx-auto rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="mb-2 text-gray-600">
                      {fileType === 'pdf' ? 'Documento PDF' : 'Documento adjunto'}
                    </div>
                  )}
                  <div className="flex justify-center mt-2">
                    <a 
                      href={event.archivo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Ver archivo completo
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventDetailsDialog;