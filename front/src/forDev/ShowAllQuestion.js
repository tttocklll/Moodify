import React, { useState, useEffect } from "react";
import { Container, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom"
import { getAllQuestions } from "../api"
import ErrorMessage from './../components/ErrorMessage'

const ShowAllQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const f = async () => {
      try {
        const res = await getAllQuestions();
        setQuestions(res.data);
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
    f();
  }, [])
  return (
    <Container maxWidth="xs">
      <ErrorMessage message={errorMessage} />
      <Button onClick={() => history.push("/dev/add-question")} fullWidth>追加</Button>
      <Button onClick={() => history.push("/dev/set-question")} fullWidth>セット</Button>
      {questions.map((item, index) => {
        return (
          <div key={index}>
            <hr />
            <p>{item.id}</p>
            <p>質問内容：{item.question}</p>
            <p>タイプ：{item.type}</p>
          </div>
        )
      })}
    </Container>
  );
}

export default ShowAllQuestion;