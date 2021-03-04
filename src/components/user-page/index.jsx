import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { SERVER_URL } from "../../constant";
import styled from "styled-components";
import {
  userLogout,
  receivePolls,
  requestPolls,
  pollError,
} from "../../reducer/action";
import { COLOR } from "../../constant";

function User() {
  const userState = useSelector((state) => state.user);
  const pollState = useSelector((state) => state.poll);

  const [hover, setHover] = useState(-1);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = (ev) => {
    ev.preventDefault();

    dispatch(userLogout());

    history.push("/");

    localStorage.clear();
  };
  const fetchAllPolls = () => {
    dispatch(requestPolls());

    fetch(SERVER_URL + `/api/getpolls`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(receivePolls(data.polls));
      })
      .catch((err) => {
        dispatch(pollError(err.message));
      });
  };

  const handleNavigateHome = () => {
    history.push("/");
  };

  const handleMouseEnter = (index) => {
    setHover(index);
  };
  const handleMouseLeave = () => {
    setHover(-1);
  };

  React.useEffect(() => {
    if (pollState.polls.length === 0) {
      fetchAllPolls();
    }
  }, []);
console.log(userState.user.votes, pollState.polls, localStorage)
  return (
    <>
      <NavContainer>
        <Buttons>
          <Button onClick={handleNavigateHome}>Go Back Home</Button>
          {userState && <Button onClick={handleLogout}>Adiós</Button>}
        </Buttons>
      </NavContainer>{" "}
      {userState.user.votes.length > 0 ? (
        <Links>
          {userState.user.votes.map((userPoll, index) => {
            return (
              <LinkContainer>
                <HoverLink style={hover === index ? { color: `${COLOR.SAND}` } : null}>
                  {">"}
                </HoverLink>
                <PollLink
                  to={`/poll/${userPoll}`}
                  onMouseOver={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onFocus={() => handleMouseEnter(index)}
                  onBlur={handleMouseLeave}
                >
                  {pollState.polls.find((poll) => poll._id === userPoll).pollName}
                </PollLink>
              </LinkContainer>
            );
          })}
        </Links>
      ) : (
        <NoVoteYet>you didn't vote yet</NoVoteYet>
      )}
    </>
  );
}

export default User;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const Buttons = styled.div``;
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
`;
const Links = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;
const PollLink = styled(Link)`
  color: black;
  cursor: pointer;
  font-weight: bold;
  line-height: 30px;
  margin-left: 10px;
`;
const LinkContainer = styled.div`
  display: flex;
  height: 30px;
`;

const NoVoteYet = styled.p``;
const HoverLink = styled.p`
  color: ${COLOR.ROCK};
  font-weight: bold;
  transition: all 0.2s;
  font-size: 1.2em;
  line-height: 30px;
`;
