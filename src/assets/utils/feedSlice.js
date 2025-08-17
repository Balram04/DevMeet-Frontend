import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload;
        },
        removeUserFeed:(state,action)=>{
            if (state && state.users) {
                const newUsers = state.users.filter((user) => user._id !== action.payload);
                return { ...state, users: newUsers };
            }
            return state;
        }
     },
})

export const{ addFeed, removeUserFeed } = feedSlice.actions;

export default feedSlice.reducer;