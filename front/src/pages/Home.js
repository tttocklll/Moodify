import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  ({
    textForm: {
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "orange"
      },
      "& .MuiInputLabel-outlined.Mui-focused": {
        color: "orange"
      },
      backgroundColor: '#fff',
      height: 'auto',
      borderRadius: '5px',
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
      borderColort: 'red'
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      background: 'orange'
    },
  }),
);

const Home = () => {
  const [count, setCount] = useState(0)
  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {
    if (count + 1 >= 20) history.push("/dev/show-all-questions");
    setCount(count + 1);
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <h1>Moodify</h1>
        <Button fullWidth onClick={() => history.push("/login")} className={classes.submit}>Login</Button>
        <hr />
        <Button fullWidth onClick={() => history.push("/signup")} className={classes.submit}>Signup</Button>
        <hr />
        <Button fullWidth onClick={handleClick}>for DevTeam</Button>
      </div>
    </Container>
  )
}

export default Home;