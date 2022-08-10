import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import EyeClose from "../../assest/Icon/EyeClose";
import EyeOpen from "../../assest/Icon/EyeOpen";
import { loginUser } from "../../redux/apiRequest/apiRequest";
import {
  ButtonRegister,
  ButtonRegisterAllowed,
  Description,
  InputContainer,
  RegisterContainer,
  TitleDiv,
} from "../Register/Register";
import Toast from "../Toast/Toast";

const Login = ({ setOpenModal }) => {
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const errorLogin = useSelector((state) => state.auth.login?.error);
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });

  const handleShowPassword = () => {
    return !showPassword ? setShowPassword(true) : setShowPassword(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    loginUser(formValue, dispatch);
    return !isLogin ? setIsLogin(true) : setIsLogin(false);
  };
  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  useEffect(() => {
    if (user) {
      setOpenModal(false);
      Toast("success", "Đăng nhập thành công");
    }
  }, [user]);

  useEffect(() => {
    if (errorLogin) {
      Toast("error", "Sai tên đăng nhập hoặc mật khẩu");
    }
  }, [errorLogin, isLogin]);

  return (
    <form>
      <RegisterContainer>
        <TitleDiv>ĐĂNG NHẬP</TitleDiv>
        <Description>Username</Description>
        <InputContainer>
          <input
            type="text"
            name="username"
            onChange={handleForm}
            placeholder="Username"
            minLength="6"
            maxLength="10"
          />
        </InputContainer>
        <InputContainer>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleForm}
            placeholder="Password"
            maxLength="20"
            minLength="8"
            autoComplete="on"
          />
          {showPassword ? (
            <EyeOpen handleShowPassword={handleShowPassword} />
          ) : (
            <EyeClose handleShowPassword={handleShowPassword} />
          )}
        </InputContainer>
        <LinkForgotPass>Quên mật khẩu?</LinkForgotPass>
        {formValue.password.length >= 8 && formValue.username.length >= 6 ? (
          <ButtonRegisterAllowed onClick={handleLogin}>
            Đăng Nhập
          </ButtonRegisterAllowed>
        ) : (
          <ButtonRegister>Đăng Nhập</ButtonRegister>
        )}
      </RegisterContainer>
    </form>
  );
};

const LinkForgotPass = styled.a`
  color: rgba(22, 24, 35, 0.75);
  font-weight: 600;
  font-size: 12px;
  display: inline-block;
  cursor: pointer;
  padding-bottom: 10px;
  &:hover {
    text-decoration: underline rgba(22, 24, 35, 0.75);
  }
`;

export default Login;
