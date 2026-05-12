"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage, type Message } from "../lib/api";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

interface DisplayMessage extends Message {
  notesUsed?: string[];
  tokensUsed?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text: string) {
    const userMsg: DisplayMessage = { role: "user", content: text };
    const history: Message[] = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await sendMessage(text, history);
      const assistantMsg: DisplayMessage = {
        role: "assistant",
        content: res.reply,
        notesUsed: res.notes_used,
        tokensUsed: res.tokens_used,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setTotalTokens((t) => t + res.tokens_used);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar com o backend. Verifique se a API está rodando." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col" style={{ background: "#0f0f0f", height: "100dvh" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid #2a2a2a" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "#6366f1", color: "#fff" }}
          >
            J
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: "#e8e8e8" }}>James</div>
            <div className="text-xs" style={{ color: "#888" }}>Assistente pessoal</div>
          </div>
        </div>
        {totalTokens > 0 && (
          <div className="text-xs" style={{ color: "#555" }}>
            {totalTokens.toLocaleString()} tokens usados
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#6366f1" }}
            >
              J
            </div>
            <p className="text-sm" style={{ color: "#888" }}>
              Olá. Sou o James, seu assistente pessoal.<br />
              Como posso ajudar?
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg.role}
                content={msg.content}
                notesUsed={msg.notesUsed}
              />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{ background: "#2a2a2a", color: "#e8e8e8" }}
                >
                  J
                </div>
                <div
                  className="rounded-2xl px-4 py-3 flex items-center gap-1"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: "#555", animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid #2a2a2a" }}
      >
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={loading} />
          <p className="text-center text-xs mt-2" style={{ color: "#444" }}>
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
}
