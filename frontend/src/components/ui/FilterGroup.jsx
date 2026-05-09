import React from "react";

const FilterGroup = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "banned", label: "Banned" },
  ];

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "createdAt", label: "Date Created" },
    { value: "status", label: "Status" },
  ];

  const itemsPerPageOptions = [
    { value: 5, label: "5 per page" },
    { value: 10, label: "10 per page" },
    { value: 25, label: "25 per page" },
    { value: 50, label: "50 per page" },
  ];

  return (
    <div className="card border-0 shadow-lg glass-card hover-lift">
      <div className="card-header bg-transparent border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-primary">
            <i className="bi bi-funnel me-2"></i>Filter & Search
          </h5>
          <div className="btn-group" role="group">
            <input
              type="radio"
              className="btn-check"
              name="viewMode"
              id="tableView"
              checked={viewMode === "table"}
              onChange={() => onViewModeChange("table")}
            />
            <label
              className="btn btn-outline-primary btn-sm"
              htmlFor="tableView"
            >
              Table
            </label>
            <input
              type="radio"
              className="btn-check"
              name="viewMode"
              id="cardView"
              checked={viewMode === "card"}
              onChange={() => onViewModeChange("card")}
            />
            <label
              className="btn btn-outline-primary btn-sm"
              htmlFor="cardView"
            >
              Cards
            </label>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="position-relative">
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <button
                className="btn btn-outline-secondary btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                onClick={onResetFilters}
                title="Reset all filters"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => onRoleChange(e.target.value)}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <button
              className={`btn w-100 ${
                sortOrder === "asc" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() =>
                onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
              }
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <i
                className={`bi bi-sort-${sortOrder === "asc" ? "up" : "down"}`}
              ></i>
            </button>
          </div>
          <div className="col-md-1">
            <select
              className="form-select"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterGroup;
