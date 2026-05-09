import React from "react";
import { Link } from "react-router-dom";
import formatImageUrl from "../../utils/formatImageUrl";

const UserAvatar = ({
  user,
  size = "md", // xs, sm, md, lg, xl
  variant = "circle", // circle, rounded, square
  showName = false,
  showEmail = false,
  className = "",
  onclick
}) => {
  const getSizeClasses = () => {
    const sizes = {
      xs: { width: "32px", height: "32px", fontSize: "0.75rem" },
      sm: { width: "40px", height: "40px", fontSize: "1rem" },
      md: { width: "60px", height: "60px", fontSize: "1.5rem" },
      lg: { width: "80px", height: "80px", fontSize: "2rem" },
      xl: { width: "120px", height: "120px", fontSize: "3rem" },
    };
    return sizes[size] || sizes.md;
  };

  const getVariantClass = () => {
    switch (variant) {
      case "rounded":
        return "rounded";
      case "square":
        return "rounded-0";
      default:
        return "rounded-circle";
    }
  };

  const sizeStyle = getSizeClasses();
  const variantClass = getVariantClass();

  const avatarElement = user?.avatar ? (
    <img
      src={`${formatImageUrl(user.avatar)}` || "/LOGO.png"}
      alt={user?.name || "User"}
      className={`${variantClass} ${className} bg-gray-400 rounded-full p-0.5`}
      style={sizeStyle}
    />
  ) : (
    <div
      className={`bg-primary flex items-center justify-center rounded-full text-white ${variantClass} ${className}`}
      style={sizeStyle}
    >
      <span style={{ fontSize: sizeStyle.fontSize }}>
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </span>
    </div>
  );

  if (!showName && !showEmail) {
    return avatarElement;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-block group">
        <div className="flex">
          {avatarElement}
          <div
            className="absolute right-10 top-8  hidden min-w-[140px] 
                rounded-lg bg-white shadow-lg ring-1 ring-black/5 
                group-hover:block z-50"
          >
            <Link
              to="/admin/profile"
              className="block px-4 py-2 text-sm hover:bg-violet-100"
            >
              Profile
            </Link>

            <button onClick={onclick} className="w-full text-left px-4 py-2 text-sm hover:bg-violet-100">
              Logout
            </button>
          </div>
          {(showName || showEmail) && (
            <div className="ms-3">
              {showName && user?.name && <h6 className="mb-0">{user.name}</h6>}
              {showEmail && user?.email && (
                <p className="text-muted mb-0 small">{user.email}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;
