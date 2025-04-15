import { useNavigate } from "react-router-dom";
import Button from "../../components/utilsComponents/Button";
import Card from "../../components/card/Card";

const NICHES = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  status: i % 10 === 0 ? "Vacio" : "Ocupado" ,
}));

const CemeteryMap = () => {
  const navigate = useNavigate();

  const handleNicheClick = (id: number) => {
    navigate(`/niche/${id}`);
  };

  return (
    <div className="p-8 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-900">Gestion de nichos</h1>
      <p className="text-gray-600">Representación visual de los nichos del santuario y su estado actual</p>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        <button className="px-4 py-2 border-b-2 border-black font-semibold">Gestion de nichos</button>
        <button className="px-4 py-2 text-gray-500 hover:text-black transition-colors">Data Analisis</button>
      </div>

      <div className="flex gap-6">
        {/* Cemetery Grid */}
        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Mapa de Nichos</h2>
          <div className="grid grid-cols-10 gap-2 border p-3 rounded-xl bg-white shadow-md">
            {NICHES.map(({ id, status }) => (
              <button
                key={id}
                onClick={() => handleNicheClick(id)}
                className={`algo flex items-center justify-center rounded-2xl text-sm font-medium border shadow-sm transition-all
                  ${status === "Ocupado" ? "bg-red-300 text-red-900 hover:bg-red-400" :
                    "border-dashed border-gray-400 bg-gray-50 hover:bg-gray-200"}`}
              >
                {id.toString().padStart(3, "0")}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <Card className="w-72 p-6 space-y-6 bg-white shadow-lg rounded-xl">
          <h3 className="font-bold text-lg text-gray-800">Leyenda y estadísticas</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><span className="w-5 h-5 bg-red-300 rounded" />Ocupado</div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 border border-dashed border-gray-400 bg-gray-50 rounded" />Vacio</div>
          </div>
          <p className="text-sm text-gray-600">Total Nichos: 100<br />Ocupado: 92%<br />Disponibles: 8%</p>
          <Button className="w-full bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">Asignar nuevo Nicho</Button>
        </Card>
      </div>
    </div>
  );
};

export default CemeteryMap;