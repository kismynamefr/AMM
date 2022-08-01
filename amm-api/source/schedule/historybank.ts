import axios from "axios";
import BN from "bn.js";
import dotenv from "dotenv";
import schedule from "node-schedule";
import Web3 from "web3";
import {
  BUSD_BSC_ABI,
  BUSD_BSC_TESTNET_ADDRESS,
  USDT_ETH_ABI,
  USDT_ETH_ADDRESS,
  USDT_BSC_ADDRESS,
  USDT_BSC_ABI,
  DAI_BSC_ABI,
  DAI_BSC_ADDRESS,
} from "../abi/Tether";
import users from "../models/transactionModel";
dotenv.config();

const sendEther = async (
  network: any,
  typeCoin: String,
  walletAddress: String,
  amountOut: any
) => {
  switch (typeCoin) {
    case "USDT":
      switch (network) {
        case "Ethereum":
          await sendTrx(
            walletAddress,
            amountOut,
            process.env.ROPSTEN_INFURA_KEY,
            USDT_ETH_ABI,
            USDT_ETH_ADDRESS,
            6
          );
          break;
        case "Binance":
          await sendTrx(
            walletAddress,
            amountOut,
            process.env.QUICKNODE_BSC_TESTNET,
            USDT_BSC_ABI,
            USDT_BSC_ADDRESS,
            18
          );
          break;
        default:
          break;
      }
      break;
    case "BUSD":
      await sendTrx(
        walletAddress,
        amountOut,
        process.env.QUICKNODE_BSC_TESTNET,
        BUSD_BSC_ABI,
        BUSD_BSC_TESTNET_ADDRESS,
        18
      );
      break;
    case "DAI":
      await sendTrx(
        walletAddress,
        amountOut,
        process.env.QUICKNODE_BSC_TESTNET,
        DAI_BSC_ABI,
        DAI_BSC_ADDRESS,
        18
      );
      break;
    default:
      break;
  }
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

const sendTrx = async (
  walletAddress: String,
  amountOut: any,
  httpProvider: any,
  abi: any,
  address: string,
  symbolCoin: number
) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(`${httpProvider}`));
  const admin = await web3.eth.accounts.wallet.add(
    `${process.env.PRIVATE_KEY}`
    //privateKey wallet
  );
  const Contract = new web3.eth.Contract(abi, address);
  const tx = await Contract.methods
    .transfer(walletAddress, convertNumber(amountOut, symbolCoin))
    .encodeABI();
  const txdata = {
    from: admin.address,
    to: address,
    data: tx,
    gasLimit: 6721975,
    gas: 2000000,
  };
  await web3.eth.sendTransaction(txdata).then((dataTrx) => {
    console.log(dataTrx);
  });
};

const reUpStatusFailed = async (serial: String) => {
  await users.updateOne({ serial: serial }, { status: "failed" });
  console.log(`Update status failed for serial ${serial}`);
};
const reUpStatusSuccess = async (serial: String) => {
  await users.updateOne({ serial: serial }, { status: "success" });
  console.log(`Update status success for serial ${serial}`);
};

const checkTxFailed = async () => {
  const fetchUsers = await users.find();
  const resultFinal = fetchUsers?.filter((res) => {
    if (res.status === "pending") {
      if (res.lastestTime < Math.floor(new Date().getTime() / 1000)) {
        reUpStatusFailed(res.serial);
      } else if(res.condition === "Buy") {
        return true;
      }
    }
  });
  return resultFinal;
};

const checkTxValid = async () => {
  axios({
    method: "get",
    url: `https://api.web2m.com/historyapivcbv3/${process.env.PASSWORK_BANK}/${process.env.USERNAME_BANK}/${process.env.SECRET_KEY}`,
  }).then(async (data) => {
    checkTxFailed().then((res) => {
      console.log("res1: ", res);
      if (res.length === 0) return;
      res?.map((result) => {
        const his = data.data.transactions;
        console.log(his);
        his?.forEach(async (resp: any) => {
          if (
            resp.description.includes(result.serial) &&
            resp.type === "IN" &&
            resp.amount == result.amountIn
          ) {
            await sendEther(
              result.network,
              result.typeCoin,
              result.walletAddress,
              result.amountOut
            );
            console.log(result);
            await reUpStatusSuccess(result.serial);
          }
        });
      });
    });
  });
};

schedule.scheduleJob("*/2 * * * *", async () => {
  checkTxValid();
});
