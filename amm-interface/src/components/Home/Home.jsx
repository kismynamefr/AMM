import axios from "axios";
import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import BNBIcon from "../../assest/Icon/BNB";
import useProvider from "../../hooks/useProvider";
import CloseButton from "./CloseButton/CloseButton";
import FormBuy from "./FormBuy";
import FormSell from "./FormSell";
import UserBuy from "./UserBuy";
import UserSell from "./UserSell";

const Home = () => {
  const [closeNoti, setCloseNoti] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openFormSell, setOpenFormSell] = useState(false);
  const [coinName, setCoinName] = useState({});
  const { Provider } = useProvider();
  const [ether, setEther] = useState({
    type: "ETH",
    network: "Ethereum",
    amount: 0,
  });
  const [USD, setUSD] = useState({
    type: "USDT",
    network: "",
    amount: 0,
  });
  const [DAI, setDAI] = useState({
    type: "DAI",
    network: "Binance",
    amount: 0,
  });
  const [BUSD, setBUSD] = useState({
    type: "BUSD",
    network: "Binance",
    amount: 0,
  });
  const [BNB, setBNB] = useState({
    type: "BNB",
    network: "Binance",
    amount: 0,
  });

  const handleClosed = () => {
    setCloseNoti(true);
  };

  const handlePriceConvertUSD = async () => {
    await Provider("Ethereum").then(async ({ amountOutEth, amountOutDAI }) => {
      const resultUSD =
        (Number(amountOutEth) + Number((amountOutEth * 0.3) / 100)) / 1e6;
      const resultDAIUSD =
        (Number(amountOutDAI) + Number((amountOutDAI * 0.3) / 100)) / 1e6;
      const calcUSD = 23352 + 1050;
      setUSD({
        ...USD,
        amount: calcUSD,
      });
      setEther({
        ...ether,
        amount: (resultUSD + (resultUSD * 0.3) / 100) * calcUSD,
      });
      setDAI({
        ...DAI,
        amount: (resultDAIUSD + (resultDAIUSD * 0.3) / 100) * calcUSD,
      });
    });
  };
  const handlePriceBSCConvertUSD = async () => {
    const calcUSD = 23352 + 1050;
    await Provider("Binance").then(({ amountOutBUSD, amountOutBNB }) => {
      const resultBUSD =
        (Number(amountOutBUSD) + Number((amountOutBUSD * 0.3) / 100)) / 1e6;
      const resultBNB =
        (Number(amountOutBNB) + Number((amountOutBNB * 0.3) / 100)) / 1e6;
      setBNB({
        ...BNB,
        amount: (resultBNB + (resultBNB * 0.3) / 100) * calcUSD,
      });
      setBUSD({
        ...BUSD,
        amount: (resultBUSD + (resultBUSD * 0.3) / 100) * calcUSD,
      });
    });
  };

  const handleOpenForm = (type) => {
    setCoinName(type);
    setOpenForm(true);
    if(openFormSell) {
      setOpenFormSell(false);
    }
  };
  const handleOpenFormSell = (type) => {
    setCoinName(type);
    setOpenFormSell(true);
    if(openForm) {
      setOpenForm(false);
    }
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
        <Users onClick={() => handleOpenForm(BUSD)}>
          <UsersConsident>
            <Avatars src="https://seeklogo.com/images/B/binance-usd-busd-logo-A436FCF6B6-seeklogo.com.png" />
            <UsersText>
              <h4>BUSD</h4>
            </UsersText>
          </UsersConsident>
          <Prices>
            <p>
              {BUSD.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
            </p>
          </Prices>
        </Users>
        <Users onClick={() => handleOpenForm(DAI)}>
          <UsersConsident>
            <Avatars src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=022" />
            <UsersText>
              <h4>DAI</h4>
            </UsersText>
          </UsersConsident>
          <Prices>
            <p>
              {DAI.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
            </p>
          </Prices>
        </Users>
        <Users onClick={() => handleOpenForm(BNB)}>
          <UsersConsident>
            <BNBIcon width="30px" height="30px" />
            <UsersText>
              <h4>BNB</h4>
            </UsersText>
          </UsersConsident>
          <Prices>
            <p>
              {BNB.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
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
              {ether.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              VND
            </p>
          </Prices>
        </Users>
      </>
    );
  };

  useEffect(() => {
    handlePriceConvertUSD();
    handlePriceBSCConvertUSD();
  }, []);

  return (
    <Container>
      <Notification trans={closeNoti ? "-100px" : "0px"}>
        <p>Dịch vụ khác của chúng tôi bao gồm:... </p>
        <p>
          Vui lòng nhập mã giao dịch vào ghi chú giao dịch chuyển khoản. Nếu bạn
          cần hỗ trợ: Liên hệ ...
        </p>
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
          <UserSell setOpenFormSell={setOpenFormSell} handleOpenFormSell={handleOpenFormSell}/>
        </RightSide>
        <LeftSide>
          {openForm ? (
            <FormBuy coinName={coinName} />
          ) : openFormSell ? (
            <FormSell coinName={coinName}/>
          ) : (
            <UserBuy />
          )}
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
export const Users = styled.div`
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
export const UsersConsident = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
export const UsersText = styled.div`
  transition: all 0.5s ease-out;
`;
export const Prices = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
export const Avatars = styled.img`
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

export default memo(Home);
