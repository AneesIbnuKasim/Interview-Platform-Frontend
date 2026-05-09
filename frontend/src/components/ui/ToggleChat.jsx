import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { sendChatMessage, setMessages } from "../../redux/slices/chatSlice"

export default function ToggleChat() {
  const [open, setOpen] = useState(false)
  const [ message, setMessage ] = useState('')
  const dispatch = useDispatch()
  const { messages } = useSelector(state => state.chat) 

  const sendMessage = () => {
    if (!message.trim()) return
    dispatch(setMessages({ id: Date.now(), from: "user", text: message }))
    dispatch(sendChatMessage(message))
    setMessage("")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-14 w-14 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg hover:bg-violet-700 transition"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-20 right-0"
          >
            <div className="w-80 h-105 bg-chat-card rounded-2xl shadow-xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 font-semibold shadow-xl bg-card">
                Live Chat
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 p-4">
                {messages?.map((m) => (
                  <div
                    key={m.id}
                    className={`text-sm max-w-[75%] px-3 py-2 rounded-xl ${
                      m.from === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 shadow-xl bg-card flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
