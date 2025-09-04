import { createSlice } from "@reduxjs/toolkit";
import { getAllComments, getAllPosts } from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading : false,
  loggedIn: false,
  message: "",
  comments: [],
  postId:'',
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: ()=> initialState,
    resetPostId: (state) => {
      state.postId = ''
    },    
},
   extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.postFetched = true;
        state.isError = false;
        state.posts = action.payload.reverse();
        state.message = "Posts fetched successfully!";
      })
      .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch posts.";
       })
       .addCase(getAllComments.fulfilled , (state,action)=>{
           state.postId = action.payload.post_id,
           state.comments = action.payload.comments
       })
   }  
})

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;