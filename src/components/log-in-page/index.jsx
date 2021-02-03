import React, { useContext, useState } from "react";
import { SERVER_URL, initialData } from '../../constant';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  requestUser,
  receiveUser,
  userError,
} from "../../reducer/action";

function LogIn() {
  const [newUser, setNewUser] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const handleUserForm = (ev) => {
    ev.preventDefault();
    setNewUser(!newUser);
  };

  const handleLogin = () => {
    dispatch(requestUser())

    fetch(SERVER_URL + `/api/getuser/${username}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(receiveUser(data.user))
        history.push('/home')
      })
      .catch((err) => {
        console.log(err.message)
        dispatch(userError(err.message))
      });
  }

  const checkPasswordComplexity = (pwd) => {
    const hasUppercase = /[A-Z]/.test(pwd)
    const hasLowercase = /[a-z]/.test(pwd)
    const hasNumber = /[\d]/.test(pwd)
    const hasNonAlpha = /[\W]/.test(pwd)

    const validity = hasLowercase + hasNonAlpha + hasNumber + hasUppercase

    return validity >= 4
  }

  const handleSignup = (ev) => {
    ev.preventDefault();

    const user = {
      username,
      password,
      votes: [],
    }

    const passwordComplexity = checkPasswordComplexity(password)
    const passwordCheck = password === confirmPassword

    if (passwordCheck && passwordComplexity) {
      fetch(SERVER_URL + `/api/createuser`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user
        })
      })
        .then(res => res.json())
        .then(poll => {
          if (poll.status === 201) {
            setMessage('')
          } else {
            setMessage(poll.message)
          }
        })
        .catch(err => console.log(err.message))
    } else if (passwordCheck && !passwordComplexity) {
      setMessage('Please use a more complex password')
    } else {
      setMessage('Please confirm your password')
    }
  }

  return (
    <>
      {newUser ? (
        <>
          <form onSubmit={handleSignup}>
            <input onChange={(ev) => setUsername(ev.currentTarget.value)} value={username} type={"text"} placeholder={"Username"} />
            <input onChange={(ev) => setPassword(ev.currentTarget.value)} value={password} type={"password"} placeholder={"Password"} />
            <input onChange={(ev) => setConfirmPassword(ev.currentTarget.value)} value={confirmPassword} type={"password"} placeholder={"Verify Password"} />
            <button type={"submit"}>Sign Up</button>
          </form>
          <button type={"button"} onClick={handleUserForm}>
            already a member?
          </button>
        </>
      ) : (
        <>
          <form onSubmit={handleLogin}>
            <input onChange={(ev) => setUsername(ev.currentTarget.value)} type={"text"} placeholder={"Username"} />
            <input onChange={(ev) => setPassword(ev.currentTarget.value)} type={"password"} placeholder={"Password"} />
            <button type={"submit"}>Log In</button>
          </form>
          <button type={"button"} onClick={handleUserForm}>
            new member?
          </button>
        </>
      )}
      {message && <p>{message}</p>}
    </>
  );
}

export default LogIn;
