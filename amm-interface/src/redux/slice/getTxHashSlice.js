import { createSlice } from "@reduxjs/toolkit";

const getTXHashSlice = createSlice({
  name: "getTXHash",
  initialState: {
    getTXHash: {
      currentTXHash: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getTXHashStart: (state) => {
      state.getTXHash.isFetching = true;
    },
    getTXHashSuccess: (state, action) => {
      state.getTXHash.isFetching = false;
      state.getTXHash.currentTXHash = action.payload;
      state.getTXHash.error = false;
    },
    getTXHashFailed: (state, action) => {
      state.getTXHash.isFetching = false;
      state.getTXHash.error = true;
    },
  },
});
export const { getTXHashStart, getTXHashSuccess, getTXHashFailed } = getTXHashSlice.actions;

export default getTXHashSlice.reducer;
