from uuid import UUID

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.content import (
    ContentItem,
)
from app.db.models.content import (
    ContentType as ModelContentType,
)
from app.db.models.content import (
    PublishingStatus as ModelPublishingStatus,
)
from app.schemas.content import (
    ContentItemCreate,
    ContentItemRead,
    ContentItemUpdate,
    ContentType,
    PublishingStatus,
)


def to_content_read(item: ContentItem) -> ContentItemRead:
    return ContentItemRead(
        id=item.id,
        type=item.type.value,
        status=item.status.value,
        locale=item.locale,
        slug=item.slug,
        title=item.title,
        description=item.description,
        body=item.body,
        seo_title=item.seo_title,
        seo_description=item.seo_description,
        canonical_url=item.canonical_url,
        tags=item.tags,
        categories=item.categories,
        metadata=item.extra,
        ai_indexable=item.ai_indexable,
        indexed_at=item.indexed_at,
        published_at=item.published_at,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


class ContentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list(
        self,
        *,
        content_type: ContentType | None = None,
        status: PublishingStatus | None = None,
        locale: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[ContentItem], int]:
        statement = (
            self._filtered_select(
                content_type=content_type,
                status=status,
                locale=locale,
            )
            .order_by(ContentItem.updated_at.desc())
            .limit(limit)
            .offset(offset)
        )
        count_statement = select(func.count()).select_from(
            self._filtered_select(
                content_type=content_type,
                status=status,
                locale=locale,
            ).subquery()
        )

        result = await self.session.execute(statement)
        total = await self.session.scalar(count_statement)
        return list(result.scalars().all()), int(total or 0)

    async def get(self, item_id: UUID) -> ContentItem | None:
        return await self.session.get(ContentItem, item_id)

    async def get_by_slug(
        self,
        *,
        content_type: ContentType,
        slug: str,
        locale: str = "en",
        status: PublishingStatus | None = None,
    ) -> ContentItem | None:
        statement = self._filtered_select(
            content_type=content_type,
            status=status,
            locale=locale,
        ).where(ContentItem.slug == slug)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def create(self, payload: ContentItemCreate) -> ContentItem:
        item = ContentItem(
            type=ModelContentType(payload.type),
            status=ModelPublishingStatus(payload.status),
            locale=payload.locale,
            slug=payload.slug,
            title=payload.title,
            description=payload.description,
            body=payload.body,
            seo_title=payload.seo_title,
            seo_description=payload.seo_description,
            canonical_url=payload.canonical_url,
            tags=payload.tags,
            categories=payload.categories,
            extra=payload.metadata,
            ai_indexable=payload.ai_indexable,
            published_at=payload.published_at,
        )
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def update(
        self,
        item: ContentItem,
        payload: ContentItemUpdate,
    ) -> ContentItem:
        values = payload.model_dump(exclude_unset=True)
        if "metadata" in values:
            item.extra = values.pop("metadata")
        if "status" in values and values["status"] is not None:
            item.status = ModelPublishingStatus(values.pop("status"))

        for key, value in values.items():
            setattr(item, key, value)

        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def delete(self, item: ContentItem) -> None:
        await self.session.delete(item)
        await self.session.commit()

    def _filtered_select(
        self,
        *,
        content_type: ContentType | None,
        status: PublishingStatus | None,
        locale: str | None,
    ) -> Select[tuple[ContentItem]]:
        statement = select(ContentItem)
        if content_type:
            statement = statement.where(
                ContentItem.type == ModelContentType(content_type)
            )
        if status:
            statement = statement.where(
                ContentItem.status == ModelPublishingStatus(status)
            )
        if locale:
            statement = statement.where(ContentItem.locale == locale)
        return statement
