from sqlalchemy.orm import Session
from . import models, schemas
import hashlib
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import Depends, FastAPI, HTTPException, status

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "91a63ede3ef783ba8e1578db94068af8dc23bacb6624fd1e720d66627a0e0fdb"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Authentication

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


# also usable for Authorization
async def get_current_student(token: str, db: Session):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username, email=email)
    except JWTError:
        raise credentials_exception
    student = get_student_by_email(db, token_data.email)
    if student is None:
        raise credentials_exception
    return student


async def authenticate_student(db: Session, email: str, password: str):
    student = get_student_by_email(db, email)
    if not student:
        return False
    if not verify_password(password, student.hashed_password):
        return False
    return student


async def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# student

def get_student(db: Session, user_id: int):
    return db.query(models.Student).filter(models.Student.id == user_id).first()


def get_all_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()


def get_student_by_email(db: Session, email: str):
    return db.query(models.Student).filter(models.Student.email == email).first()


def get_student_by_name(db: Session, user_name: str):
    return db.query(models.Student).filter(models.Student.name == user_name).first()


def create_student(db: Session, student: schemas.StudentCreate):
    hashed_password = get_password_hash(student.password)
    db_student = models.Student(
        name=student.name,
        hashed_password=hashed_password,
        email=student.email,
        q1=1, q2=2, q3=3
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


# post

async def get_post(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()


async def get_post_by_user_id(db: Session, user_id: int):
    return db.query(models.Post).filter(models.Post.user_id == user_id).all()


async def get_post_by_time(db: Session, start: float, end: float):
    return db.query(models.Post).filter(start <= models.Post.posted_at).filter(models.Post.posted_at <= end).all()


async def get_post_by_user_and_time(db: Session, start: float, end: float, user_id: int):
    return db.query(models.Post).filter(start <= models.Post.posted_at).filter(models.Post.posted_at <= end).filter(models.Post.user_id == user_id).all()


async def create_post(db: Session, post: schemas.PostCreate, user_id: int):
    posted_at = datetime.now().timestamp()
    db_post = models.Post(
        user_id=user_id,
        posted_at=posted_at,
        emotion_value=post.emotion_value,
        emotion_phrase=post.emotion_phrase,
        comment=post.comment
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    for scene in post.temp_scenes:
        create_scene(db, scene, db_post.id)
    for answer in post.answers:
        create_answer(db, answer, db_post.id)
    return db_post


# scene

def create_scene(db: Session, scene: str, post_id: int):
    db_scene = models.Scene(scene=scene, post_id=post_id)
    db.add(db_scene)
    db.commit()
    db.refresh(db_scene)
    return db_scene


# question


def create_question(db: Session, question: schemas.QuestionCreate):
    db_question = models.Question(
        question=question.question, type=question.type)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


async def get_question_by_id(db: Session, id: int):
    return db.query(models.Question).filter(models.Question.id == id).first()


def get_all_question(db: Session):
    return db.query(models.Question).all()


async def update_next_questions(db: Session, questions: List[int], student_id: int):
    student = get_student(db, student_id)
    if not student:
        return None
    student.q1 = questions[0]
    student.q2 = questions[1]
    student.q3 = questions[2]
    db.commit()
    print(student.q1)
    return student

# answer


def create_answer(db: Session, answer: schemas.AnswerCreate, post_id: int):
    db_answer = models.Answer(
        post_id=post_id, answer=answer.answer, question_id=answer.question_id)
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer
