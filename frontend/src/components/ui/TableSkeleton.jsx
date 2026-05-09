// ---------------- TABLE SKELETON ----------------

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl overflow-hidden animate-pulse">
      {/* Desktop Table */}
      <table className="hidden md:table w-full">
        <thead className="bg-gray-100">
          <tr>
            {[...Array(cols)].map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {[...Array(rows)].map((_, r) => (
            <tr key={r} className="border-t border-gray-300">
              {[...Array(cols)].map((_, c) => (
                <td key={c} className="px-4 py-13">
                  <div className="h-4 w-full bg-gray-100 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-xl p-4 space-y-3"
          >
            {[...Array(cols)].map((_, j) => (
              <div key={j} className="space-y-1">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
