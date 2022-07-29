import axios from "axios";
import { memo, useEffect, useState, useTransition } from "react";
import styled from "styled-components";
import BNBIcon from "../../assest/Icon/BNB";
import Ethereum from "../../assest/token/Ethereum";
import Spinner from "../Spinner/Spinner";
import {
    Avatars, Prices, TitleRightSide,
    UsersConsident,
    UsersText
} from "./Home";

const UserBuy = () => {
  const [isPending, startTransition] = useTransition();
  const [resultTransactionStatus, setResultTransactionStatus] = useState([]);

  const splitAccount = (account) => {
    return account.substring(0, 6) + "..." + account.substring(38, 42);
  };

  const fetchListUsersBuy = () => {
    resultTransactionStatus &&
      resultTransactionStatus.sort((a, b) => {
        let unixTimeStampA = new Date(a.updatedAt).getTime();
        let unixTimeStampB = new Date(b.updatedAt).getTime();
        return unixTimeStampB - unixTimeStampA;
      });
    const newData = resultTransactionStatus.splice(0, 5);

    return isPending ? (
      <ContainerCenter>
        <Spinner />
      </ContainerCenter>
    ) : (
      <>
        <TitleRightSide>
          <h4>Giao dịch thành công gần đây:</h4>
        </TitleRightSide>
        {newData &&
          newData.map((res, index) => {
            let unixTimeStamp = new Date(res.updatedAt).getTime();
            let unixTimeStampNow = new Date().getTime();
            let timeRight = (
              (unixTimeStampNow - unixTimeStamp) /
              60 /
              1000
            ).toFixed(0);
            return (
              <UsersBuy key={index}>
                <UsersConsident>
                  <UsersText>
                    <h5>
                      {res.condition === "Buy" ? "Mua" : "Bán"} {res.typeCoin}{" "}
                      {res.network}
                    </h5>
                    <p>{splitAccount(res.walletAddress)}</p>
                    <p style={{ color: "#8d8b8b" }}>
                      {timeRight > 60
                        ? `${(timeRight / 60).toFixed(0)} giờ trước`
                        : `${timeRight} phút trước`}
                    </p>
                  </UsersText>
                </UsersConsident>
                <Prices>
                  {res.typeCoin === "ETH" ? (
                    <Ethereum height={15} width={15} />
                  ) : res.typeCoin === "USDT" ? (
                    <Avatars
                      style={{ width: "20px", height: "20px" }}
                      src="https://seeklogo.com/images/T/tether-usdt-logo-FA55C7F397-seeklogo.com.png"
                    />
                  ) : res.typeCoin === "BUSD" ? (
                    <Avatars
                      style={{ width: "20px", height: "20px" }}
                      src="https://seeklogo.com/images/B/binance-usd-busd-logo-A436FCF6B6-seeklogo.com.png"
                    />
                  ) : res.typeCoin === "BNB" ? (
                    <BNBIcon width="20px" height="20px" />
                  ) : res.typeCoin === "DAI" ? (
                    <Avatars
                      style={{ width: "20px", height: "20px" }}
                      src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=022"
                    />
                  ) : null}
                  <p>
                    {res.amountIn
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ""}{" "}
                    VND
                  </p>
                </Prices>
              </UsersBuy>
            );
          })}
      </>
    );
  };

  useEffect(() => {
    startTransition(() => {
      axios({
        method: "get",
        url: `http://localhost:5506/users/transactionStatus/success`,
      }).then((data) => {
        setResultTransactionStatus(data.data.result);
      });
    });
  }, []);

  return fetchListUsersBuy();
};

const ContainerCenter = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
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

export default memo(UserBuy);
