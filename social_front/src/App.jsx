import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";

//components
import Navbar from "./components/Navbar.jsx";

//Views
import Home from "./views/Home";
import Login from "./views/Login";
import Profile from "./views/Profile";
import Register from "./views/Register";
import Chat from "./views/Chat";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

function App(props) {
  return (
    <Router>
      <ElevationScroll {...props}>
        <Navbar />
      </ElevationScroll>
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
        <Route path="/chat">
          <Chat />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
