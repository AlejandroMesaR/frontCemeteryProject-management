import { Card, CardContent } from "@/components/ui/card";
import { Bar } from "recharts";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const documentTypes = [
  { name: "Death Certificates", value: 42 },
  { name: "Burial Permits", value: 28 },
  { name: "Plot Certificates", value: 15 },
  { name: "Family Authorizations", value: 10 },
  { name: "Other Documents", value: 5 },
];

export default function DocumentationStatistics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Documentation Statistics</h2>
        <p className="text-sm text-muted-foreground">
          Analysis of document processing and generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Document Types</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={documentTypes}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value" fill="#000" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Processing */}
        <Card>
          <CardContent className="p-6 flex flex-col justify-center items-center">
            <p className="text-muted-foreground text-sm mb-2">Document Processing</p>
            <h2 className="text-3xl font-bold">12,546</h2>
            <p className="text-muted-foreground text-sm">Documents Digitized</p>
            <p className="text-green-600 text-sm font-semibold mt-2">+18%</p>
            <p className="text-xs text-muted-foreground">Increase from last year</p>
          </CardContent>
        </Card>

        {/* AI Generation */}
        <Card>
          <CardContent className="p-6 flex flex-col justify-center items-center">
            <p className="text-muted-foreground text-sm mb-2">AI Generation</p>
            <h2 className="text-3xl font-bold">5,872</h2>
            <p className="text-muted-foreground text-sm">AI Generated Documents</p>
            <p className="text-green-600 text-sm font-semibold mt-2">+32%</p>
            <p className="text-xs text-muted-foreground">Increase from last year</p>
          </CardContent>
        </Card>
      </div>

      {/* Processing Time */}
      <Card>
        <CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-2xl font-semibold">4.2 min</h3>
            <p className="text-sm text-muted-foreground">Manual Processing</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">45 sec</h3>
            <p className="text-sm text-muted-foreground">AI Processing</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">82%</h3>
            <p className="text-sm text-muted-foreground">Time Saved</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
