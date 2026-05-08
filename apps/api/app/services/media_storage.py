from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import get_settings


@dataclass(slots=True)
class StoredMediaAsset:
    id: str
    filename: str
    content_type: str
    size: int
    url: str
    alt_text: str | None
    created_at: datetime


class LocalMediaStorage:
    def __init__(self) -> None:
        settings = get_settings()
        self.base_path = Path(settings.media_storage_path)
        self.public_base = settings.media_public_url_base.rstrip("/")
        self.base_path.mkdir(parents=True, exist_ok=True)

    async def save_image(
        self,
        upload: UploadFile,
        *,
        alt_text: str | None = None,
    ) -> StoredMediaAsset:
        if not upload.content_type or not upload.content_type.startswith("image/"):
            raise ValueError("Only image uploads are supported")

        now = datetime.now(UTC)
        asset_id = uuid4().hex
        safe_name = _safe_filename(upload.filename or "asset")
        relative_path = Path(now.strftime("%Y/%m")) / f"{asset_id}-{safe_name}"
        target_path = self.base_path / relative_path
        target_path.parent.mkdir(parents=True, exist_ok=True)

        content = await upload.read()
        target_path.write_bytes(content)

        return StoredMediaAsset(
            id=asset_id,
            filename=target_path.name,
            content_type=upload.content_type,
            size=len(content),
            url=f"{self.public_base}/{relative_path.as_posix()}",
            alt_text=alt_text,
            created_at=now,
        )

    def list_assets(self, *, limit: int = 60) -> list[StoredMediaAsset]:
        files = sorted(
            [path for path in self.base_path.rglob("*") if path.is_file()],
            key=lambda path: path.stat().st_mtime,
            reverse=True,
        )[:limit]
        items: list[StoredMediaAsset] = []
        for path in files:
            relative_path = path.relative_to(self.base_path)
            stat = path.stat()
            items.append(
                StoredMediaAsset(
                    id=path.stem.split("-", 1)[0],
                    filename=path.name,
                    content_type=_guess_content_type(path.suffix),
                    size=stat.st_size,
                    url=f"{self.public_base}/{relative_path.as_posix()}",
                    alt_text=None,
                    created_at=datetime.fromtimestamp(stat.st_mtime, tz=UTC),
                )
            )
        return items


def _safe_filename(filename: str) -> str:
    stem = "".join(ch.lower() if ch.isalnum() else "-" for ch in filename).strip("-")
    return stem or "asset"


def _guess_content_type(suffix: str) -> str:
    extension = suffix.lower()
    if extension == ".png":
        return "image/png"
    if extension in {".jpg", ".jpeg"}:
        return "image/jpeg"
    if extension == ".webp":
        return "image/webp"
    if extension == ".gif":
        return "image/gif"
    if extension == ".svg":
        return "image/svg+xml"
    return "application/octet-stream"