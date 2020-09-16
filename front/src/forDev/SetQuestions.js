import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import { Container, TextField, Button } from "@material-ui/core";
import { setQuestions, getAllStudents } from "../api"
import ErrorMessage from './../components/ErrorMessage'

const AddQuestion = () => {
  const [students, setStudents] = useState();
  const [id, setId] = useState(1);
  const [question1, setQuestion1] = useState(null);
  const [question2, setQuestion2] = useState(null);
  const [question3, setQuestion3] = useState(null);
  const [isOK, setIsOK] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const f = async () => {
      try {
        const res = await getAllStudents();
        setStudents(res.data);
      } catch (err) {
        setErrorMessage(err.message)
      }
    }
    f();
  }, [])

  const handleClick = async () => {
    const body = [question1, question2, question3];
    try {
      const res = await setQuestions(body, id);
      setIsOK(res.status === 200);
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  return (
    <Container maxWidth="xs">
      <ErrorMessage message={errorMessage} />
      {students &&
        (
          <select value={id} onChange={(e) => setId(Number(e.target.value))}>
            {students.map(item => {
              return (
                <option key={item.id} value={item.id}>{item.name}</option>
              )
            })}
          </select>
        )
      }
      <p>質問1(番号入力、以下同様)</p>
      <TextField fullWidth onChange={(e) => setQuestion1(Number(e.target.value))}></TextField>
      <p>質問2</p>
      <TextField fullWidth onChange={(e) => setQuestion2(Number(e.target.value))}></TextField>
      <p>質問3</p>
      <TextField fullWidth onChange={(e) => setQuestion3(Number(e.target.value))}></TextField>
      <Button onClick={handleClick} fullWidth>追加</Button>
      <Button onClick={() => history.push("/dev/show-all-questions")} fullWidth>戻る</Button>
      { isOK && <p>追加できました！</p>}
    </Container >
  );
}

export default AddQuestion;