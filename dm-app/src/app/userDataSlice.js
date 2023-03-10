//This slice is used by both Login component and 
//Register Component. Hence the need to define
//it in a more central location (ie, app folder) 
//to avoid unnecessary duplicity of codes

import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        email: '',
        isAdmin: false,
        isSeller: false
    },
    reducers: {
        loadUserData: (state, action) => {
            return {
                ...state,
                email: action.payload.email,
                isAdmin: action.payload.isAdmin,
                isSeller: action.payload.isSeller,
            }
        },
        logOutUser: (state) => {
            return {
                ...state,
                email: '',
                isAdmin: false,
                isSeller: false,
            }
        }
    }
});

export const { loadUserData, logOutUser } = userDataSlice.actions;
export default userDataSlice.reducer;