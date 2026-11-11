from pydantic import BaseModel


class ShapeInfoSchema(BaseModel):
    country: str
    admin_level: int
    version: int
    admin_name_count: int
    shape_hash: str
    admin_names: list[str] | None = None


class ShapesInfoListSchema(BaseModel):
    shapes: list[ShapeInfoSchema]
