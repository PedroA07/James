import base64
from functools import lru_cache
from github import Github
from app.config import settings


def _get_repo():
    g = Github(settings.github_token)
    return g.get_repo(settings.github_vault_repo)


def _fetch_all_notes() -> list[dict]:
    """Fetches all .md files from the GitHub vault repo."""
    repo = _get_repo()
    notes = []

    def walk(path=""):
        contents = repo.get_contents(path, ref=settings.github_vault_branch)
        for item in contents:
            if item.type == "dir":
                walk(item.path)
            elif item.name.endswith(".md"):
                text = base64.b64decode(item.content).decode("utf-8", errors="ignore")
                notes.append({"path": item.path, "content": text})

    walk()
    return notes


def search_notes_by_keyword(query: str, max_results: int = 5) -> list[dict]:
    """Simple keyword search across all notes. Used in Phase 1 (no embeddings yet)."""
    notes = _fetch_all_notes()
    query_lower = query.lower()
    scored = []

    for note in notes:
        text = note["content"].lower()
        # score = number of query words found in the note
        words = query_lower.split()
        score = sum(1 for w in words if w in text)
        if score > 0:
            scored.append((score, note))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [n for _, n in scored[:max_results]]


def format_notes_for_prompt(notes: list[dict]) -> str:
    if not notes:
        return ""
    parts = ["## Notas relevantes da memória:\n"]
    for note in notes:
        parts.append(f"### {note['path']}\n{note['content'][:1500]}\n")
    return "\n".join(parts)
