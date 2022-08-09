import axios from "axios";
import { getTXStart, getTXSuccess, getTXFailed } from "../slice/getTxSlice";

const getTx = async (serialId, accessToken, dispatch, axiosJWT) => {
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

export default getTx;
