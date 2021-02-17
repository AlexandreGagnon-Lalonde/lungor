import React, { useState } from "react";
import { SERVER_URL } from '../../constant';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  requestUser,
  receiveUser,
  userError,
} from "../../reducer/action";
import { COLOR } from '../../constant';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

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
    setPassword('');
    setUsername('');
    setConfirmPassword('');
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
              <StyledField label={'Username'} onChange={(ev) => setUsername(ev.currentTarget.value)} value={username} variant={'outlined'} required />
              <StyledField label={'Password'} type={'password'} onChange={(ev) => setPassword(ev.currentTarget.value)} value={password} variant={'outlined'} required />
              <StyledField label={'Confirm Password'} type={'password'} onChange={(ev) => setConfirmPassword(ev.currentTarget.value)} value={confirmPassword} variant={'outlined'} required />
            </InputContainer>
            <LogInButton type={"submit"}>Sign Up</LogInButton>
          </form>
          <ChangeFormButton type={"button"} onClick={handleUserForm}>
            Already a member?
          </ChangeFormButton>
        </FormContainer>
      ) : (
        <FormContainer>
          <form onSubmit={handleLogin}>
            <InputContainer>
              <StyledField onChange={(ev) => setUsername(ev.currentTarget.value)} type={"text"} variant={'outlined'} label={'Username'} required />
              <StyledField onChange={(ev) => setPassword(ev.currentTarget.value)} type={"password"} variant={'outlined'} label={'Password'} required />
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
const FormContainer = styled.div`
  width: 350px;
  height: 400px;
  background: ${COLOR.SAND};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-radius: 5px;
`
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const StyledField = withStyles({
  root: {
    marginBottom: '10px',
    '& label.Mui-focused': {
      color: `${COLOR.ROCK}`,
      fontWeight: 'bold',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: `${COLOR.ROCK}`,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: `${COLOR.ROCK}`,
      },
      '&:hover fieldset': {
        borderColor: `${COLOR.ROCK}`,
      },
      '&.Mui-focused fieldset': {
        borderColor: `${COLOR.ROCK}`,
      },
    },
  },
})(TextField)
const LogInButton = styled.button`
  height: 30px;
  width: 100%;
  color: ${COLOR.SAND};
  background: ${COLOR.ROCK};
  border: 1px solid ${COLOR.WOOD};
  border-radius: 5px;
  transition: all 0.1s;
  cursor: pointer;

  &:hover {
    font-weight: bold;
  }
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