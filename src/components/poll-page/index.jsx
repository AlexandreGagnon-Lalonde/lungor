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

  const handleVote = (ev, _id, title) => {
    ev.preventDefault();

    fetch(SERVER_URL + `/api/votepoll`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userState.user,
        title,
        _id,
      })
    })
      .then(res => res.json())
      .then(poll => {
        fetchAllPolls()
      })
      .catch(err => console.log(err))
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

  const handleColorChange = (pollData) => {
    const colorOrder = [];

    pollData.options.forEach(option => colorOrder.push({value: option.value, title: option.title}))

    colorOrder.sort((a,b) => a.value > b.value ? 1: -1)

    pollData.options.map((option, index) => {
      const indexValue = colorOrder.findIndex(x => x.title === option.title)

      option.color = COLOR.RED_GRADIENT[indexValue]

      if (option.voters.find(voter => voter === userState.user.username)) {
        option.color = COLOR.GREEN
      }
    })
  }

  handleColorChange(currentPoll)
  console.log(pollState.polls.find(poll => poll._id === pollId))

  return <>
    <div>
      <Link to={`/`}>Back To Voting</Link>
      <Link to={`/user/${userState.user.username}`}>{userState.user.username}</Link>
      {userState && <button onClick={handleLogout}>Leave</button>}
    </div>
    <div>
    <PieChart data={currentPoll.options} style={{ width: '200px'}} onClick={(ev, index) => handleVote(ev, currentPoll._id, currentPoll.options[index].title)} startAngle={270} lineWidth={35} />
    <ul>
                {currentPoll.options.map(option => {
                  return <>
                    <li onClick={(ev) => handleVote(ev, currentPoll._id, option.title)} ><p style={{ background: `${option.color}`}}>{option.voters.length}</p> {option.title}</li>
                  </>
                })}
              </ul>

    </div>
  </>;
}

export default Poll;
