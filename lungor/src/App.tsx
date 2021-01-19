import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home-page';
import Poll from './components/poll-page';
import LogIn from './components/log-in-page';

function App() {
  return (
    <>
      <Route path={'/login'}>
        <Home/>
      </Route>
      <Route path={'/home'}>
        <Poll/>
      </Route>
      <Route exact path={'/poll/:pollId'}>
        <LogIn/>
      </Route>
    </>
  )
}

export default App;
