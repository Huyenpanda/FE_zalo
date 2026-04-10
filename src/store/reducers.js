import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice'; // import slice

const rootReducer = combineReducers({
  user: userReducer,
  // thêm reducer khác ở đây
});

export default rootReducer;