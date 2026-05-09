import Button from "./Button";

export default function DateFilter({ periodPicker, filters = [], handleStartDate, handleEndDate}) {
  return (
    <div className="flex gap-2">
      {["Daily", "Weekly", "Monthly","Yearly", "Date"].map((type) => {
       const active = filters.period === type
       return  (<Button
          key={type}
          variant={"outline-custom"}
          onClick={() => {
            handleStartDate({startDate: '', endDate: ''})
            periodPicker({ period: type })
          }}
          className={`w-28 ${active ? "bg-violet-500 text-white" : ""}`}
          size="sm"
        >
          {type}
        </Button>)
})}

      <input
        type="date"
        value={filters.startDate}
        onClick={() => periodPicker({ period: 'Date' })}
        onChange={(e)=>handleStartDate({startDate: e.target.value})}
        className={`input border  text-violet-500 rounded-lg p-1 border-violet-400`}
      />
      <input
        type="date"
        value={filters.endDate}
        onChange={(e)=>handleEndDate({endDate: e.target.value})}
        className={`input border text-violet-500 rounded-lg p-1 border-violet-400`}
      />
    </div>
  );
}
