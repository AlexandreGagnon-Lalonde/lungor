import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { requestUser, receiveUser, userError } from "./reducer/action";

import Home from "./components/home-page";
import Poll from "./components/poll-page";
import LogIn from "./components/log-in-page";
import User from "./components/user-page";

function App() {
  const userState = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser && !userState.user) {
      const foundUser = JSON.parse(loggedInUser);
      dispatch(receiveUser(foundUser));
    } else if (userState.user) {
      <Redirect to={'/'} />
    }
  }, [userState]);

  return (
    <Router>
      {userState.user ? (
        <>
          <Route exact path={"/"}>
            <Home />
          </Route>
          <Route path={"/poll/:pollid"}>
            <Poll />
          </Route>
          <Route path={"/user/:userid"}>
            <User />
          </Route>
        </>
      ) : (
        <Route exact path={"/"}>
          <LogIn />
        </Route>
      )}
    </Router>
  );
}

export default App;
