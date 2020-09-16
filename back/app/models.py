from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship

from .database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    q1 = Column(Integer)
    q2 = Column(Integer)
    q3 = Column(Integer)

    posts = relationship("Post", back_populates="writer")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("students.id"))
    emotion_value = Column(Integer)
    emotion_phrase = Column(String)
    posted_at = Column(Float)
    comment = Column(Integer)

    writer = relationship("Student", back_populates="posts")
    scenes = relationship("Scene", back_populates="post")
    answers = relationship("Answer", back_populates="post")


class Scene(Base):
    __tablename__ = "scenes"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    scene = Column(String)

    post = relationship("Post", back_populates="scenes")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    question = Column(String)
    type = Column(Integer)

    answers = relationship("Answer", back_populates="question")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer = Column(String)

    post = relationship("Post", back_populates="answers")
    question = relationship("Question", back_populates="answers")
