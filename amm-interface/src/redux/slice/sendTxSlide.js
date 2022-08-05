import { createSlice } from "@reduxjs/toolkit";

const sendTxSlice = createSlice({
  name: "sendTx",
  initialState: {
    sendTX: {
      status: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    sendTXStart: (state) => {
      state.sendTX.isFetching = true;
    },
    sendTXSuccess: (state, action) => {
      state.sendTX.isFetching = false;
      state.sendTX.status = action.payload;
      state.sendTX.error = false;
    },
    sendTXFailed: (state, action) => {
      state.sendTX.isFetching = false;
      state.sendTX.status = action.payload;
      state.sendTX.error = true;
    },
  },
});
export const { sendTXStart, sendTXSuccess, sendTXFailed } = sendTxSlice.actions;

export default sendTxSlice.reducer;
