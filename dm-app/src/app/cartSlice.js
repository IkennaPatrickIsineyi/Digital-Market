//This slice is used by both Login component and 
//Register Component. Hence the need to define
//it in a more central location

import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
    },
    reducers: {
        addToCart: (state, action) => {
            return {
                ...state,
                items: [...state.items, ...action.payload.trending],
            }
        }
    }
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;