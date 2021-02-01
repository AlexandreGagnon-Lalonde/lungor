import React, { useContext, useState } from "react";

function LogIn() {
  const [newUser, setNewUser] = useState(false);

  const handleUserForm = (ev) => {
    ev.preventDefault();
    setNewUser(!newUser);
  };

  const handleLogin = () => {

  }

  const handleSignup = () => {

  }
  
  return (
    <>
      {newUser ? (
        <>
          <form>
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
