import React, { memo } from "react";
import styled from "styled-components";

const Nav = () => {
  return (
    <Container>
      <NavHeader>
        <ContentNav>
          <HeaderLogo>
            <a href="#">
              <img src="https://remitano.com/logo-new-white-small.png" alt="" />
            </a>
          </HeaderLogo>
        </ContentNav>
        <HeaderTopMenu>
          <a href="#">Giao Dịch P2P</a>
          <a href="#">Phí Chuyển Khoản</a>
          <a href="#">Liên Hệ</a>
          <a href="#">Điều Khoản</a>
          <ButtonSign>Sign In</ButtonSign>
        </HeaderTopMenu>
      </NavHeader>
    </Container>
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
export default memo(Nav);
