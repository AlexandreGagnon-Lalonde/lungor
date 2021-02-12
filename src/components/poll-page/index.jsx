import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";
import { PieChart } from 'react-minimal-pie-chart';
import { SERVER_URL, initialData } from '../../constant';
import {
  requestUser,
  receiveUser,
  userError,
  userLogout,
  receivePolls,
  requestPolls,
  pollError,
  votePoll,
} from "../../reducer/action";
import { COLOR } from '../../constant'

function Poll() {
  const userState = useSelector(state => state.user)
  const pollState = useSelector(state => state.poll)

  const { pollId } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();

  const currentPoll = pollState.polls.find(poll => poll._id === pollId);

  const handleLogout = (ev) => {
    ev.preventDefault();

    dispatch(userLogout());

    history.push('/')

    localStorage.clear();
  }

  return <>
    <div>
      <Link to={`/`}>Back To Voting</Link>
      <Link to={`/user/${userState.user.username}`}>{userState.user.username}</Link>
      {userState && <button onClick={handleLogout}>Leave</button>}
    </div>
    <div>

    </div>
  </>;
}

export default Poll;
