import { memo, useEffect, useState } from "react";
import { Users, UsersConsident, Avatars, UsersText, Prices } from "./Home";
import BNBIcon from "../../assest/Icon/BNB";
import useProvider from "../../hooks/useProvider";
import axios from "axios";

const UserSell = ({handleOpenFormSell}) => {
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

  const handlePriceConvertUSD = async () => {
    await Provider("Ethereum").then(async ({ amountOutEth, amountOutDAI }) => {
      const resultUSD =
        (Number(amountOutEth) + Number((amountOutEth * 0.3) / 100)) / 1e6;
      const resultDAIUSD =
        (Number(amountOutDAI) + Number((amountOutDAI * 0.3) / 100)) / 1e6;
      const calcUSD = 23352 + 450;
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
    const calcUSD = 23352 + 450;
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

  const fetchListCoinSell = () => {
    return (
      <>
        <Users onClick={() => handleOpenFormSell(USD)}>
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
        <Users onClick={() => handleOpenFormSell(BUSD)}>
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
        <Users onClick={() => handleOpenFormSell(DAI)}>
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
        <Users onClick={() => handleOpenFormSell(BNB)}>
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
        <Users onClick={() => handleOpenFormSell(ether)}>
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

  return <>{fetchListCoinSell()}</>;
};

export default memo(UserSell);
