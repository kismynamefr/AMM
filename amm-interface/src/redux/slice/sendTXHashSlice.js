import { createSlice } from "@reduxjs/toolkit";

const sendTxHashSlice = createSlice({
    name: "sendTXHash",
    initialState: {
        sendTXHash: {
            status: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        sendTXHashStart: (state) => {
            state.sendTXHash.isFetching = true;
        },
        sendTXHashSuccess: (state, action) => {
            state.sendTXHash.isFetching = false;
            state.sendTXHash.status = action.payload;
            state.sendTXHash.error = false;
        },
        sendTXHashFailed: (state, action) => {
            state.sendTXHash.isFetching = false;
            state.sendTXHash.error = true;
        },
    },
});
export const { sendTXHashStart, sendTXHashSuccess, sendTXHashFailed } = sendTxHashSlice.actions;

export default sendTxHashSlice.reducer;
