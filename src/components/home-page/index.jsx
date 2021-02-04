import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
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
    setPollOptions(initialData)
  }

  const fetchAllPolls = () => {
    dispatch(requestPolls());

    fetch(SERVER_URL + `/api/getpolls`)
      .then((res) => res.json())
      .then((data) => {
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
      optionName: '',
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

    updatedOptions[index].optionName = ev.currentTarget.value

    setPollOptions(updatedOptions)
  }

  const handleVote = (ev, _id, optionName) => {
    ev.preventDefault();

    fetch(SERVER_URL + `/api/votepoll`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        optionName,
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
    dispatch()
    history.push('/')
    localStorage.clear();
  }

  React.useEffect(() => {
    if (pollState.polls.length === 0) {
      fetchAllPolls()
    }
  }, [])

  return (
    <div>
      {userState && <div><nav>{userState.user.username}</nav><button onClick={handleLogout}>Leave</button></div>}
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
                  <input onChange={(ev) => updateOptionName(ev, index)} value={pollOptions[index].optionName} className={`option-${index}`} type={'text'} placeholder={'Option'} required />
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
            return <div key={index}>
              <p>{poll.pollName}</p>
              <ul>
                {poll.options.map(option => {
                  return <>
                    <li>{`${option.voters.length} - ${option.optionName}`}</li>
                    <button type={'button'} onClick={(ev) => handleVote(ev, poll._id, option.optionName)} >vote</button>
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
