from pydantic import BaseModel


class YearsSchema(BaseModel):
    id: str
    start_year: int
    end_year: int
