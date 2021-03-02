import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";
import { PieChart } from 'react-minimal-pie-chart';
import { SERVER_URL } from '../../constant';
import styled from "styled-components";
import {
  userLogout,
  receivePolls,
  requestPolls,
  pollError,
} from "../../reducer/action";
import { COLOR } from '../../constant'

function Poll() {
  const userState = useSelector(state => state.user)
  const pollState = useSelector(state => state.poll)

  const [hover, setHover] = useState({pollName: '', index: -1})

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

  const handleNavigateHome = () => {
    history.push('/')
  }

  pollState.polls.length > 0 && handleColorChange(currentPoll)

  React.useEffect(() => {
    if (pollState.polls.length === 0) {
      fetchAllPolls()
    }
  }, [])

  return <>
    <NavContainer>
      
      <ProfileLink to={`/user/${userState.user.username}`}>{userState.user.username}</ProfileLink>
      <Buttons>
        <Button onClick={handleNavigateHome}>Go Back Home</Button>
        {userState && <Button onClick={handleLogout}>Adiós</Button>}
      </Buttons>
    </NavContainer>
    {
          pollState.polls.map((poll, index) => {
            if (poll._id === pollId) {
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
            }
          })
        }
  </>;
}

export default Poll;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  width: 90%;
  background-color: ${COLOR.WOOD};
  margin: 0 auto;
  text-align: center;
  border-radius: 10px;

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
  padding: 10px 0;
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