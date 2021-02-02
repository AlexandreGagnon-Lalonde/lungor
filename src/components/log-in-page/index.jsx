import React, { useContext, useState } from "react";
import { SERVER_URL, initialData } from '../../constant';

function LogIn() {
  const [newUser, setNewUser] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUserForm = (ev) => {
    ev.preventDefault();
    setNewUser(!newUser);
  };

  const handleLogin = () => {

  }

  const handleSignup = (ev) => {
    ev.preventDefault();

    const user = {
      username,
      password,
      votes: [],
    }

    if (password === confirmPassword) {
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
        .catch(err => setMessage(err.message))
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
          <form>
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
