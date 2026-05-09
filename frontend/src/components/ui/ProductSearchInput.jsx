import { useEffect, useState } from "react";

const ProductSearchInput = ({
  label,
  products = [],
  value,
  onSelect,
  error,
}) => {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShow(true);
        }}
        placeholder="Search product..."
        className="w-full border rounded-md px-3 py-2"
      />

      {show && query && (
        <ul className="absolute z-20 w-full bg-white border border-gray-400 rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <li
                key={product._id}
                onClick={() => {
                  onSelect(product);
                  setQuery(product.name);
                  setShow(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                {product.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No products found</li>
          )}
        </ul>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ProductSearchInput;
