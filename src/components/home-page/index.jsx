import React from "react";

import { SERVER_URL } from '../../constant';

function Home() {


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type={'text'} placeholder={'Poll Name'} required />
        </label>
        <div>
          <label>
            <input type={'text'} placeholder={'Option A'} required />
          </label>
          <label>
            <input type={'text'} placeholder={'Option B'} required />
          </label>
          <label>
            <input type={'text'} placeholder={'Option C'} required />
          </label>
          <label>
            <input type={'text'} placeholder={'Option D'} required />
          </label>
        </div>
        <button type={"submit"}>Submit Poll</button>
      </form>
    </div>
  );
}

export default Home;
