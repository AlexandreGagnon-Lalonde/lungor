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
        fetchAllPolls()
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      {newUser ? (
        <>
          <form onClick={handleSignup}>
            <input type={"text"} placeholder={"Username"} />
            <input type={"email"} placeholder={"Email"} />
            <input type={"password"} placeholder={"Password"} />
            <input type={"password"} placeholder={"Verify Password"} />
            <button type={"submit"}>Sign Up</button>
          </form>
          <button type={"button"} onClick={handleUserForm}>
            already a member?
          </button>
        </>
      ) : (
        <>
          <form>
            <input type={"text"} placeholder={"Username"} />
            <input type={"password"} placeholder={"Password"} />
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
