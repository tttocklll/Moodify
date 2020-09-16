import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button } from "@material-ui/core";
import { getCurrentStudent } from "../api"
import ErrorMessage from './../components/ErrorMessage'
import useLoginRedirect from '../hooks/useLoginRedirect'
import { asyncLocalStorage } from "../utils"

const UserPage = () => {
  const [userProfile, setUserProfile] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  useLoginRedirect();
  const history = useHistory();
  useEffect(() => {
    const f = async () => {
      try {
        const res = await getCurrentStudent();
        setUserProfile(res.data);
        console.log(res.data);
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
    f();
  }, []
  );

  const handleLogout = async () => {
    await asyncLocalStorage.removeItem("access_token");
    history.push("/");
  }
  return (
    <Container maxWidth="xs">
      <ErrorMessage message={errorMessage} />
      <h3>マイページ</h3>
      {userProfile ?
        (
          <ul>
            <li>名前：{userProfile.name}</li>
            <li>メールアドレス：{userProfile.email}</li>
          </ul>
        ) :
        ""
      }
      <Button fullWidth onClick={handleLogout}>Log out</Button>
    </Container>
  )
}

export default UserPage;