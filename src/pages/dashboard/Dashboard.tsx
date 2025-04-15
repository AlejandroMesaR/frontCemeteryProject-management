import Header from '../../components/header/Header';
import StatsCard from '../../components/stats/StatsCard';
import Card from '../../components/card/Card';
import { Button } from '../../components/ui/button';

function Dashboard() {

  return (
    <div className="flex flex-col h-full space-y-4 bg-gray-100">
      {/* Encabezado con el botón de Nuevo Registro y Dropdown de perfil */}
      <Header />

      {/* Sección de estadísticas */}
      <div className="grid grid-cols-4 gap-2">
        <StatsCard 
          title="Registros Totales" 
          value="3,287" 
          subtitle="Cuerpos en el registro" 
        />
        <StatsCard 
          title="Tasa de Ocupación" 
          value="78%" 
          subtitle="Espacios ocupados" 
        />
        <StatsCard 
          title="Documentos Digitalizados" 
          value="12,546" 
        />
        <StatsCard 
          title="Tasas Pendientes" 
          value="21" 
          subtitle="Año de prioridad: 2024" 
        />
      </div>

      {/* Contenedor de las tarjetas de Entradas Recientes y Resumen del Mapa */}
      <div className="grid grid-cols-12 gap-2 flex-1">
        {/* Entradas Recientes */}
        <Card className="col-span-5 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Entradas Recientes</h3>
          <ul className="space-y-5 flex-grow">
            <li className="flex justify-between">
              <span>Robert Johnson</span>
              <span className="text-sm text-gray-500">Alta Nueva, Parcela 7A - 01/05/2024</span>
            </li>
            <li className="flex justify-between">
              <span>María García</span>
              <span className="text-sm text-gray-500">Alta Nueva, Parcela 7B - 03/05/2024</span>
            </li>
            <li className="flex justify-between">
              <span>John Smith</span>
              <span className="text-sm text-gray-500">Alta Nueva, Parcela 35 - 10/05/2024</span>
            </li>
            <li className="flex justify-between">
              <span>Emily Davis</span>
              <span className="text-sm text-gray-500">Alta Nueva, Parcela 2 - 12/05/2024</span>
            </li>
          </ul>
          <Button className=" bg-slate-200 border-gray-200 mt-5 text-gray-900 text-lg hover:bg-slate-400 hover:text-gray-700">
            Ver Todos los Registros
          </Button>
        </Card>

        {/* Resumen del Mapa */}
        <Card className="col-span-7 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Resumen del Mapa del Cementerio</h3>
          <p className="text-sm text-gray-600">
            Aquí se mostrará el estado actual de ocupación por sección
          </p>
          <div className="mt-4 flex items-center justify-center h-full bg-gray-100 text-gray-400 flex-grow">
            Visualización del mapa del cementerio
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
