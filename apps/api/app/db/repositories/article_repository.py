from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.content_repository import ContentRepository


class ArticleRepository(ContentRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)
        self.content_type = "article"
