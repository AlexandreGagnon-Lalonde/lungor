const initialState = {
  polls: [],
  isVoting: false,
  status: 'idle',
};

export default function pollReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_POLLS": {
      return {
        ...state,
        status: "loading",
        isVoting: false,
      };
    }
    case "RECEIVE_POLLS": {
      return {
        ...state,
        status: "idle",
        polls: action.polls,
        isVoting: false,
      };
    }
    case "POLL_ERROR": {
      return {
        ...state,
        status: "Error",
        message: action.error,
        isVoting: false,
      };
    }
    case "VOTE_POLL": {
      return {
        ...state,
        isVoting: true,
      };
    }
    default: {
      return state;
    }
  }
}
