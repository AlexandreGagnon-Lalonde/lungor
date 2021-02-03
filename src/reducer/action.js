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