from fastapi import APIRouter
from app.models.chat import ChatRequest, ChatResponse
from app.services.vault import search_notes_by_keyword, format_notes_for_prompt
from app.services.claude import chat
from app.config import settings

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    notes = search_notes_by_keyword(req.message, max_results=settings.max_context_notes)
    context = format_notes_for_prompt(notes)

    reply, tokens = chat(
        message=req.message,
        history=req.history,
        context_notes=context,
    )

    return ChatResponse(
        reply=reply,
        notes_used=[n["path"] for n in notes],
        tokens_used=tokens,
    )
