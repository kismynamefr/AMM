import { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Error from "../../assest/Icon/Error";
import EyeClose from "../../assest/Icon/EyeClose";
import EyeOpen from "../../assest/Icon/EyeOpen";
import Toast from "../Toast/Toast";

const Register = ({ setIsSignUp }) => {
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    email: "",
    username: "",
    password: "",
    digitCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [beginCountDown, setBeginCountDown] = useState(false);
  const [codeEmail, setCodeEmail] = useState("");

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleShowPassword = () => {
    return !showPassword ? setShowPassword(true) : setShowPassword(false);
  };

  const test = () => {
    setFormError(validate(formValue));
  };
  const validate = (values) => {
    let errors = {};
    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const usernameRegex = /^[a-z0-9_.]+$/;
    var atposition = values.email.indexOf("@");
    var dotposition = values.email.lastIndexOf(".");
    if (
      (values.email && atposition < 1) ||
      dotposition < atposition + 2 ||
      dotposition + 2 >= values.email.length
    ) {
      errors.emailFormat = "Invalid email format";
    }
    if (values.password && !regexPassword.test(values.password)) {
      errors.passwordFormat = "Invalid password format";
    }
    if (values.username && !usernameRegex.test(values.username)) {
      errors.usernameFormat = "Invalid username format";
    }

    return errors;
  };

  const handleSendCode = () => {
    setBeginCountDown(true);
    axios({
      method: "post",
      url: "http://localhost:5506/v1/users/sendMail",
      data: {
        email: formValue.email,
      },
    }).then((res) => {
      console.log(res);
      if (res.data?.status === "Success") {
        setCodeEmail(String(res.data.code));
      }
    });
  };
  const handleRegister = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: "http://localhost:5506/v1/users/register",
      data: formValue,
    }).then(async (res) => {
      console.log(res);
      if (res.data?.status === "Success") {
        await Toast("success", "Đăng ký tài khoản thành công");
        setIsSignUp(false);
      }
    });
  };
  const countDownNotRerender = useCallback(() => {
    let i = 60;
    const interval = setInterval(() => {
      --i;
      setCountDown(i);
      if (i < 1) {
        clearInterval(interval);
        setBeginCountDown(false);
        setCountDown(60);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      formValue.password.length >= 8 ||
      formValue.email.length >= 8 ||
      formValue.username.length >= 6
    )
      test();
  }, [formValue]);

  useEffect(() => {
    if (beginCountDown) {
      countDownNotRerender();
    }
  }, [beginCountDown]);

  useEffect(() => {
    
  })

  return (
    <form action="POST">
      <RegisterContainer>
        <TitleDiv>ĐĂNG KÝ</TitleDiv>
        <Description>Email</Description>
        <InputContainer>
          <input
            type="text"
            name="email"
            onChange={handleForm}
            placeholder="Gmail address"
            style={
              formError.emailFormat
                ? { border: "1px solid red" }
                : { border: "1px solid rgba(22, 24, 35, 0.12)" }
            }
          />
          {formError.emailFormat ? <Error width="15px" height="15px" /> : null}
        </InputContainer>
        <InputContainer>
          <input
            type="text"
            name="username"
            onChange={handleForm}
            placeholder="Username"
            minLength="6"
            maxLength="10"
            style={
              formError.usernameFormat
                ? { border: "1px solid red" }
                : { border: "1px solid rgba(22, 24, 35, 0.12)" }
            }
          />
          {formError.usernameFormat ? (
            <Error width="15px" height="15px" />
          ) : null}
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
        <Description style={{ fontSize: "13px" }}>
          Mật khẩu của bạn phải có:
        </Description>
        <ConditionPassword>
          <li
            style={
              formError.passwordLength
                ? { color: "red" }
                : formValue.password.length >= 8
                ? { color: "#20cd54" }
                : { color: "rgba(22, 24, 35, 0.5)" }
            }
          >
            8 đến 20 ký tự
          </li>
          <li
            style={
              formError.passwordFormat
                ? { color: "red" }
                : formValue.password.length >= 8
                ? { color: "#20cd54" }
                : { color: "rgba(22, 24, 35, 0.5)" }
            }
          >
            Chữ thường, chữ hoa, số và ký tự đặc biệt
          </li>
        </ConditionPassword>
        <InputSendCodeContainer>
          <input
            type="number"
            name="digitCode"
            id="digitCode"
            onChange={handleForm}
            placeholder="Enter 6-digit code"
            onInput={(e) => (e.target.value = e.target.value.slice(0, 6))}
          />
          {Object.entries(formError).length === 0 &&
          formValue.password.length >= 8 &&
          formValue.email.length >= 8 ? (
            !beginCountDown ? (
              <ButtonSendCodeAllowed onClick={handleSendCode}>
                Send Code
              </ButtonSendCodeAllowed>
            ) : (
              <ButtonSendCode disabled>{countDown}</ButtonSendCode>
            )
          ) : (
            <ButtonSendCode disabled>Send Code</ButtonSendCode>
          )}
        </InputSendCodeContainer>
        {codeEmail === formValue.digitCode &&
        codeEmail.length === 6 &&
        formValue.digitCode.length === 6 ? (
          <ButtonRegisterAllowed onClick={handleRegister}>
            Đăng Ký
          </ButtonRegisterAllowed>
        ) : (
          <ButtonRegister>Đăng Ký</ButtonRegister>
        )}
      </RegisterContainer>
    </form>
  );
};

export const TitleDiv = styled.div`
  color: rgb(22, 24, 35);
  font-size: 32px;
  margin: 16px auto;
  font-weight: bold;
  text-align: center;
`;
export const RegisterContainer = styled.div`
  width: 375px;
  height: 100%;
  margin: auto;
  padding: unset;
`;
export const Description = styled.div`
  color: rgb(22, 24, 35);
  font-weight: 600;
  font-size: 15px;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-bottom: 5px;
`;
export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 9px;
  input {
    border-radius: 2px;
    background-color: rgba(22, 24, 35, 0.06);
    border: 1px solid rgba(22, 24, 35, 0.12);
    padding-inline: 12px 24px;
    line-height: 100%;
    outline: none;
    font-size: 14px;
    height: 44px;
    caret-color: rgb(254, 44, 85);
    width: 100%;
    position: relative;
  }
`;
const ConditionPassword = styled.div`
  color: rgba(22, 24, 35, 0.5);
  font-size: 13px;
  line-height: 20px;
  margin-bottom: 16px;
`;
const InputSendCodeContainer = styled.div`
  height: 47px;
  border-inline-end-width: 0px;
  border-radius: 2px 0px 0px 2px;
  position: relative;
  margin-bottom: 9px;
  display: flex;
  input {
    border-radius: 2px;
    background-color: rgba(22, 24, 35, 0.06);
    border: 1px solid rgba(22, 24, 35, 0.12);
    padding-inline-start: 12px;
    color: rgb(22, 24, 35);
    line-height: 100%;
    outline: none;
    font-size: 16px;
    height: 44px;
    width: 100%;
    padding-inline-end: unset;
  }
`;
const ButtonSendCode = styled.button`
  color: rgb(22, 24, 35);
  margin: 0px;
  background-color: rgb(255, 255, 255);
  border-color: rgba(22, 24, 35, 0.12);
  border-width: 1.5px;
  border-style: solid;
  border-radius: 0px 4px 4px 0px;
  border-inline-start-width: 1.5px;
  cursor: not-allowed;
  font-size: 16px;
  padding: 0px 16px;
  height: 44px;
  flex-shrink: 0;
  box-sizing: content-box;
  min-width: 80px;
`;
const ButtonSendCodeAllowed = styled.button`
  margin: 0px;
  background-color: rgb(27 158 161);
  border: none;
  color: white;
  border-radius: 0px 4px 4px 0px;
  border-inline-start-width: 1.5px;
  cursor: pointer;
  font-size: 15px;
  padding: 0px 16px;
  height: 44px;
  flex-shrink: 0;
  box-sizing: content-box;
`;
export const ButtonRegister = styled.button`
  border: none;
  color: rgba(22, 24, 35, 0.34);
  background-color: rgba(22, 24, 35, 0.06);
  pointer-events: none;
  display: flex;
  width: 100%;
  height: 44px;
  justify-content: center;
  align-items: center;
  font-size: 15px;
`;
export const ButtonRegisterAllowed = styled.button`
  border: none;
  color: white;
  background-color: rgb(27 158 161);
  cursor: pointer;
  display: flex;
  width: 100%;
  height: 44px;
  justify-content: center;
  align-items: center;
  font-size: 15px;
`;
export default memo(Register);
