import React, { useContext, useState } from "react";
import { SERVER_URL, initialData } from '../../constant';

function LogIn() {
  const [newUser, setNewUser] = useState(false);
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUserForm = (ev) => {
    ev.preventDefault();
    setNewUser(!newUser);
  };

  const handleLogin = () => {

  }

  const handleSignup = () => {
    ev.preventDefault();

    const user = {
      username,
      email,
      password,
    }

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
        
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      {newUser ? (
        <>
          <form onClick={handleSignup}>
            <input onChange={(ev) => setUsername(ev.currentTarget.value)} type={"text"} placeholder={"Username"} />
            <input onChange={(ev) => setEmail(ev.currentTarget.value)} type={"email"} placeholder={"Email"} />
            <input onChange={(ev) => setPassword(ev.currentTarget.value)} type={"password"} placeholder={"Password"} />
            <input onChange={(ev) => setConfirmPassword(ev.currentTarget.value)} type={"password"} placeholder={"Verify Password"} />
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
    </>
  );
}

export default LogIn;
