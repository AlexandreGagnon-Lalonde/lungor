export const requestUser = () => ({
  type: "REQUEST_USER",
});

export const receiveUser = (user) => ({
  type: "RECEIVE_USER",
  user,
});

export const userError = (message) => ({
  type: "USER_ERROR",
  message,
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

export const pollError = (message) => ({
  type: "POLL_ERROR",
  message,
})

export const votePoll = () => ({
  type: "VOTE_POLL",
})