import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-card rounded-xl shadow-xl w-full ${sizeClass[size]} mx-4 transform transition-all`}
        onClick={(e)=>e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex pb-0 items-center justify-between p-4">
          <h2 className="text-lg m-0 font-medium ">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 pt-0">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;