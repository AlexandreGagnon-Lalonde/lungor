const initialState = {
  poll: [],
  status: "idle",
};

export default function pollReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_POLL": {
      return {
        ...state,
        // status: "Loading",
      };
    }
    case "RECEIVE_POLL": {
      return {
        ...state,
        // status: "idle",
        // POLL: action.POLL,
      };
    }
    case "RECEIVE_POLL_ERROR": {
      return {
        ...state,
        // status: "Error",
      };
    }
    default: {
      return state;
    }
  }
}
