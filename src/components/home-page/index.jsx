import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { PieChart } from 'react-minimal-pie-chart';
import styled, { css } from "styled-components";
import Modal from '@material-ui/core/Modal';
import { SERVER_URL, initialData, COLOR } from '../../constant';
import {
  userLogout,
  receivePolls,
  requestPolls,
  pollError,
  requestUser,
  receiveUser,
  userError,
} from "../../reducer/action";

function Home() {
  const userState = useSelector(state => state.user)
  const pollState = useSelector(state => state.poll)

  const [pollCreation, setPollCreation] = useState(false);
  const [pollName, setPollName] = useState('');
  const [pollOptions, setPollOptions] = useState(initialData);
  const [hover, setHover] = useState({pollName: '', index: -1})

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
        dispatch(receivePolls(data.polls))
      })
      .catch(err => {
        console.log(err.message)
        dispatch(pollError(err.message))
      })
  }

  const fetchUser = () => {
    dispatch(requestUser());

    fetch(SERVER_URL + `/api/getuser/${userState.user.username}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({alreadyLoggedIn: true})
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(receiveUser(data.user))
        console.log(data.user)
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
        fetchUser()
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

  const handleModalClose = () => {
    setPollCreation(false);
  }

  React.useEffect(() => {
    if (pollState.polls.length === 0) {
      fetchAllPolls()
    }
  }, [])

  return (
    <div>
      {userState && <NavContainer><ProfileLink to={`/user/${userState.user._id}`} >{userState.user.username}</ProfileLink><Buttons><Button onClick={() => setPollCreation(!pollCreation)}>Suggest A Poll</Button><Button onClick={handleLogout}>Adiós</Button></Buttons></NavContainer>}
      
      <Modal open={pollCreation} onClose={handleModalClose}>
        <SubmitPollForm onSubmit={handleSubmit}>
          <PollHide onClick={() => setPollCreation(!pollCreation)}>Hide</PollHide>
          <PollForm>
            <PollLabel>
              <PollInput onChange={updatePollName} value={pollName} type={'text'} placeholder={'Poll Name'} required />
            </PollLabel>
            <PollOptions id={'option-input'}>
  
              {
                pollOptions.map((options, index) => {
                  return <>
                    <PollLabel>
                      <PollInput onChange={(ev) => updateOptionName(ev, index)} value={pollOptions[index].title} className={`option-${index}`} style={pollOptions.length > 2 ? { borderTopRightRadius: '0', borderBottomRightRadius: '0' } : null} type={'text'} placeholder={'Option'} required />
                      {(pollOptions.length > 2) && <PollRemove type={'button'} className={`option-${index}`} onClick={(ev) => removeOption(ev, index)} >Remove</PollRemove>}
                    </PollLabel>
                    {(index === pollOptions.length - 1 && pollOptions.length < 5) && <Button type={'button'} onClick={(ev) => addOption(ev)} >Add Option</Button>}
                  </>
                })
              }
  
            </PollOptions>
          </PollForm>
          <SubmitPollButton type={"submit"}>Submit Poll</SubmitPollButton>
        </SubmitPollForm>
      </Modal>
      
      <PollsContainer>
        {
          pollState.polls.map((poll, index) => {
            let amountOfVotes = 0;
            
            handleColorChange(poll);

            poll.options.forEach((votes, index) => {
              amountOfVotes += votes.voters.length
              if (hover.index === index && poll.pollName === hover.pollName) {
                poll.options[index] = { ...votes, color: `${COLOR.SAND}`}
              }
            })

            return <PollContainer key={index} >
              <PollName to={`/poll/${poll._id}`}>{poll.pollName}</PollName>
              <PollDataContainer>
                  {amountOfVotes > 0 ? <PieChart data={poll.options} segmentsStyle={{ cursor: 'pointer' }} style={{ width: '300px', margin: '10px 0', padding: '0px 25px' }} onClick={(ev, index) => handleVote(ev, poll._id, poll.options[index].title)} onMouseOver={(_, index) => {setHover({ pollName: poll.pollName, index })}} onMouseOut={() => setHover({pollName: '', index: -1})} startAngle={270} lineWidth={35} /> : <FirstToVoteContainer><FirstToVoteParagraph>Be the first to vote!</FirstToVoteParagraph></FirstToVoteContainer>}
    
                <PollChoices>
                  {poll.options.map(option => {
                    return <>
                      <PollIndicatorContainer onClick={(ev) => handleVote(ev, poll._id, option.title)} >
                        <PollColorIndicator style={{ background: `${option.color}`}}>{option.voters.length}</PollColorIndicator>
                        {option.title}
                      </PollIndicatorContainer>
                    </>
                  })}
                </PollChoices>
              </PollDataContainer>
            </PollContainer>
          })
        }
      </PollsContainer>
    </div>
  );
}

export default Home;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ProfileLink = styled(Link)`
  color: ${COLOR.SAND};
  text-transform: uppercase;
  font-weight: bold;
  padding: 5px 10px;
  margin-left: 5px;

  &:hover {
    background-color: ${COLOR.LIGHTROCK};
    border-radius: 5px;
  }
`
const Buttons = styled.div``
const Button = styled.button`
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
const SubmitPollForm = styled.form`
  width: 400px;
  height: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: ${COLOR.ROCK};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  &:focus {
    outline: none;
    border: none;
  }
`
const PollForm = styled.div`
  flex: 1;
  margin-top: 10px;
  width: 100%;
`
const PollHide = styled.p`
  color: ${COLOR.SAND};
  align-self: right;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${COLOR.LIGHTROCK};
  }
`
const PollLabel = styled.label`
  display: flex;
  align-items: center;
  background-color: ${COLOR.LIGHTROCK};
  margin: 10px 0;
  border-radius: 5px;
`
const PollRemove = styled.button`
  background-color: ${COLOR.SAND};
  border: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  outline: none;
  color: ${COLOR.LIGHTROCK};
  padding: 5px;
  border: 1px solid ${COLOR.SAND};
  cursor: pointer;

  &:hover {
    background-color: ${COLOR.LIGHTROCK};
    color: ${COLOR.SAND};
    border: none;
    border-bottom: 2px solid ${COLOR.SAND};
  }
`
const SubmitPollButton = styled.button`
  border: 2px solid transparent;
  outline: none;
  background-color: ${COLOR.SAND};
  color: ${COLOR.ROCK};
  font-weight: bold;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: ${COLOR.ROCK};
    color: ${COLOR.SAND};
    border-bottom: 2px solid ${COLOR.SAND};
    border-top: 2px solid ${COLOR.SAND};
  }
`
const InputStyles = css`
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: none;
  outline: none;
  color: ${COLOR.SAND};
  background-color: ${COLOR.LIGHTROCK};
  border-bottom: 2px solid ${COLOR.SAND};
  font-weight: bold;

  &:focus {
    border: none;
    border-left: 3px solid ${COLOR.SAND};
    border-bottom: 2px solid transparent;
  }
  &::placeholder {
    color: ${COLOR.SAND};
    font-style: italic;
    font-weight: normal;
  }
`
const PollInput = styled.input`
  ${InputStyles}
`
const PollOptions = styled.div`
  width: 100%;
  text-align: center;
`
const PollsContainer = styled.div`
  margin: 20px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`
const PollColorIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  color: black;
`
const PollIndicatorContainer = styled.li`
  display: flex;
  margin: 10px auto 0 auto;
  transform: translatey(-5px);
  cursor: pointer;
  font-weight: bold;
  color: black;

  &:hover {
    color: ${COLOR.SAND};

    ${PollColorIndicator} {
      color: black;
    }
  }
`
const PollContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 525px;
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
  background-color: ${COLOR.WOOD};
  text-align: center;
`
const PollName = styled(Link)`
  margin: 5px;
  width: auto;
  padding: 5px 20px;
  color: black;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1.4em;

  &:hover {
    background-color: ${COLOR.SAND};
    
  }
`
const PollDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 10px;
`
const PollChoices = styled.ul`
  width: 100px;
  margin: auto 20px auto 0;
`
const FirstToVoteContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 200px;
  margin: 10px 0;
`
const FirstToVoteParagraph = styled.p`
  font-weight: bold;
`