import axios from "axios";
import jwt_decode from "jwt-decode";

const refreshToken = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5506/v1/users/refreshToken",
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const createAxiosJWT = (user, dispatch, stateSuccess) => {
  let axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let dateUnixTime = new Date().getTime() / 1000;
      const decodedToken = jwt_decode(user?.accessToken);
      if (decodedToken.exp < dateUnixTime) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(stateSuccess(refreshUser));
        config.headers["token"] = `Bearer ${data.accessToken}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return axiosJWT;
};

export default createAxiosJWT;