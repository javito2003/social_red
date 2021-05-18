import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import { getNotifications } from "./redux/notifDucks";

//components
import Navbar from "./components/Navbar.jsx";

//Views
import Home from "./views/Home";
import Login from "./views/Login";
import Profile from "./views/Profile";
import Register from "./views/Register";
import Chat from "./views/Chat";
import Post from "./views/Post.jsx";
import { useSelector, useDispatch } from "react-redux";
import socket from "./utils/ws.js";

function App(props) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user.userData);
  const token = useSelector((store) => store.user.user.token);

  React.useEffect(() => {
    if (user !== undefined) {
      function getNotif() {
        dispatch(getNotifications());
      }
      socket.emit("new-user", user);
      socket.on("followyou", getNotif);
      socket.on("newpost", getNotif);
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/profile/:id">
          <Profile />
        </Route>
        <Route path="/post/:id">
          <Post />
        </Route>
        <Route path="/chat">
          <Chat />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
