import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SalesChart({ data=[], className }) {

  const safeData = data.map(d => ({
    ...d,
    totalSales: Number(d.totalSales) || 0
  }));

  return (
    <div className={`p-4 rounded-xl shadow ${className}`}>
      <h3 className="font-semibold mb-2">Total Sales</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="_id" />
          <YAxis domain={[0, "dataMax"]} />

          <Tooltip />

          <Bar
            dataKey="totalSales"
            fill="#ef4444"        
            fillOpacity={1}      // ✅ solid bars
            barSize={40}         // ✅ prevent overlap
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}