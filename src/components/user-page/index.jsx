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

function User() {
  const userState = useSelector((state) => state.user);
  const pollState = useSelector((state) => state.poll);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = (ev) => {
    ev.preventDefault();

    dispatch(userLogout());

    history.push('/')

    localStorage.clear();
  }
  const fetchAllPolls = () => {
    dispatch(requestPolls());

    fetch(SERVER_URL + `/api/getpolls`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        dispatch(receivePolls(data.polls))
      })
      .catch(err => {
        console.log(err.message)
        dispatch(pollError(err.message))
      })
  }

  React.useEffect(() => {
    if (pollState.polls.length === 0) {
      fetchAllPolls()
    }
  }, [])

console.log(pollState.polls.length)
  return (
    <>
      <div>
        <Link to={`/`}>Back To Voting</Link>
        {userState && <button onClick={handleLogout}>Leave</button>}
      </div>
      {userState.user.votes && pollState.polls. length > 0 ? (
        <div>
          {userState.user.votes.map((userPoll) => {
            return (
              <Link to={`/poll/${userPoll}`}>
                {pollState.polls.find((poll) => poll._id === userPoll).pollName}
              </Link>
            );
          })}
        </div>
      ) : (
        <p>you didn't vote yet</p>
      )}
    </>
  );
}

export default User;
