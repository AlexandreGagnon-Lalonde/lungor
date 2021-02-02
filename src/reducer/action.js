export const requestUser = () => ({
  type: "REQUEST_USER",
});

export const receiveUser = (user) => ({
  type: "RECEIVE_USER",
  user,
});
