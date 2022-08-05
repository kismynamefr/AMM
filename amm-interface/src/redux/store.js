import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import sendTXReducer from "./slice/sendTxSlide";
import getTXReducer from "./slice/getTxSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    sendTx: sendTXReducer,
    getTx: getTXReducer,
  },
});
export default store;
