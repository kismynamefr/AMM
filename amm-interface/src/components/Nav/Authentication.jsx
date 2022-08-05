import { memo, useState } from "react";
import styled from "styled-components";
import Login from "../Login/Login";
import Register from "../Register/Register";

const Authentication = ({ setOpenModal }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = () => {
    return !isSignUp ? setIsSignUp(true) : setIsSignUp(false);
  };

  return (
    <Opacity>
      <LoginContainer>
        <LoginForm>
          <TiktokAppContainer>
            <BodyLogin>
              <ButtonClose onClick={() => setOpenModal(false)}>
                <svg
                  className="tiktok-ppm7qc-StyledXMark eaxh4gs2"
                  width="1em"
                  height="1em"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"
                  ></path>
                </svg>
              </ButtonClose>
              <HeaderLogin></HeaderLogin>
              <LoginBody>
                {isSignUp ? (
                  <Register
                    handleSignUp={handleSignUp}
                    setIsSignUp={setIsSignUp}
                  />
                ) : (
                  <Login setOpenModal={setOpenModal} />
                )}
              </LoginBody>
              <Footer>
                {isSignUp ? (
                  <>
                    <p>Bạn chưa có tài khoản?</p>
                    <a onClick={handleSignUp}>Đăng ký</a>
                  </>
                ) : (
                  <>
                    <p>Bạn đã có tài khoản?</p>
                    <a onClick={handleSignUp}>Đăng nhập</a>
                  </>
                )}
              </Footer>
            </BodyLogin>
          </TiktokAppContainer>
        </LoginForm>
      </LoginContainer>
    </Opacity>
  );
};
const Opacity = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0px;
  height: 100%;
  z-index: 9999;
  display: flex;
`;
const LoginContainer = styled.div`
  position: relative;
  border-radius: 8px;
  margin: auto;
  transition: all 300ms cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
  transform: none;
  background-color: rgb(255, 255, 255);
`;
const HeaderLogin = styled.div`
  height: 48px;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 0;
`;
const LoginBody = styled.div`
  min-height: auto;
  height: 100%;
  min-height: 73vh;
  padding: 0 48px 64px;
`;
const ButtonClose = styled.div`
  border: none;
  outline: none;
  padding: 0px;
  position: absolute;
  top: 24px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background: rgba(22, 24, 35, 0.06);
  border-radius: 100%;
  transition: all 200ms ease-in-out 0s;
  right: 24px;
  svg {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
  }
  &:hover {
    background: rgba(22, 24, 35, 0.1);
  }
`;
const LoginForm = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  left: unset;
`;
const TiktokAppContainer = styled.div`
  background: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 472px;
  max-width: 472px;
  min-height: 660px;
  max-height: 472px;
`;
const BodyLogin = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  background-color: #fff;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
  width: 100%;
`;
const Footer = styled.div`
  color: rgb(22, 24, 35);
  font-family: ProximaNova, Arial, Tahoma, PingFangSC, sans-serif;
  height: 64px;
  border-top: 1px solid rgba(22, 24, 35, 0.12);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  font-size: 15px;
  line-height: 18px;
  gap: 5px;
  a {
    color: rgb(27 158 161);
    cursor: pointer;
    &:hover {
      text-decoration: underline rgb(27 158 161);
    }
  }
`;

export default memo(Authentication);
