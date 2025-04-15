import { Card, CardContent } from "../../components/ui/card";
import { Button } from "@/components/ui/button";
import {Link, Outlet} from "react-router-dom";
import { ChevronDown } from "lucide-react";


export default function Statistics() {
  return (
    <div className="p-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Estadisticas del Cementrio</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              Este Año
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button>
              Exportar Informe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Entradas</p>
              <h3 className="text-2xl font-bold">157</h3>
              <p className="text-xs text-green-600 mt-1">+12% este año</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Available Plots</p>
              <h3 className="text-2xl font-bold">826</h3>
              <p className="text-xs text-red-500 mt-1">-3% since last year</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              <h3 className="text-2xl font-bold">78%</h3>
              <p className="text-xs text-green-600 mt-1">+2% year over year</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Documents Processed</p>
              <h3 className="text-2xl font-bold">1,285</h3>
              <p className="text-xs text-green-600 mt-1">+18% this year</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-4 border-b pb-2">
          <Link to="generalStadistics" className="px-4 py-2 border-b-2 border-black">General</Link>
          <Link to="occupancy" className="px-4 py-2 text-gray-500">Ocupación</Link>
          <Link to="documentationStadistics" className="px-4 py-2 text-gray-500">Documentación</Link>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
