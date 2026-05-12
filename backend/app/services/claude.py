import anthropic
from app.config import settings
from app.models.chat import Message


_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)


def chat(
    message: str,
    history: list[Message],
    context_notes: str = "",
) -> tuple[str, int]:
    """
    Calls Claude API with context-injected system prompt.
    Returns (reply_text, total_tokens_used).
    """
    system = settings.james_system_prompt
    if context_notes:
        system = f"{system}\n\n{context_notes}"

    messages = [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": message})

    response = _client.messages.create(
        model=settings.claude_model,
        max_tokens=settings.max_tokens,
        system=system,
        messages=messages,
    )

    reply = response.content[0].text
    tokens = response.usage.input_tokens + response.usage.output_tokens
    return reply, tokens
