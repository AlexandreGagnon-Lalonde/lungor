const initialState = {
  user: null,
  userStatus: 'out'
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_USER": {
      return {
        ...state,
        userStatus: "loading",
      };
    }
    case "RECEIVE_USER": {
      return {
        ...state,
        user: action.user,
        userStatus: "in",
      };
    }
    case "RECEIVE_USER_ERROR": {
      return {
        ...state,
        errorMessage: action.errorMessage,
        userStatus: "error",
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        user: null,
        userStatus: "out",
      };
    }
    default: {
      return state;
    }
  }
}
