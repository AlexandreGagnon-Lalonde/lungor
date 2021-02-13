import React, { useContext, useState } from "react";
import { SERVER_URL, initialData } from '../../constant';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  requestUser,
  receiveUser,
  userError,
} from "../../reducer/action";
import { COLOR } from '../../constant';

function LogIn() {
  const userState = useSelector(state => state.user)

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

  const handleLogin = (ev) => {
    ev.preventDefault();

    dispatch(requestUser())

    fetch(SERVER_URL + `/api/getuser/${username}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 200) {
          dispatch(receiveUser(data.user))
          dispatch(userError(''))
          localStorage.setItem('user', JSON.stringify(data.user))
          history.push('/')
        } else {
          dispatch(userError(data.message))
        }
      })
      .catch(err => {
        console.log(err.message)
        dispatch(userError(err.message))
      })
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
            dispatch(receiveUser(poll.user))
            localStorage.setItem('user', JSON.stringify(poll.user))
            history.push('/')
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
    <LogInContainer>
      {newUser ? (
        <FormContainer>
          <form onSubmit={handleSignup}>
            <InputContainer>
              <LogInInput onChange={(ev) => setUsername(ev.currentTarget.value)} value={username} type={"text"} placeholder={"Username"} required />
              <LogInInput onChange={(ev) => setPassword(ev.currentTarget.value)} value={password} type={"password"} placeholder={"Password"} required />
              <LogInInput onChange={(ev) => setConfirmPassword(ev.currentTarget.value)} value={confirmPassword} type={"password"} placeholder={"Verify Password"} required />
            </InputContainer>
            <LogInButton type={"submit"}>Sign Up</LogInButton>
          </form>
          <ChangeFormButton type={"button"} onClick={handleUserForm}>
            already a member?
          </ChangeFormButton>
        </FormContainer>
      ) : (
        <FormContainer>
          <form onSubmit={handleLogin}>
            <InputContainer>
              <LogInInput onChange={(ev) => setUsername(ev.currentTarget.value)} type={"text"} placeholder={"Username"} required />
              <LogInInput onChange={(ev) => setPassword(ev.currentTarget.value)} type={"password"} placeholder={"Password"} required />
            </InputContainer>
            <LogInButton type={"submit"}>Log In</LogInButton>
          </form>
          <ChangeFormButton type={"button"} onClick={handleUserForm}>
            First Time Here ?
          </ChangeFormButton>
        </FormContainer>
      )}
      {message && <p>{message}</p>}
      {userState.message && <p>{userState.message}</p>}
    </LogInContainer>
  );
}

export default LogIn;

const LogInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding-bottom: 100px;

`
const FormContainer = styled.form`
  width: 350px;
  height: 400px;
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const LogInInput = styled.input`
  background: ${COLOR.WOOD};
  outline: none;
  border: none;
  color: ${COLOR.SAND};
  height: 50px;
  width: 250px;
  text-align: center;
  font-weight: bold;

  &::placeholder {
    color: ${COLOR.SAND};
  }
`
const LogInButton = styled.button`
  height: 50px;
  width: 100%;
`
const ChangeFormButton = styled.button`
  background-color: ${COLOR.SAND};
  border: none;
  color: ${COLOR.ROCK};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`