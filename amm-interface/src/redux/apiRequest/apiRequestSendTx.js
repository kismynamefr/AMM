import axios from "axios";
import { sendTXStart, sendTXSuccess, sendTXFailed } from "../slice/sendTxSlide";

const sendTx = async (transaction, accessToken, dispatch) => {
  dispatch(sendTXStart());
  try {
    const res = await axios({
      method: "post",
      url: "http://localhost:5506/v1/transaction/",
      data: transaction,
      headers: {
        token: `Bearer ${accessToken}`,
      }
    });
    console.log(res?.data);
    dispatch(sendTXSuccess(res.data.status));
  } catch (error) {
    dispatch(sendTXFailed());
  }
};

export default sendTx;
