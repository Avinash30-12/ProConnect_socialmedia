import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducer/authReducer";
import postReducer from "../redux/reducer/postReducer";


/**
 * 
 * Step for state management using redux toolkit
 * submit action 
 * handle action in its reducer
 * register here -> reducer
 */




export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});