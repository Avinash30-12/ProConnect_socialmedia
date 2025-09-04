import { createSlice } from "@reduxjs/toolkit";
import { login, register , getAboutUser, getAllUsers, getConnectionRequest, getMyConnectionRequest } from "../../action/authAction/index";


const initialState = {
  user: undefined,
  isError: false,
  isLoading: false,
  isSuccess: false,
  loggedIn: false,
  message: "",
  isTokenThere:false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users :[],
  all_profiles_fetched :false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere :(state)=>{
      state.isTokenThere = true;
    },
    setTokenIsNotThere :(state) =>{
      state.isTokenThere= false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking the door...";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.isError = false;
        state.message = "Login successful";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Something went wrong";
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking the door...";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.isError = false;
        state.message = { message :"Registration successful ! Please Signin to continue"};
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Something went wrong";
      })
      .addCase(getAboutUser.fulfilled, (state , action) => {
        state.profileFetched = true;
        state.isError = false;
        state.isLoading = false;
        state.user = action.payload.userProfile;
      }) 
      .addCase(getAllUsers.fulfilled , (state , action)=>{
         state.isError = false;
        state.isLoading = false;
        state.all_profiles_fetched =true;
        state.all_users = action.payload.allProfiles;
      })
      .addCase(getConnectionRequest.fulfilled , (state , action)=>{
        state.connections = action.payload 
      })
      .addCase(getConnectionRequest.rejected, (state , action)=>{
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequest.fulfilled, (state , action)=>{
        state.connectionRequest = action.payload
      })
      .addCase(getMyConnectionRequest.rejected, (state , action)=>{
        state.message = action.payload
      })
      
  },
});

export const { reset , emptyMessage ,setTokenIsThere , setTokenIsNotThere } = authSlice.actions;
export default authSlice.reducer;
