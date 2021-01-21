import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import Home from './components/home-page';
import Poll from './components/poll-page';
import LogIn from './components/log-in-page';
import User from './components/user-page'

function App() {
  return (
    <Router>
      <Route exact path={'/'}>
        <LogIn />
      </Route>
      <Route path={'/home'}>
        <Home />
      </Route>
      <Route path={'/poll/:pollid'}>
        <Poll />
      </Route>
      <Route path={'/user/:userid'}>
        <User />
      </Route>
    </Router>
    );
}

export default App;
