import { motion } from "framer-motion";
import OrderViewCard from "./OrderViewCard.jsx";

// ================= MODAL WRAPPER =================
export const OrderDetailModal = ({ open, onClose, order, onStatusChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full bg-white shadow p-2 hover:bg-gray-100"
        >
          ✕
        </button>

        <OrderViewCard order={order} onStatusChange={onStatusChange} />
      </motion.div>
    </div>
  );
};