import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useMemo } from "react";

const data = [
  { name: "Occupied", value: 2924 },
  { name: "Available", value: 826 },
  { name: "Reserved", value: 215 },
];

const COLORS = ["#1f2937", "#e5e7eb", "#d1d5db"];

export default function OccupancyAnalysisPage() {
  const totalCapacity = 3750;
  const totalOccupied = 2924;
  const availablePlots = 826;
  const reservedPlots = 215;
  const projectedYears = 5;
  const projectedMonths = 3;

  const barData = useMemo(
    () => [
      { name: "Occupied", value: totalOccupied },
      { name: "Available", value: availablePlots },
      { name: "Reserved", value: reservedPlots },
    ],
    []
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Occupancy Analysis</CardTitle>
          <CardDescription>
            Detailed analysis of cemetery occupancy
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Occupancy by section chart
            </p>
          </div>
          <div className="w-full md:w-1/2 space-y-2">
            <h4 className="font-semibold">Current Status</h4>
            <div className="text-sm flex justify-between">
              <span>Total Capacity</span>
              <span>{totalCapacity.toLocaleString()} plots</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Total Occupied</span>
              <span>
                {totalOccupied.toLocaleString()} plots (
                {((totalOccupied / totalCapacity) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Available Plots</span>
              <span>
                {availablePlots.toLocaleString()} plots (
                {((availablePlots / totalCapacity) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Reserved Plots</span>
              <span>
                {reservedPlots.toLocaleString()} plots (
                {((reservedPlots / totalCapacity) * 100).toFixed(0)}%)
              </span>
            </div>

            <h4 className="font-semibold pt-4">Projections</h4>
            <p className="text-sm text-muted-foreground">
              Based on current trends, the cemetery will reach full capacity in
              approximately {projectedYears} years and {projectedMonths} months.
            </p>
            <Button className="mt-2">View Detailed Projections</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Occupancy Breakdown</CardTitle>
          <CardDescription>
            Bar chart representation of current occupancy status
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
