import React, { useContext, useState } from "react";

function LogIn() {
  const [newUser, setNewUser] = useState(false);
  
  return (
    <div>
      <form>
        <input type={"text"} placeholder={'Username'} />
        <input type={"email"} placeholder={'Email'} />
        <input type={"password"} placeholder={'Password'} />
        <input type={"password"} placeholder={'Verify Password'} />
        <button type={'submit'}>Sign Up</button>
      </form>
      <form>
        <input type={"text"} placeholder={'Username'} />
        <input type={"password"} placeholder={'Password'} />
        <button type={'submit'}>Log In</button>
      </form>
    </div>
  );
}

export default LogIn;
