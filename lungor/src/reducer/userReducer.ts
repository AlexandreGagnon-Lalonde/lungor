export interface UserState {
  user: object;
  loggedIn: boolean;
}

const initialState = {
  user: {},
  loggedIn: false,
};

type Action = {
  type: "RECEIVE_USER";
  payload: {
    username: string
    email: string
    votes: number[]
  };
};

export const userReducer = (state: UserState = initialState, action:Action) => {
  switch (action.type) {
    case "RECEIVE_USER": {
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload.username,
          email: action.payload.email,
          votes: action.payload.votes,
        },
        loggedIn: true,
      };
    }
    default:
      return state
  }
};
