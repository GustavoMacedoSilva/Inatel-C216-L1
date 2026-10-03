from pydantic import BaseModel, Field


class CharacterCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    race: str = Field(min_length=1, max_length=50)
    character_class: str = Field(min_length=1, max_length=50)
    level: int = Field(default=1, ge=1)


class CharacterUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    race: str = Field(min_length=1, max_length=50)
    character_class: str = Field(min_length=1, max_length=50)
    level: int = Field(ge=1)


class CharacterLevelUpdate(BaseModel):
    level: int = Field(ge=1)


class CharacterResponse(BaseModel):
    id: int
    name: str
    race: str
    character_class: str
    level: int