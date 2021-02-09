import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";
import { SERVER_URL, initialData } from "../../constant";
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

function User() {
  const userState = useSelector((state) => state.user);
console.log(userState)
  return (
    <>
      <div>
        <Link to={`/`}>Back To Voting</Link>
      </div>
      {userState.user.votes ? (
        <div>
          {userState.user.votes.map((poll) => {
            return <p>{poll}</p>;
          })}
        </div>
      ) : <p>you didn't vote yet</p>}
    </>
  );
}

export default User;
