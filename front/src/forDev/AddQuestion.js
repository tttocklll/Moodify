import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import { Container, TextField, Button } from "@material-ui/core";
import { addQuestion } from "../api"
import ErrorMessage from './../components/ErrorMessage'

const AddQuestion = () => {
  const [question, setQuestion] = useState("");
  const [qType, setQType] = useState(1);
  const [isOK, setIsOK] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

  const handleClick = async () => {
    const body = {
      question: question,
      type: qType
    }
    try {
      const res = await addQuestion(body);
      setIsOK(res.status === 200);
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  return (
    <Container maxWidth="xs">
      <ErrorMessage message={errorMessage} />
      <p>質問内容</p>
      <TextField fullWidth multiline onChange={(e) => setQuestion(e.target.value)}>質問内容を入力</TextField>
      <p>質問タイプ（現状1or2）</p>
      <TextField fullWidth onChange={(e) => setQType(Number(e.target.value))}>1 or 2</TextField>
      <Button onClick={handleClick} fullWidth>追加</Button>
      <Button onClick={() => history.push("/dev/show-all-questions")} fullWidth>戻る</Button>
      { isOK && <p>追加できました！</p>}
    </Container >
  );
}

export default AddQuestion;