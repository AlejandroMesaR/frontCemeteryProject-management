import Card  from "../../components/card/Card";
import { Input }  from "../../components/utilsComponents/Input";

const GeneralSettings = () => (
  <Card className="p-6 space-y-4">
    <h2 className="text-xl font-semibold">Configuración General</h2>
    <p className="text-gray-500">Configure los ajustes básicos para su sistema de gestión de cementerios</p>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium">Nombre del cementerio</label>
        <Input value="Peaceful Rest Cemetery" readOnly />
      </div>
      <div>
        <label className="text-sm font-medium">Dirección</label>
        <Input value="123 Memorial Lane, Springfield, IL 62701" readOnly />
      </div>
      <div>
        <label className="text-sm font-medium">Número de Teléfono</label>
        <Input value="(555) 123-4567" readOnly />
      </div>
      <div>
        <label className="text-sm font-medium">Correo</label>
        <Input value="contact@peacefulrestcemetery.com" readOnly />
      </div>
    </div>
  </Card>
);

export default GeneralSettings;