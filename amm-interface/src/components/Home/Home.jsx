import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import CloseButton from "./CloseButton/CloseButton";
import Ethereum from "../../assest/token/Ethereum";
import FormBuy from "./FormBuy";
import BNB from "../../assest/Icon/BNB";
import Web3 from "web3";
import { Factory, FactoryAddress } from "../../abi/Factory";
import { Pair } from "../../abi/Pair";
import { Router, RouterAddress } from "../../abi/Router";
import axios from "axios";

const Home = () => {
  const [closeNoti, setCloseNoti] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [coinName, setCoinName] = useState({});
  const [ether, setEther] = useState({
    type: "",
    amount: 0,
  });
  const [USD, setUSD] = useState({
    type: "USDT",
    amount: 0,
  });
  const web3 = new Web3(process.env.REACT_APP_INFURA);
  const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
  const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  const handleClosed = () => {
    setCloseNoti(true);
  };

  const handlePriceConvertUSD = async () => {
    const factory = new web3.eth.Contract(Factory, FactoryAddress);
    const pairAddress = await factory.methods.getPair(USDT, WETH).call();
    const pair = new web3.eth.Contract(Pair, pairAddress);
    const reserves = await pair.methods.getReserves().call();
    const { _reserve0, _reserve1 } = reserves;
    const router = new web3.eth.Contract(Router, RouterAddress);
    const amountOut = await router.methods
      .getAmountOut(`${1 * 10 ** 18}`, _reserve0, _reserve1)
      .call();
    const resultUSD =
      (Number(amountOut) + Number((amountOut * 0.3) / 100)) / 1e6;
    const data = await axios({
      method: "get",
      url: "https://free.currconv.com/api/v7/convert?q=USD_VND&compact=ultra&apiKey=e41422a078ac3f2d3bf7",
    });
    const { USD_VND } = data.data;
    const calcUSD_ETH = USD_VND + (USD_VND * 3.155) / 100;
    setUSD({
      type: "USDT",
      amount: USD_VND + (USD_VND * 3.155) / 100,
    });
    setEther({
      type: "ETH",
      amount: (resultUSD + (resultUSD * 0.3) / 100) * calcUSD_ETH,
    });
  };

  const handleOpenForm = (type) => {
    setCoinName(type);
    setOpenForm(true);
  };

  const fetchListCoinBuy = () => {
    return (
      <>
        <Users onClick={() => handleOpenForm(USD)}>
          <UsersConsident>
            <Avatars src="https://seeklogo.com/images/T/tether-usdt-logo-FA55C7F397-seeklogo.com.png" />
            <UsersText>
              <h4>USDT</h4>
            </UsersText>
          </UsersConsident>
          <Prices>
            <p>
              {USD.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
            </p>
          </Prices>
        </Users>
        <Users onClick={() => handleOpenForm(ether)}>
          <UsersConsident>
            <Avatars src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg" />
            <UsersText>
              <h4>ETH</h4>
            </UsersText>
          </UsersConsident>
          <Prices>
            <p>
              {ether.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              VND
            </p>
          </Prices>
        </Users>
        <Users onClick={() => handleOpenForm("BNB")}>
          <UsersConsident>
            <BNB width="25px" height="25px" />
            <UsersText>
              <h4>BNB</h4>
            </UsersText>
          </UsersConsident>
          <Prices>
            <p>5,138,370 VND</p>
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

  const fetchListUsersBuy = () => {
    return (
      <>
        <TitleRightSide>
          <h4>Giao dịch thành công gần đây:</h4>
        </TitleRightSide>
        <UsersBuy>
          <UsersConsident>
            <UsersText>
              <h5>Mua Ethereum</h5>
              <p>{"Ox123214...24144x5"}</p>
              <p style={{ color: "#8d8b8b" }}>1 hours ago</p>
            </UsersText>
          </UsersConsident>
          <Prices>
            <Ethereum height={15} width={15} />
            <p>252,520 VND</p>
          </Prices>
        </UsersBuy>
        <UsersBuy>
          <UsersConsident>
            <UsersText>
              <h5>Mua Ethereum</h5>
              <p>{"Ox123214...24144x5"}</p>
              <p style={{ color: "#8d8b8b" }}>1 hours ago</p>
            </UsersText>
          </UsersConsident>
          <Prices>
            <Ethereum height={15} width={15} />
            <p>252,520 VND</p>
          </Prices>
        </UsersBuy>
      </>
    );
  };

  useEffect(() => {
    handlePriceConvertUSD();
  }, []);

  return (
    <Container>
      <Notification trans={closeNoti ? "-100px" : "0px"}>
        <p>Dịch vụ khác của chúng tôi bao gồm:... </p>
        <p>Vui lòng nhập mã giao dịch vào ghi chú giao dịch chuyển khoản. Nếu bạn cần hỗ trợ: Liên hệ ...</p>
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
        <LeftSide>
          {openForm ? <FormBuy coinName={coinName}/> : fetchListUsersBuy()}
        </LeftSide>
      </SideItem>
    </Container>
  );
};

export const Container = styled.div`
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
  flex-wrap: nowrap;
  border-radius: 10px;
  justify-content: space-between;
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
export const TitleRightSide = styled.div`
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
const LeftSide = styled.div`
  display: flex;
  flex-flow: column;
  gap: 20px;
  width: 100%;
  min-height: 70vh;
  max-width: 440px;
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
const UsersBuy = styled.div`
  display: flex;
  width: 100%;
  gap: 15px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 10px;
  p {
    font-size: 13px;
  }
`;

export default memo(Home);
