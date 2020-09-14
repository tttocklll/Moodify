import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { get_current_student } from "../api"
import ErrorMessage from './../components/ErrorMessage'

const UserPage = () => {
  const [userProfile, setUserProfile] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    const f = async () => {
      try {
        const res = await get_current_student();
        setUserProfile(res.data);
        console.log(res.data);
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
    f();
  }, []
  );
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
    </Container>
  )
}

export default UserPage;