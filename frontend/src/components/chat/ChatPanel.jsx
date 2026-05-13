import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  markRead,
  receiveMessage,
  setChatError,
  setChatStatus,
  setMessages,
  setTyping,
} from "@/features/chat/chatSlice";
import { Avatar } from "@/components/common/Avatar";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { connectSocket, socketEvents } from "@/lib/socket";

function fmt(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createClientId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

export function ChatPanel({ roomId }) {
  const { messages, typing, error } = useAppSelector((s) => s.chat);
  const me = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const endRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const socket = connectSocket();

    if (!socket || !roomId) {
      dispatch(setChatError("Realtime chat unavailable"));
      return undefined;
    }

    const handleHistory = (payload) => {
      dispatch(setMessages(payload.messages || []));
      dispatch(markRead());
    };
    const handleMessage = (payload) => {
      dispatch(receiveMessage(payload.message));
    };
    const handleTyping = (payload) => {
      const name = payload.user?.name;
      if (!name || payload.user?.userId === me?.id) return;

      dispatch(setTyping(payload.isTyping ? [name] : []));
    };
    const handleError = (payload) => {
      dispatch(setChatError(payload?.message || "Chat sync failed"));
    };
    const requestHistory = () => {
      dispatch(setChatStatus("loading"));
      socket.emit(
        socketEvents.CHAT_HISTORY_REQUEST,
        { roomId, limit: 50 },
        (response) => {
          if (response?.success === false) {
            dispatch(setChatError(response.message || "Unable to load chat"));
            return;
          }

          dispatch(setMessages(response?.messages || []));
          dispatch(markRead());
        },
      );
    };

    socket.on(socketEvents.CHAT_HISTORY, handleHistory);
    socket.on(socketEvents.CHAT_MESSAGE_CREATED, handleMessage);
    socket.on(socketEvents.CHAT_TYPING, handleTyping);
    socket.on(socketEvents.CHAT_ERROR, handleError);

    requestHistory();
    socket.emit(socketEvents.CHAT_READ, { roomId });

    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }

      socket.off(socketEvents.CHAT_HISTORY, handleHistory);
      socket.off(socketEvents.CHAT_MESSAGE_CREATED, handleMessage);
      socket.off(socketEvents.CHAT_TYPING, handleTyping);
      socket.off(socketEvents.CHAT_ERROR, handleError);
    };
  }, [dispatch, me?.id, roomId]);

  function emitTyping(isTyping) {
    const socket = connectSocket();
    if (!socket || !roomId) return;

    socket.emit(socketEvents.CHAT_TYPING, { roomId, isTyping });
  }

  function updateText(value) {
    setText(value);
    emitTyping(Boolean(value.trim()));

    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    typingTimer.current = setTimeout(() => {
      emitTyping(false);
    }, 1200);
  }

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const socket = connectSocket();
    const clientId = createClientId();

    if (!socket || !roomId) {
      dispatch(setChatError("Realtime chat unavailable"));
      return;
    }

    socket.emit(
      socketEvents.CHAT_MESSAGE_SEND,
      { roomId, text: text.trim(), clientId },
      (response) => {
        if (response?.success === false) {
          dispatch(setChatError(response.message || "Unable to send message"));
          return;
        }

        if (response?.message) {
          dispatch(receiveMessage(response.message));
        }
      },
    );
    emitTyping(false);
    setText("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border/60 px-4 py-3 text-sm font-semibold">
        Chat
      </div>
      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-3">
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const mine = m.authorId === (me?.id ?? "u1");
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 ${
                  mine ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar name={m.authorName} size={26} />
                <div
                  className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <div className="text-xs opacity-70">
                    {m.authorName} · {fmt(m.ts)}
                  </div>
                  <div className="mt-0.5 break-words">{m.text}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {typing.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {typing.join(", ")} typing…
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={submit}
        className="flex gap-2 border-t border-border/60 p-3"
      >
        <Input
          value={text}
          onChange={(e) => updateText(e.target.value)}
          placeholder="Write a message…"
          className="h-10"
        />
        <Button type="submit" size="icon">
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}
