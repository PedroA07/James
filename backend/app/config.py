from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env relative to this file's directory (works locally and on Railway)
_ENV_FILE = Path(__file__).parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        env_ignore_empty=True,
        extra="ignore",
    )

    anthropic_api_key: str
    supabase_url: str = ""
    supabase_service_key: str = ""
    github_token: str
    github_vault_repo: str
    github_vault_branch: str = "main"
    james_system_prompt: str = (
        "Você é James, assistente pessoal do Pedro. "
        "Responda em português, de forma direta e prática. "
        "Use as notas fornecidas como contexto quando relevantes."
    )
    claude_model: str = "claude-sonnet-4-6"
    max_context_notes: int = 5
    max_tokens: int = 1024


settings = Settings()
