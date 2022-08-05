import axios from "axios";
import { getTXStart, getTXSuccess, getTXFailed } from "../slice/getTxSlice";

const getTx = async (serialId, accessToken, dispatch) => {
  dispatch(getTXStart());
  try {
    const res = await axios({
      method: "get",
      url: `http://localhost:5506/v1/transaction/getTransaction/${serialId}`,
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    console.log(res?.data);
    dispatch(getTXSuccess(res.data));
  } catch (error) {
    dispatch(getTXFailed());
  }
};

export default getTx;
