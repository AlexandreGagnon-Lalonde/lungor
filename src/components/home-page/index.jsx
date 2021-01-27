import React, { useState } from "react";

import { SERVER_URL } from '../../constant';

function Home() {
  const [pollCreation, setPollCreation] = useState(false);
  const [pollName, setPollName] = useState('');
  const [pollOptions, setPollOptions] = useState({
    optionA: { key: '', dataArray: [] },
    optionB: { key: '', dataArray: [], },
    optionC: { key: '', dataArray: [], },
    optionD: { key: '', dataArray: [], },
  });
  const [allPolls, setAllPolls] = useState([]);

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

  React.useEffect(() => {
    fetch(SERVER_URL + `/api/getpolls`)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch(err => console.log(err))

  }, [allPolls])

  return (
    <div>
      <nav>

      </nav>
      {pollCreation ? <form onSubmit={handleSubmit}>
        <p onClick={() => setPollCreation(!pollCreation)}>Hide</p>
        <label>
          <input onChange={(ev) => setPollName(ev.currentTarget.value)} type={'text'} placeholder={'Poll Name'} required />
        </label>
        <div>
          <label>
            <input onChange={(ev) => setPollOptions({...pollOptions, optionA: { ...pollOptions.optionA, key: `${ev.currentTarget.value}` }})} id={'option-a'} type={'text'} placeholder={'Option A'} required />
          </label>
          <label>
            <input onChange={(ev) => setPollOptions({...pollOptions, optionB: { ...pollOptions.optionB, key: `${ev.currentTarget.value}` }})} id={'option-b'} type={'text'} placeholder={'Option B'} required />
          </label>
          <label>
            <input onChange={(ev) => setPollOptions({...pollOptions, optionC: { ...pollOptions.optionC, key: `${ev.currentTarget.value}` }})} id={'option-c'} type={'text'} placeholder={'Option C'} required />
          </label>
          <label>
            <input onChange={(ev) => setPollOptions({...pollOptions, optionD: { ...pollOptions.optionD, key: `${ev.currentTarget.value}` }})} id={'option-d'} type={'text'} placeholder={'Option D'} required />
          </label>
        </div>
        <button type={"submit"}>Submit Poll</button>
      </form> : <div onClick={() => setPollCreation(!pollCreation)}>Create A Poll</div> }
      
      {/* <div>
        {allPolls.map(poll => {
          return <p>{poll.pollName}</p>
        })
  
        }
      </div> */}
    </div>
  );
}

export default Home;
