import { createSlice } from "@reduxjs/toolkit";

const getTXSlice = createSlice({
  name: "getTX",
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
      state.getTX.currentTx = null;
      state.getTX.error = true;
    },
  },
});
export const { getTXStart, getTXSuccess, getTXFailed } = getTXSlice.actions;

export default getTXSlice.reducer;
