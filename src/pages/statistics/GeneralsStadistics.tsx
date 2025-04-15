import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4ADE80", "#60A5FA", "#FBBF24", "#F87171"];

const monthlyData = [
  { month: "Jan", entries: 10 },
  { month: "Feb", entries: 14 },
  { month: "Mar", entries: 20 },
  { month: "Apr", entries: 17 },
  { month: "May", entries: 22 },
  { month: "Jun", entries: 19 },
  { month: "Jul", entries: 24 },
  { month: "Aug", entries: 27 },
  { month: "Sep", entries: 23 },
  { month: "Oct", entries: 21 },
  { month: "Nov", entries: 18 },
  { month: "Dec", entries: 25 },
];

const sectionDistribution = [
  { name: "North", value: 300 },
  { name: "South", value: 200 },
  { name: "East", value: 100 },
  { name: "West", value: 150 },
];

const yearlyComparison = [
  { year: "2022", entries: 145, documents: 1100 },
  { year: "2023", entries: 157, documents: 1285 },
];

export default function GeneralsStadistics() {
  return (
    <div className="grid gap-6 p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Entries Trend</CardTitle>
            <CardDescription>
              Cemetery entries over the past 12 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entries" stroke="#4ADE80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Section Distribution</CardTitle>
            <CardDescription>
              Distribution of occupancy across cemetery sections
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectionDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sectionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yearly Comparison</CardTitle>
          <CardDescription>
            Year-over-year comparison of key cemetery metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyComparison}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entries" fill="#60A5FA" name="Entries" />
              <Bar dataKey="documents" fill="#F87171" name="Documents" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
