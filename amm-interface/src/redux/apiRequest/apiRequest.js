import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "../slice/authSlice";

const loginUser = async (user, dispatch, axiosJWT) => {
  dispatch(loginStart());
  try {
    const res = await axiosJWT({
      method: "post",
      url: "http://localhost:5506/v1/users/login",
      data: user,
    });
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailed());
  }
};

export default loginUser;
