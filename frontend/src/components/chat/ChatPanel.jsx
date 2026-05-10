import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage } from "@/features/chat/chatSlice";
import { Avatar } from "@/components/common/Avatar";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

function fmt(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatPanel() {
  const { messages, typing } = useAppSelector(s => s.chat);
  const me = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(sendMessage({
      id: Math.random().toString(36).slice(2),
      authorId: me?.id ?? "u1",
      authorName: me?.name ?? "You",
      text: text.trim(),
      ts: Date.now(),
    }));
    setText("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border/60 px-4 py-3 text-sm font-semibold">Chat</div>
      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-3">
        <AnimatePresence initial={false}>
          {messages.map(m => {
            const mine = m.authorId === (me?.id ?? "u1");
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}
              >
                <Avatar name={m.authorName} size={26} />
                <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  <div className="text-xs opacity-70">{m.authorName} · {fmt(m.ts)}</div>
                  <div className="mt-0.5 break-words">{m.text}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {typing.length > 0 && (
          <div className="text-xs text-muted-foreground">{typing.join(", ")} typing…</div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-border/60 p-3">
        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message…" className="h-10"/>
        <Button type="submit" size="icon"><Send size={16}/></Button>
      </form>
    </div>
  );
}
