import uvicorn
from functools import wraps
from typing import List
from collections import Counter
from fastapi import Depends, FastAPI, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime
import calendar
from app import crud, models, schemas
from app.database import SessionLocal, engine

ACCESS_TOKEN_EXPIRE_MINUTES = 10000

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Authorization Decorator
def authorization(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper


def async_authorization(fn):
    @wraps(fn)
    async def wrapper(*args, **kwargs):
        return await fn(*args, **kwargs)
    return wrapper

# time functions


def get_firstdate_unix(year: int, month: int):
    return datetime.datetime(year, month, 1).timestamp()


def get_lastdate_unix(year: int, month: int):
    nextdate = datetime.datetime(year, month + 1, 1)
    lastdate = nextdate - datetime.timedelta(seconds=1)
    return lastdate.timestamp()


def get_startday_unix(year: int, month: int, date: int):
    return datetime.datetime(year, month, date).timestamp()


def get_noon_unix(year: int, month: int, date: int):
    return datetime.datetime(year, month, date, 12).timestamp()


def get_endday_unix(year: int, month: int, date: int):
    return datetime.datetime(year, month, date, 23, 59, 59).timestamp()
    # endpoints


@app.post("/token/", response_model=schemas.Token)
async def login_for_access_token(form_data: schemas.Login, db: Session = Depends(get_db)):
    student = await crud.authenticate_student(
        db, form_data.email, form_data.password)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = await crud.create_access_token(
        data={"username": student.name, "email": student.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/students/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = crud.get_student_by_email(db, email=student.email)
    if db_student:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_student(db=db, student=student)


@app.get("/students/", response_model=List[schemas.Student])
async def get_all_students(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
):
    students = crud.get_all_students(db, skip=skip, limit=limit)
    return students


@app.get("/status/", response_model=schemas.Student)
@async_authorization
async def get_status(token: str = Header(None), db: Session = Depends(get_db)):
    return await crud.get_current_student(token, db)


@app.post("/post/")
@async_authorization
async def post(
    post: schemas.PostCreate,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    student = await crud.get_current_student(token, db)
    user_id = student.id
    post = await crud.create_post(db, post, user_id)
    return post


@app.get("/post/")
@async_authorization
async def get_post_monthly(year: int, month: int, token: str = Header(None), db: Session = Depends(get_db)):
    student = await crud.get_current_student(token, db)
    start = get_firstdate_unix(year, month)
    end = get_lastdate_unix(year, month)
    return await crud.get_post_by_user_and_time(db, start, end, student.id)


@app.post("/questions/")
def create_questions(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, question)


@app.get("/questions/")
def get_all_questions(db: Session = Depends(get_db)):
    return crud.get_all_question(db)


@app.get("/chat-questions/")
@async_authorization
async def get_chat_questions(token: str = Header(None), db: Session = Depends(get_db)):
    student = await crud.get_current_student(token, db)
    q1 = await crud.get_question_by_id(db, student.q1)
    q2 = await crud.get_question_by_id(db, student.q2)
    q3 = await crud.get_question_by_id(db, student.q3)
    questions = [q1, q2, q3]
    return questions


@app.post("/update-questions/{user_id}")
async def update_next_questions(user_id: int, questions: List[int], db: Session = Depends(get_db)):
    if len(questions) != 3:
        raise HTTPException(
            status_code=422, detail="Questions must have 3 integers")
    for i in questions:
        question = crud.get_question_by_id(db, i)
        if not question:
            raise HTTPException(
                status_code=422, detail=f"Question id:{i} not found.")
    return await crud.update_next_questions(db, questions, user_id)

# TODO: user_idからポジティブ・ネガティブ要素


@app.get("/get-factor/positive")
@async_authorization
async def get_positive_factor(token: str = Header(None), db: Session = Depends(get_db)):
    student = await crud.get_current_student(token, db)
    posts = list(
        filter(lambda item: item.emotion_value > 3, student.posts))
    temp = []
    for post in posts:
        for scene in post.scenes:
            temp.append(scene.scene)
    counters = Counter(temp).most_common()
    return [factor[0] for factor in counters]


@app.get("/get-factor/negative")
@async_authorization
async def get_negative_factor(token: str = Header(None), db: Session = Depends(get_db)):
    student = await crud.get_current_student(token, db)
    posts = list(
        filter(lambda item: item.emotion_value <= 3, student.posts))
    temp = []
    for post in posts:
        for scene in post.scenes:
            temp.append(scene.scene)
    counters = Counter(temp).most_common()
    return [factor[0] for factor in counters]


@app.get("/get-post-detail/{post_id}")
@async_authorization
async def get_post_detail(post_id: int, token: str = Header(None), db: Session = Depends(get_db)):
    post = await crud.get_post(db, post_id)
    # answersの中にquestionを含めるための作業
    # SQLAlchemyに多分もっといいのがあるはず
    for answer in post.answers:
        answer.question
    return {"scenes": post.scenes, "answers": post.answers}

# test


@app.get("/test/")
def test(db: Session = Depends(get_db)):
    print(datetime.datetime.fromtimestamp(get_lastdate_unix(2020, 9)))

    return {"test": "OK"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")
