import axios from "axios";
import BN from "bn.js";
import dotenv from "dotenv";
import {
  BUSD_BSC_TESTNET_ADDRESS, DAI_BSC_ADDRESS, USDT_BSC_ADDRESS, USDT_ETH_ADDRESS
} from "../abi/Tether";
dotenv.config();

export const checkNetwork = async (
  network: String,
  txHash: string,
  typeCoin: String,
  beginTime: number,
  amountIn: number
) => {
  let resultBSCAPI, resultEtherAPI: any;
  switch (network) {
    case "Ethereum":
      console.log("Ethereum");
      resultEtherAPI = await getTransactionHashByEtherAPI(typeCoin);
      const txHashEtherAPI = resultEtherAPI?.filter(
        (rols: any) =>
          rols?.tokenSymbol === typeCoin &&
          rols?.value === convertNumber(amountIn, Number(rols?.tokenDecimal)) &&
          rols?.timeStamp > beginTime
      );
      return txHashEtherAPI;
    case "Binance":
      console.log("Binance");
      resultBSCAPI = await getTransactionHashByBSCAPI(typeCoin);
      const txHashBSCAPI = resultBSCAPI?.filter(
        (rols: any) =>
          rols?.hash === txHash &&
          rols?.tokenSymbol === typeCoin &&
          rols?.value === convertNumber(amountIn, Number(rols?.tokenDecimal)) &&
          rols?.timeStamp > beginTime
      );
      return txHashBSCAPI;
    default:
      break;
  }
};

const getTransactionHashByBSCAPI = (typeCoin: String) => {
  switch (typeCoin) {
    case "USDT":
      return handleAddressContractToken(USDT_BSC_ADDRESS);
    case "BUSD":
      return handleAddressContractToken(BUSD_BSC_TESTNET_ADDRESS);
    case "DAI":
      return handleAddressContractToken(DAI_BSC_ADDRESS);
    default:
      break;
  }
};

const getTransactionHashByEtherAPI = (typeCoin: String) => {
  switch (typeCoin) {
    case "USDT":
      return handleAddressContractTokenETher(USDT_ETH_ADDRESS);
    default:
      break;
  }
};

const handleAddressContractToken = async (contractAddressToken: String) => {
  let data: any = await axios({
    method: "get",
    url: `https://api-testnet.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddressToken}&address=${process.env.DEFAULT_ADDRESS}&page=1&offset=10&sort=asc&apikey=${process.env.BSC_TESTNET_API_KEY}`,
  });
  return data?.data.result;
};

const handleAddressContractTokenETher = async (
  contractAddressToken: String
) => {
  let data: any = await axios({
    method: "get",
    url: `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddressToken}&address=${process.env.DEFAULT_ADDRESS}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.ETHER_TESTNET_API_KEY}`,
  });
  return data?.data.result;
};

const convertNumber = (amount: number, decimals: number) => {
  const amountToken = (Number(amount) * 10 ** Number(decimals)).toLocaleString(
    "fullwide",
    {
      useGrouping: false,
    }
  );
  const number = new BN(amountToken).toString();
  return number;
};
