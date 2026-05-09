import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDialog = memo(({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}) => {

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-inner-card rounded-2xl shadow-2xl p-6 w-[90%] max-w-md"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
        >
          {/* Title */}
          <h2 className="text-xl font-semibold text-primary mb-2">
            {title}
          </h2>

          {/* Message */}
          <p className="text-secondary mb-5">
            {message}
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-500"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-white 
                ${danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default ConfirmDialog;