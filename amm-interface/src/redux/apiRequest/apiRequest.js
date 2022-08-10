import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "../slice/authSlice";
import { getTXFailed, getTXStart, getTXSuccess } from "../slice/getTxSlice";
import {
  getTXHashFailed,
  getTXHashStart,
  getTXHashSuccess,
} from "../slice/getTxHashSlice";
import { sendTXFailed, sendTXStart, sendTXSuccess } from "../slice/sendTxSlide";

export const loginUser = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios({
      method: "post",
      url: "http://localhost:5506/v1/users/login",
      data: user,
    });
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const getTX = async (serialId, accessToken, dispatch, axiosJWT) => {
  dispatch(getTXStart());
  try {
    const res = await axiosJWT({
      method: "get",
      url: `http://localhost:5506/v1/transaction/getTransaction/${serialId}`,
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(getTXSuccess(res?.data));
  } catch (error) {
    dispatch(getTXFailed());
  }
};

export const getTXHash = async (serialId, accessToken, dispatch, axiosJWT) => {
  dispatch(getTXHashStart());
  try {
    const res = await axiosJWT({
      method: "get",
      url: `http://localhost:5506/v1/transaction/getTransactionHash/${serialId}`,
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(getTXHashSuccess(res?.data));
  } catch (error) {
    dispatch(getTXHashFailed());
  }
};

export const sendTx = async (transaction, accessToken, dispatch, axiosJWT) => {
  dispatch(sendTXStart());
  try {
    const res = await axiosJWT({
      method: "post",
      url: "http://localhost:5506/v1/transaction/",
      data: transaction,
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    console.log(res?.data);
    dispatch(sendTXSuccess(res.data.status));
  } catch (error) {
    dispatch(sendTXFailed());
  }
};

export const logOutUser = async (dispatch) => {
  
};
