const API_URL = process.env.NEXT_PUBLIC_JAMES_API_URL ?? "http://localhost:8000";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  notes_used: string[];
  tokens_used: number;
}

export async function sendMessage(
  message: string,
  history: Message[]
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
