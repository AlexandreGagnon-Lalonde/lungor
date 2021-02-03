export const requestUser = () => ({
  type: "REQUEST_USER",
});

export const receiveUser = (user) => ({
  type: "RECEIVE_USER",
  user,
});

export const userError = (errorMessage) => ({
  type: "USER_ERROR",
  errorMessage,
})

export const userLogout = () => ({
  type: "LOGOUT",
})

export const requestPolls = () => ({
  type: "REQUEST_POLLS",
});

export const receivePolls = (polls) => ({
  type: "RECEIVE_POLLS",
  polls,
});

export const pollError = (errorMessage) => ({
  type: "POLL_ERROR",
  errorMessage,
})

export const votePoll = () => ({
  type: "VOTE_POLL",
})