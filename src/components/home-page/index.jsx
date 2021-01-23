import React, { useState } from "react";

import { SERVER_URL } from '../../constant';

function Home() {
  const [pollName, setPollName] = useState('');
  const [pollOptions, setPollOptions] = useState({
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
  });

  const handleSubmit = (ev) => {
    ev.preventDefault();

    fetch(SERVER_URL + `/api/newpoll`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pollName,
        pollOptions,
      })
    })
      .then(res => res.json())
      .then(poll => {
        console.log(poll)
      })
      .catch(err => console.log(err))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input onChange={(ev) => setPollName(ev.currentTarget.value)} type={'text'} placeholder={'Poll Name'} required />
        </label>
        <div>
          <label>
            <input onChange={(ev) => setPollOptions({...pollOptions, optionA: `${ev.currentTarget.value}`})} id={'option-a'} type={'text'} placeholder={'Option A'} required />
          </label>
          <label>
            <input onChange={(ev) => setPollOptions({...pollOptions, optionB: `${ev.currentTarget.value}`})} id={'option-b'} type={'text'} placeholder={'Option B'} required />
          </label>
          <label>
            <input onChange={(ev) => setPollOptions({...pollOptions, optionC: `${ev.currentTarget.value}`})} id={'option-c'} type={'text'} placeholder={'Option C'} required />
          </label>
          <label>
            <input onChange={(ev) => setPollOptions({...pollOptions, optionD: `${ev.currentTarget.value}`})} id={'option-d'} type={'text'} placeholder={'Option D'} required />
          </label>
        </div>
        <button type={"submit"}>Submit Poll</button>
      </form>
    </div>
  );
}

export default Home;
