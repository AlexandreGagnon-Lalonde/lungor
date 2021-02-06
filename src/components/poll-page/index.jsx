import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";
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

function Poll() {
  const userState = useSelector(state => state.user)
  const pollState = useSelector(state => state.poll)

  const { pollId } = useParams();

  const currentPoll = pollState.polls.find(poll => poll._id === pollId);

  return <>
    <div>
      <Link to={`/`}>Back To Voting</Link>
      <Link to={`/user/${userState.user.username}`}>{userState.user.username}</Link>
    </div>
    <p>{currentPoll.pollName}</p>
    <ul>
      {currentPoll.options.map(option => {
        return <li>{option.optionName}</li>
      })}
    </ul>
  </>;
}

export default Poll;
