import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { PieChart } from 'react-minimal-pie-chart';
import styled from "styled-components";
import { SERVER_URL, initialData, COLOR } from '../../constant';
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

function Home() {
  const userState = useSelector(state => state.user)
  const pollState = useSelector(state => state.poll)

  const [pollCreation, setPollCreation] = useState(false);
  const [pollName, setPollName] = useState('');
  const [pollOptions, setPollOptions] = useState(initialData);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = (ev) => {
    ev.preventDefault();

    fetch(SERVER_URL + `/api/newpoll`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pollName,
        pollOptions,
      })
    })
      .then(res => res.json())
      .then(poll => {
        fetchAllPolls()
      })
      .catch(err => {
        console.log(err.message)
        dispatch(pollError(err.message))
      })

    setPollName('')
    setPollOptions([
      {
        title: "",
        value: 0,
        color: '',
        voters: [],
      },
      {
        title: "",
        value: 0,
        color: '',
        voters: [],
      },
    ])
    setPollCreation(false)
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

  const addOption = (ev) => {
    ev.preventDefault();

    const newData = {
      title: "",
      value: 0,
      color: '',
      voters: [],
    }

    const newOptions = [...pollOptions]

    newOptions.push(newData)

    setPollOptions(newOptions);
  }

  const removeOption = (ev, index) => {
    ev.preventDefault();

    const updatedOptions = pollOptions.filter((option, id) => id !== index);

    setPollOptions(updatedOptions)
  }

  const updatePollName = (ev) => {
    setPollName(ev.currentTarget.value)
  }

  const updateOptionName = (ev, index) => {
    const updatedOptions = [...pollOptions]

    updatedOptions[index].title = ev.currentTarget.value

    setPollOptions(updatedOptions)
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

  const handleLogout = (ev) => {
    ev.preventDefault();

    dispatch(userLogout());

    history.push('/')

    localStorage.clear();
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

  React.useEffect(() => {
    if (pollState.polls.length === 0) {
      fetchAllPolls()
    }
  }, [])

  return (
    <div>
      {userState && <NavContainer><ProfileLink to={`/user/${userState.user._id}`} >{userState.user.username}</ProfileLink><LogOutButton onClick={handleLogout}>Adiós</LogOutButton></NavContainer>}
      {pollCreation ? <form onSubmit={handleSubmit}>
        <p onClick={() => setPollCreation(!pollCreation)}>Hide</p>
        <label>
          <input onChange={updatePollName} value={pollName} type={'text'} placeholder={'Poll Name'} required />
        </label>
        <div id={'option-input'}>

          {
            pollOptions.map((option, index) => {
              return <>
                <label>
                  <input onChange={(ev) => updateOptionName(ev, index)} value={pollOptions[index].title} className={`option-${index}`} type={'text'} placeholder={'Option'} required />
                  {(pollOptions.length > 2) && <button type={'button'} className={`option-${index}`} onClick={(ev) => removeOption(ev, index)} >-</button>}
                </label>
                {(index === pollOptions.length - 1 && pollOptions.length < 5) && <button type={'button'} onClick={(ev) => addOption(ev)} >+</button>}
              </>
            })
          }

        </div>
        <button type={"submit"}>Submit Poll</button>
      </form> : <div onClick={() => setPollCreation(!pollCreation)}>Create A Poll</div> }
      
      <div>
        {
          pollState.polls.map((poll, index) => {
            handleColorChange(poll);
            return <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', border: '1px solid red' }}>
              <Link to={`/poll/${poll._id}`}>{poll.pollName}</Link>
              <PieChart data={poll.options} style={{ width: '200px'}} onClick={(ev, index) => handleVote(ev, poll._id, poll.options[index].title)} startAngle={270} lineWidth={35} />

              <ul>
                {poll.options.map(option => {
                  return <>
                    <li onClick={(ev) => handleVote(ev, poll._id, option.title)} ><p style={{ background: `${option.color}`}}>{option.voters.length}</p> {option.title}</li>
                  </>
                })}
              </ul>
            </div>
          })
        }
      </div>
    </div>
  );
}

export default Home;

const NavContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
const ProfileLink = styled(Link)`
  color: ${COLOR.SAND};
  text-transform: uppercase;
  font-weight: bold;
  margin-right: 10px;
`
const LogOutButton = styled.button`
  background-color: ${COLOR.ROCK};
  border: 2px solid ${COLOR.WOOD};
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px;
  color: ${COLOR.SAND};
  cursor: pointer;

  &:hover {
    background-color: ${COLOR.SAND};
    border: 2px solid ${COLOR.SAND};
    color: ${COLOR.ROCK};
  }
`