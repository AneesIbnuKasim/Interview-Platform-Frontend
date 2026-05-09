
import { ACTIVE_STATUS, ORDER_STATUS } from "../../config/app";
import formatImageUrl from "../../utils/formatImageUrl";

const Table = ({
  data = [],
  columns,
  actions,
  keyId = "_id",
  type = "",
  onStatusChange,
}) => {
  const STATUS_OPTIONS =
    type === "orders" ? ORDER_STATUS : type === "status" ? ACTIVE_STATUS : [];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border bg-white border-gray-300 rounded-xl ">
        {/* Desktop Header */}
        <thead className="hidden md:table-header-group">
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 border border-gray-300 font-medium text-left"
              >
                {col.toUpperCase()}
              </th>
            ))}

            {actions && (
              <th className="px-4 py-2 border border-gray-300 font-medium text-left">
                ACTIONS
              </th>
            )}
          </tr>
        </thead>

        <tbody className="block md:table-row-group">
          {data.map((item) => (
            <tr
              key={item[keyId]}
              className="block md:table-row bg-slate-100 md:bg-white rounded-xl shadow-sm md:shadow-none m-4 "
            >
              {columns.map((col) => {
                const value = item[col.replace(" ", "")];

                return (
                  <td
                    key={col}
                    className="block md:table-cell px-4 py-2 border border-gray-200"
                  >
                    {/* Mobile Label */}
                    <span className="md:hidden block text-xs text-gray-500 font-semibold mb-1">
                      {col.toUpperCase()}
                    </span>

                    {/* Content */}
                    {col === "order Status" || col === "status" ? (
                      <select
                        value={item.orderStatus ?? item.status}
                        onChange={(e) =>
                          onStatusChange?.(item._id, e.target.value)
                        }
                        className="rounded px-2 py-1 text-sm w-full md:w-auto"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : col === "images" || col === "image" ? (
                      <img
                        width={70}
                        height={70}
                        className="rounded border border-gray-200"
                        src={formatImageUrl(
                          col === "images"
                            ? item[col]?.[0]
                            : item[col]
                        )}
                        alt="preview"
                      />
                    ) : (
                      <span>{value ?? "---"}</span>
                    )}
                  </td>
                );
              })}

              {/* Actions */}
              {actions && (
                <td className="block md:table-cell px-4 py-2 border border-gray-200">
                  <span className="md:hidden block text-xs text-gray-500 font-semibold mb-1">
                    ACTIONS
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {actions.onEdit && (
                      <button
                        onClick={() => actions.onEdit(item)}
                        className="px-2 py-1 text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}

                    {actions.onDelete && (
                      <button
                        onClick={() => actions.onDelete(item)}
                        className="px-2 py-1 text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}

                    {actions.onView && (
                      <button
                        onClick={() => actions.onView(item)}
                        className="px-2 py-1 text-green-600 hover:underline"
                      >
                        View
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;