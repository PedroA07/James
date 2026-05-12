"use client";

interface Props {
  role: "user" | "assistant";
  content: string;
  notesUsed?: string[];
}

export default function ChatMessage({ role, content, notesUsed }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
        style={{
          background: isUser ? "#6366f1" : "#2a2a2a",
          color: isUser ? "#fff" : "#e8e8e8",
        }}
      >
        {isUser ? "P" : "J"}
      </div>

      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            background: isUser ? "#1e1e2e" : "#1a1a1a",
            border: `1px solid ${isUser ? "#3d3d5c" : "#2a2a2a"}`,
            color: "#e8e8e8",
          }}
        >
          {content}
        </div>

        {notesUsed && notesUsed.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {notesUsed.map((note) => (
              <span
                key={note}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#1a1a2e", color: "#888", border: "1px solid #2a2a3e" }}
                title={note}
              >
                {note.split("/").pop()?.replace(".md", "")}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
