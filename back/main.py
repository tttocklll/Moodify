import uvicorn

from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app import crud, models, schemas
from app.database import SessionLocal, engine

ACCESS_TOKEN_EXPIRE_MINUTES = 10000

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
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


@app.post("/token/", response_model=schemas.Token)
async def login_for_access_token(form_data: schemas.Login, db: Session = Depends(get_db)):
    print(form_data.email, form_data.password)
    student = await crud.authenticate_student(
        db, form_data.email, form_data.password)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = await crud.create_access_token(
        data={"sub": student.name}, expires_delta=access_token_expires
    )
    print(access_token)
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/students/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = crud.get_student_by_email(db, email=student.email)
    if db_student:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_student(db=db, student=student)


@app.get("/students/", response_model=List[schemas.Student])
def read_students(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    students = crud.get_all_students(db, skip=skip, limit=limit)
    return students


@app.get("/status/", response_model=schemas.Student)
async def get_status(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await crud.get_current_student(db, token)


@app.post("/post/")
async def post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    student = await crud.get_current_student(db, token)
    user_id = student.id
    post = await crud.create_post(db, post, user_id)
    return post


@app.post("/questions/")
def create_questions(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, question)


# test
@app.get("/test/")
async def test():
    return {"test": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")
