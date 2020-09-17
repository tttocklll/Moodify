import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Chat from "./pages/Chat"
import DashBoard from "./pages/DashBoard"
import UserPage from "./pages/UserPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ShowAllQuestion from "./forDev/ShowAllQuestion"
import AddQuestion from "./forDev/AddQuestion"
import SetQuestions from "./forDev/SetQuestions"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Header />
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/chat" component={Chat} />
        <Route exact path="/dashboard" component={DashBoard} />
        <Route exact path="/mypage" component={UserPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/dev/show-all-questions" component={ShowAllQuestion} />
        <Route exact path="/dev/add-question" component={AddQuestion} />
        <Route exact path="/dev/set-question" component={SetQuestions} />
      </Switch>
    </Router >
  );
}

export default App;
