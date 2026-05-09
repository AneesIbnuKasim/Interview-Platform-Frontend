const TableRow = ({ item, columns, actions = {} }) => {
  return (
    <tr>
      {columns.map((col) => (
        <td key={col}>
          {item[col] ?? "---"}
        </td>
      ))}

      {/* Dynamic actions */}
      {actions && (
        <td>
          {actions.onEdit && (
            <button onClick={() => actions.onEdit(item)}>Edit</button>
          )}

          {actions.onDelete && (
            <button onClick={() => actions.onDelete(item)}>Delete</button>
          )}

          {actions.onView && (
            <button onClick={() => actions.onView(item)}>View</button>
          )}
        </td>
      )}
    </tr>
  );
};

export default TableRow