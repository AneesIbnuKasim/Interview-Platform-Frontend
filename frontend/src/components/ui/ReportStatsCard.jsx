export default function ReportStatsCard({ title, value, change, className, icon, timeFrame }) {
  return (
    <div className={`bg-white flex flex-col min-h-25 rounded-lg p-4 gap-3 shadow ${className}`}>
        <div>
        <p className="text-sm text-gray-500">{title}</p>
           
        </div>
      <div className="flex justify-between items-center">
         
            {icon}

      <h2 className="text-xl font-bold mt-1">{value}</h2>
      <span className="text-green-500 text-sm">{change}</span>
      </div>
      <div className="flex items-end justify-end">
        <p className="caption">{timeFrame}</p>
      </div>
    </div>
  );
}