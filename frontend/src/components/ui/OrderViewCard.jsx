import { motion } from "framer-motion";
import { Package, MapPin, CreditCard, Clock, RefreshCcw } from "lucide-react";
import formatImageUrl from "../../utils/formatImageUrl";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const StatusBadge = ({ status }) => {
  const COLORS = {
    PENDING: "bg-yellow-100 text-yellow-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    RETURN_INITIATED: "bg-orange-100 text-orange-700",
    RETURNED: "bg-purple-100 text-purple-700",
    PAID: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        COLORS[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800">{value || "—"}</span>
  </div>
);

const OrderViewCard = ({ order, onStatusChange }) => {
  if (!order) return null;

  const [localStatus, setLocalStatus] = useState(order.orderStatus);

  useEffect(() => {
    setLocalStatus(order.orderStatus);
  }, [order.orderStatus]);

  const { filters } = useSelector((state) => state.order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-violet-600" />
          <div>
            <h2 className="text-lg font-semibold">Order #{order.orderId}</h2>
            <p className="text-xs text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <StatusBadge status={localStatus} />
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* ================= ORDER ITEMS ================= */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Items</h3>

        <div className="divide-y rounded-lg border">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={formatImageUrl(item.product?.images?.[0])}
                  alt={item.product?.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />

                <div>
                  <p className="text-sm font-medium">{item.product?.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × ₹{item.finalUnitPrice}
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold">₹{item.itemTotal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= GRID SECTIONS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CUSTOMER / ADDRESS */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <h4 className="font-semibold text-sm">Delivery Address</h4>
          </div>

          <InfoRow label="Name" value={order.deliveryAddress?.name} />
          <InfoRow label="Phone" value={order.deliveryAddress?.phone} />
          <InfoRow
            label="Address"
            value={`${order.deliveryAddress?.addressLine}, ${order.deliveryAddress?.city}`}
          />
          <InfoRow label="State" value={order.deliveryAddress?.state} />
          <InfoRow label="Pincode" value={order.deliveryAddress?.pincode} />
        </div>

        {/* PAYMENT */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <h4 className="font-semibold text-sm">Payment Info</h4>
          </div>

          <InfoRow label="Method" value={order.paymentMethod} />
          <InfoRow label="Status" value={order.paymentStatus} />
          <InfoRow
            label="Paid At"
            value={order.paidAt ? new Date(order.paidAt).toLocaleString() : "—"}
          />

          {order.paymentInfo?.razorpayPaymentId && (
            <InfoRow
              label="Razorpay ID"
              value={order.paymentInfo.razorpayPaymentId}
            />
          )}
        </div>

        {/* SUMMARY */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <h4 className="font-semibold text-sm">Summary</h4>
          </div>

          <InfoRow label="Items" value={order.items.length} />
          <InfoRow label="Discount" value={`₹${order.totalDiscount || 0}`} />
          <InfoRow label="Total" value={`₹${order.totalAmount}`} />

          <div className="pt-2">
            <label className="text-xs text-gray-500">Order Status</label>
            <select
              value={localStatus}
              onChange={(e) => {
                const newStatus = e.target.value;
                setLocalStatus(newStatus);
                onStatusChange?.(order._id, e.target.value);
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="PENDING">PENDING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="RETURN_INITIATED">RETURN INITIATED</option>
              <option value="RETURNED">RETURNED</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= RETURN INFO ================= */}
      {order.returnInfo?.reason && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCcw className="w-4 h-4 text-orange-600" />
            <h4 className="font-semibold text-sm text-orange-700">
              Return Information
            </h4>
          </div>

          <InfoRow label="Reason" value={order.returnInfo.reason} />
          <InfoRow label="Note" value={order.returnInfo.note} />
          <InfoRow
            label="Requested On"
            value={
              order.returnInfo.date
                ? new Date(order.returnInfo.date).toLocaleString()
                : "—"
            }
          />
        </div>
      )}
    </motion.div>
  );
};

export default OrderViewCard;
