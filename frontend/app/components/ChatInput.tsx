"use client";

import { useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const text = ref.current?.value.trim();
    if (!text || disabled) return;
    onSend(text);
    if (ref.current) ref.current.value = "";
  }

  return (
    <div
      className="flex items-end gap-2 rounded-2xl p-3"
      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
    >
      <textarea
        ref={ref}
        rows={1}
        placeholder="Fala pro James..."
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
        style={{ color: "#e8e8e8", maxHeight: "160px" }}
        onInput={(e) => {
          const t = e.currentTarget;
          t.style.height = "auto";
          t.style.height = t.scrollHeight + "px";
        }}
      />
      <button
        onClick={submit}
        disabled={disabled}
        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
        style={{
          background: disabled ? "#2a2a2a" : "#6366f1",
          color: disabled ? "#555" : "#fff",
        }}
      >
        <Send size={14} />
      </button>
    </div>
  );
}
