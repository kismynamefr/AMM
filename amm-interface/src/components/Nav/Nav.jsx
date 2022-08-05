import Tippy from "@tippyjs/react/headless";
import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import LogOutIcon from "../../assest/Icon/LogOut";
import Authentication from "./Authentication";

const Nav = () => {
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [visible, setVisible] = useState(true);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <>
      {openModal ? <Authentication setOpenModal={setOpenModal} /> : null}
      <Container>
        <NavHeader>
          <ContentNav>
            <HeaderLogo>
              <a href="#">
                <img
                  src="https://remitano.com/logo-new-white-small.png"
                  alt=""
                />
              </a>
            </HeaderLogo>
          </ContentNav>
          <HeaderTopMenu>
            <a href="#">Giao Dịch P2P</a>
            <a href="#">Phí Chuyển Khoản</a>
            <a href="#">Liên Hệ</a>
            <a href="#">Điều Khoản</a>
            {user ? (
              <Tippy
                content="Tooltip"
                interactive={true}
                interactiveBorder={20}
                delay={100}
                visible={visible}
                onClickOutside={hide}
                render={(attrs) => (
                  <Profile className="box" tabIndex="-1" {...attrs}>
                    <p>
                      {" "}
                      <LogOutIcon /> Log Out
                    </p>
                  </Profile>
                )}
              >
                <UserProfile onClick={visible ? hide : show}>
                  Hi, {user?.username}
                </UserProfile>
              </Tippy>
            ) : (
              <ButtonSign onClick={() => setOpenModal(true)}>
                Sign In
              </ButtonSign>
            )}
          </HeaderTopMenu>
        </NavHeader>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 1rem 4rem;
  width: 100%;
  z-index: 3;
  position: sticky;
  top: -1px;
  left: -1px;
  backdrop-filter: blur(4px);
  background: none;
  transition: background-color 0.25s ease 0s;
  color: white;
  @media (min-width: 992px) {
    display: block;
  }
`;
const NavHeader = styled.div`
  max-width: 1056px;
  width: 100%;
  height: 100%;
  padding-left: 16px;
  padding-right: 16px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ContentNav = styled.div`
  display: flex;
  justify-content: space-between;
`;
const HeaderLogo = styled.div`
  width: 120px;
  height: 30px;
  img {
    width: 100%;
  }
`;
const HeaderTopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin-left: 10px;
    color: white;
    text-decoration: none;
    position: relative;
    transition: all 0.5s ease-in-out 0s;
    &:hover {
      color: rgb(27 158 161) !important;
    }
  }
`;
const ButtonSign = styled.div`
  padding: 8px 0.85rem;
  text-decoration: none;
  border-radius: 12px;
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  border: 2px solid transparent;
  background-color: rgb(27 158 161);
  width: fit-content !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  height: fit-content !important;
  transition: all 0.5s ease-in-out 0s;
  &:hover {
    background-color: rgb(27 158 161 / 78%) !important;
  }
`;
const UserProfile = styled.div`
  cursor: pointer;
  position: relative;
  &:hover {
    text-decoration: underline;
  }
`;
const Profile = styled.div`
  max-height: 350px;
  overflow-y: auto;
  box-shadow: rgb(0 0 0 / 16%) 0px 4px 16px;
  background-color: rgb(255, 255, 255);
  color: rgb(4, 17, 29);
  max-width: initial;
  min-width: 220px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  p {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    gap: 10px;
    cursor: pointer;
    &:hover {
      transition: all 0.2s ease 0s;
      box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
      background-color: rgb(251, 253, 255);
    }
  }
`;
export default memo(Nav);
