import { createSlice } from "@reduxjs/toolkit";

const getTxSlice = createSlice({
  name: "getTx",
  initialState: {
    getTX: {
      currentTx: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getTXStart: (state) => {
      state.getTX.isFetching = true;
    },
    getTXSuccess: (state, action) => {
      state.getTX.isFetching = false;
      state.getTX.currentTx = action.payload;
      state.getTX.error = false;
    },
    getTXFailed: (state) => {
      state.getTX.isFetching = false;
      state.getTX.error = true;
    },
  },
});
export const { getTXStart, getTXSuccess, getTXFailed } = getTxSlice.actions;

export default getTxSlice.reducer;
