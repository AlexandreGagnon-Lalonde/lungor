import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home-page';
import Poll from './components/poll-page';
import LogIn from './components/log-in-page';

function App() {
  return (
    <>
      <Router>
        <Route exact path={'/'}>
          <LogIn/>
        </Route>
        <Route path={'/home'}>
          <Home/>
        </Route>
        <Route exact path={'/poll/:pollId'}>
          <Poll/>
        </Route>
      </Router>
    </>
  )
}

export default App;
