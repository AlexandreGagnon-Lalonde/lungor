const initialState = {
  user: null,
  otherUser: null,
  status: "idle",
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_USER": {
      return {
        ...state,
        // status: "Loading",
      };
    }
    case "RECEIVE_USER": {
      return {
        ...state,
        // user: action.user,
        // status: "Logged In",
      };
    }
    case "RECEIVE_USER_ERROR": {
      return {
        ...state,
        // errorMessage: action.errorMessage,
        // status: "error",
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        // user: null,
        // otherUser: null,
        // status: "idle",
      };
    }
    default: {
      return state;
    }
  }
}
