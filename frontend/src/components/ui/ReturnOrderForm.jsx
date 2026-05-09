import { useState } from "react";
import Button from "./Button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReturnOrderModal({ returnId, onOpen, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  return (
    <AnimatePresence>
      {onOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-[360px] rounded-2xl bg-red-50 shadow-xl border">
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Return item</h2>
                  <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select a reason</option>
                    <option value="DAMAGED">Damaged product</option>
                    <option value="WRONG_ITEM">Wrong item received</option>
                    <option value="NOT_AS_DESCRIBED">Not as described</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional note (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Add a short explanation"
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 rounded-xl"
                    disabled={!reason}
                    onClick={() => onSubmit({ returnId, reason, note })}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
