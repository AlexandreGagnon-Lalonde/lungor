import { createStore } from 'redux';
import { userReducer } from './userReducer';

export const store = createStore(userReducer);