import axios from "axios";
import {
  getTXHashStart,
  getTXHashSuccess,
  getTXHashFailed,
} from "../slice/getTxHashSlice";

const getTXHash = async (serialId, accessToken, dispatch, axiosJWT) => {
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

export default getTXHash;
