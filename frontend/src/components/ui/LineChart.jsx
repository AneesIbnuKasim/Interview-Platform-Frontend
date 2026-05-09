import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LineChart = memo(({ data, className }) => {
  return (
    <div className={`p-4 rounded-xl shadow ${className}`}>
      <h3 className="font-semibold mb-2">Total Sales</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="_id" />
          <YAxis domain={[0, "dataMax"]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#ef4444"      // red-500
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})

export default LineChart
