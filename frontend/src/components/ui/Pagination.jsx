import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = "",
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`w-full mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/70 backdrop-blur px-6 py-4 shadow-sm ${className}`}
    >
      {/* Info */}
      <p className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {startItem}–{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900">{totalItems}</span>
      </p>

      {/* Pagination */}
      <nav>
        <ul className="flex items-center gap-1">
          {/* Previous */}
          <li>
            <button
              onClick={() =>
                currentPage !== 1 && onPageChange({ page: currentPage - 1 })
              }
              disabled={currentPage === 1}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={16} />
              Prev
            </button>
          </li>

          {/* Pages */}
          {getVisiblePages().map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <span className="px-3 py-1 text-gray-400">•••</span>
              ) : (
                <button
                  onClick={() => onPageChange({ page })}
                  className={`min-w-[36px] rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    page === currentPage
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          {/* Next */}
          <li>
            <button
              onClick={() =>
                currentPage !== totalPages &&
                onPageChange({ page: currentPage + 1 })
              }
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;