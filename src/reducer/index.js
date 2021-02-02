import { combineReducers } from "redux";

import user from "./user-reducer";
import poll from "./poll-reducer";

export default combineReducers({
  poll,
  user,
});
