import {
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { API_CONFIG } from "../../config/app";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import ReturnOrderModal from "./ReturnOrderForm";
import { useNavigate } from "react-router-dom";

export default function OrderItemCard({ order, onCancel, handleReturn }) {
  const [cancelId, setCancelId] = useState(null);
  const [returnId, setReturnId] = useState(null);
  const navigate = useNavigate();

  const expectedDeliveryDate = (date) => {
    date.setDate(date.getDate() + 7);
    return date;
  };
  const deliveryDate = (date) => {
    date.setDate(date.getDate() + 10);
    return date;
  };

  const expectedReturnDate = (date) => {
    date.setDate(date.getDate() + 2);
    return date;
  };

  return (
    <div className="flex gap-6">
      <img
        src={`${API_CONFIG.imageURL2}${order?.items[0]?.product?.images?.[0]?.url}`}
        alt={order.title}
        className="w-24 h-24 rounded-xl object-cover"
      />

      <div className="flex-1">
        <h3 className="font-medium">{order.title}</h3>
        <p className="font-semibold mt-2">Order Amount: ₹{order.totalAmount}</p>
        <p className="text-sm helper mt-1">
          Payment: {order.paymentStatus}
        </p>
        <p className="text-sm helper mt-1">
          Status: {order.orderStatus}
        </p>

        {order.orderStatus === "DELIVERED" ? (
          <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
            <CheckCircle size={16} />
            Delivered on{" "}
            {deliveryDate(new Date(order.createdAt)).toDateString()}
          </div>
        ) : order.orderStatus === "CANCELLED" ? (
          <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
            <X size={16} />
            Cancelled on {new Date(order.cancelledAt).toDateString()}
          </div>
        ) : order.orderStatus === "RETURN_INITIATED" ? (
          <div className="flex items-center gap-2 text-sm text-orange-500 mt-2">
            <Clock size={16} />
            Return pickup expected by{" "}
            {expectedReturnDate(new Date()).toDateString()}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-blue-500 mt-2">
            <Clock size={16} />
            Delivery expected by{" "}
            {expectedDeliveryDate(new Date(order.createdAt)).toDateString()}
          </div>
        )}

        <div className="flex gap-4 mt-4 text-sm">
          <button
            onClick={() => navigate(`/profile/order-details/${order._id}`)}
            className="text-blue hover:underline"
          >
            Details
          </button>
          {order.orderStatus === "PENDING" && (
            <button
              onClick={() => setCancelId(order._id)}
              className="text-red-500 hover:underline"
            >
              Cancel
            </button>
          )}
          {order.orderStatus === "DELIVERED" && (
            <button
              onClick={() => setReturnId(order._id)}
              className="text-orange-500 hover:underline"
            >
              Return
            </button>
          )}
        </div>

        {/* Cancel confirmation modal */}
        <ConfirmDialog
          isOpen={!!cancelId}
          title="Are you sure to cancel"
          onCancel={() => setCancelId(null)}
          onConfirm={() => {
            onCancel(cancelId);
            setCancelId(null);
          }}
        />
        {/* Return confirmation modal */}
        <ReturnOrderModal
          returnId={returnId}
          onOpen={!!returnId}
          onClose={() => setReturnId(null)}
          onSubmit={handleReturn}
        />
      </div>
    </div>
  );
}
