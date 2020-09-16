from typing import List, Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None


class Login(BaseModel):
    email: str
    password: str


class QuestionBase(BaseModel):
    question: str
    type: int


class QuestionCreate(QuestionBase):
    pass


class Question(QuestionBase):
    id: int

    class Config:
        orm_mode = True


class AnswerBase(BaseModel):
    answer: str
    question_id: int


class AnswerCreate(AnswerBase):
    pass


class Answer(AnswerBase):

    class Config:
        orm_mode = True


class SceneBase(BaseModel):
    scene: str


class SceneCreate(SceneBase):
    pass


class Scene(SceneBase):
    post_id: int

    class Config:
        orm_mode = True


class PostBase(BaseModel):
    emotion_value: int
    emotion_phrase: str
    comment: Optional[str] = None
    temp_scenes: Optional[List[str]] = None
    answers: List[Answer]


class PostCreate(PostBase):
    pass


class Post(PostBase):
    id: int
    user_id: int
    posted_at: float
    scenes: List[Scene]

    class Config:
        orm_mode = True


class StudentBase(BaseModel):
    name: str
    email: str


class StudentCreate(StudentBase):
    password: str


class Student(StudentBase):
    id: int
    posts: List[Post] = None
    q1: Optional[int] = None
    q2: Optional[int] = None
    q3: Optional[int] = None

    class Config:
        orm_mode = True
