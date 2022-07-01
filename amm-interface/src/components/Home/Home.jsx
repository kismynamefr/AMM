import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import CloseButton from "./CloseButton/CloseButton";

const Home = () => {
  const [closeNoti, setCloseNoti] = useState(false);

  const handleClosed = () => {
    setCloseNoti(true);
  };

  const fetchListCoinBuy = () => {
    return (
      <>
        <Users>
          <UsersConsident>
            <Avatars src="https://seeklogo.com/images/T/tether-usdt-logo-FA55C7F397-seeklogo.com.png" />
            <UsersText>
              <h4>USDT</h4>
            </UsersText>
          </UsersConsident>
          <Prices>
            <p>22,000 VND</p>
          </Prices>
        </Users>
      </>
    );
  };
  const fetchListCoinSell = () => {
    return (
      <>
        <Users>
          <UsersConsident>
            <Avatars src="https://seeklogo.com/images/T/tether-usdt-logo-FA55C7F397-seeklogo.com.png" />
            <UsersText>
              <h4>USDT</h4>
            </UsersText>
          </UsersConsident>
          <Prices>
            <p>22,000 VND</p>
          </Prices>
        </Users>
      </>
    );
  };

  return (
    <Container>
      <Notification trans={closeNoti ? "-100px" : "0px"}>
        <p>Dịch vụ khác của chúng tôi bao gồm:... </p>
        <p>Cần hỗ trợ: Chat trực tiếp trên website</p>
        <CloseButton handleClosed={handleClosed} />
      </Notification>
      <SideItem trans={closeNoti ? "-100px" : "0px"}>
        <RightSide>
          <TitleRightSide>
            <h4>Chọn Coin BẠN CẦN MUA:</h4>
          </TitleRightSide>
          {fetchListCoinBuy()}
        </RightSide>
        <RightSide>
          <TitleRightSide>
            <h4>Chọn Coin BẠN CẦN BÁN:</h4>
          </TitleRightSide>
          {fetchListCoinSell()}
        </RightSide>
      </SideItem>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1056px;
  width: 100%;
  height: 100%;
  padding-left: 16px;
  padding-right: 16px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 20px;
  overflow: hidden;
`;
const Notification = styled.div`
  display: ${(props) => props.dis};
  flex-flow: column;
  width: 100%;
  padding: 1.5rem;
  background: rgb(37 155 159);
  border-radius: 10px;
  position: relative;
  transition: all 0.5s ease-out;
  transform: translate3d(0px, ${(props) => props.trans}, 0px);
`;
const SideItem = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  border-radius: 10px;
  gap: 1rem;
  transform: translate3d(0px, ${(props) => props.trans}, 0px);
  transition: transform 0.5s ease 0s, opacity 0.3s ease 0s;
  &::-webkit-scrollbar {
    width: 0px;
  }
  @media only screen and (max-width: 1005px) {
    padding: 0px 10px 10px;
  }
  @media only screen and (max-width: 500px) {
    padding: 0;
  }
`;
const RightSide = styled.div`
  display: flex;
  flex-flow: column;
  gap: 20px;
  width: 100%;
  min-height: 70vh;
  max-width: 280px;
  background: linear-gradient(
    123.64deg,
    rgba(255, 255, 255, 0) -22.38%,
    rgba(255, 255, 255, 0.039) 70.38%
  );
  backdrop-filter: blur(42px);
  border-radius: 20px;
  border: 2px solid #757575;
  padding: 1rem 2rem;
  transition: all 0.5s ease-out;
`;
const TitleRightSide = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 2rem;
`;
const Users = styled.div`
  display: flex;
  width: 100%;
  gap: 15px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 10px;
  transition: all 0.5s ease-out;
  &:hover {
    background: rgb(37 155 159);
    border-radius: 10px;
  }
`;
const UsersConsident = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const UsersText = styled.div`
  transition: all 0.5s ease-out;
`;
const Prices = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const Avatars = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  transition: all 0.5s ease-out;
  object-fit: cover;
  @media only screen and (max-width: 1700px) {
    width: 30px;
    height: 30px;
  }
`;

export default memo(Home);
