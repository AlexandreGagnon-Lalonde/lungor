import React, { useState } from "react";

import { SERVER_URL, initialData } from '../../constant';

function Home() {
  const [pollCreation, setPollCreation] = useState(false);
  const [pollName, setPollName] = useState('');
  const [pollOptions, setPollOptions] = useState(initialData);
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
        fetchAllPolls()
      })
      .catch(err => console.log(err))
    
    setPollName('')
    setPollOptions(initialData)
  }

  const fetchAllPolls = () => {
    fetch(SERVER_URL + `/api/getpolls`)
      .then((res) => res.json())
      .then((data) => {
        setAllPolls(data.polls)
      })
      .catch(err => console.log(err))
  }

  const addOption = (ev) => {
    ev.preventDefault();

    const newData = {
      optionName: '',
      voters: [],
    }

    const newOptions = [...pollOptions]

    newOptions.push(newData)

    setPollOptions(newOptions);
  }

  const removeOption = (ev, index) => {
    ev.preventDefault();

    const updatedOptions = pollOptions.filter((option, id) => id !== index);

    setPollOptions(updatedOptions)
  }

  const updatePollName = (ev) => {
    setPollName(ev.currentTarget.value)
  }

  const updateOptionName = (ev, index) => {
    const updatedOptions = [...pollOptions]

    updatedOptions[index].optionName = ev.currentTarget.value

    setPollOptions(updatedOptions)
  }

  React.useEffect(() => {
    if (allPolls.length === 0) {
      fetchAllPolls()
    }
  }, [])

  return (
    <div>
      {pollCreation ? <form onSubmit={handleSubmit}>
        <p onClick={() => setPollCreation(!pollCreation)}>Hide</p>
        <label>
          <input onChange={updatePollName} value={pollName} type={'text'} placeholder={'Poll Name'} required />
        </label>
        <div id={'option-input'}>

          {
            pollOptions.map((option, index) => {
              return <>
                <label>
                  <input onChange={(ev) => updateOptionName(ev, index)} value={pollOptions[index].optionName} className={`option-${index}`} type={'text'} placeholder={'Option'} required />
                  {(pollOptions.length > 2) && <button type={'button'} className={`option-${index}`} onClick={(ev) => removeOption(ev, index)} >-</button>}
                </label>
                {(index === pollOptions.length - 1 && pollOptions.length < 5) && <button type={'button'} onClick={(ev) => addOption(ev)} >+</button>}
              </>
            })
          }

        </div>
        <button type={"submit"}>Submit Poll</button>
      </form> : <div onClick={() => setPollCreation(!pollCreation)}>Create A Poll</div> }
      
      <div>
        {
          allPolls.map(poll => {
            return <div>
              <p>{poll.pollName}</p>
              <ul>
                {poll.options.map(option => {
                  return <li>{`${option.voters.length} - ${option.optionName}`}</li>
                })}
              </ul>
            </div>
          })
        }
      </div>
    </div>
  );
}

export default Home;
