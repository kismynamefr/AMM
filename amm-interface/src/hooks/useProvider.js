import Web3 from "web3";
import {
    Factory_Pancake_Abi, Factory_Pancake_Address
} from "../abi/Pancakeswap/FactoryPancake";
import { Pair_Pancake_Abi } from "../abi/Pancakeswap/PairPancake";
import {
    Router_Pancake_Abi,
    Router_Pancake_Address
} from "../abi/Pancakeswap/RouterPancake";
import { Factory, FactoryAddress } from "../abi/Uniswap/Factory";
import { Pair } from "../abi/Uniswap/Pair";
import { Router, RouterAddress } from "../abi/Uniswap/Router";

const useProvider = () => {
  const web3 = new Web3(process.env.REACT_APP_INFURA);
  const web3BSC = new Web3(process.env.REACT_APP_QUICKNODE_BSC);
  const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
  const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const BUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
  const USDT_BSC = "0x55d398326f99059fF775485246999027B3197955";
  const BNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";

  const Provider = async (type) => {
    let amountOutEth, amountOutDAI, amountOutBUSD, amountOutBNB;
    switch (type) {
      case "Ethereum":
        amountOutEth = await coinName("ETH");
        amountOutDAI = await coinName("DAI");
        return { amountOutEth, amountOutDAI };
      case "Binance":
        amountOutBUSD = await coinName("BUSD");
        amountOutBNB = await coinName("BNB");
        return { amountOutBUSD, amountOutBNB };
      default:
        break;
    }
  };
  const coinName = async (type) => {
    const factory = new web3.eth.Contract(Factory, FactoryAddress);
    const factoryPancake = new web3BSC.eth.Contract(
      Factory_Pancake_Abi,
      Factory_Pancake_Address
    );
    let pairAddress, router, pair, reserves, amountOut;
    switch (type) {
      case "ETH":
        pairAddress = await factory.methods.getPair(USDT, WETH).call();
        pair = new web3.eth.Contract(Pair, pairAddress);
        reserves = await pair.methods.getReserves().call();
        router = new web3.eth.Contract(Router, RouterAddress);
        amountOut = await router.methods
          .getAmountOut(
            `${1 * 10 ** 18}`,
            reserves._reserve0,
            reserves._reserve1
          )
          .call();
        return amountOut;
      case "DAI":
        pairAddress = await factory.methods.getPair(DAI, USDC).call();
        pair = new web3.eth.Contract(Pair, pairAddress);
        reserves = await pair.methods.getReserves().call();
        router = new web3.eth.Contract(Router, RouterAddress);
        amountOut = await router.methods
          .getAmountOut(`${1e18}`, reserves._reserve0, reserves._reserve1)
          .call();
        return amountOut;
      case "BUSD":
        pairAddress = await factoryPancake.methods
          .getPair(BUSD, USDT_BSC)
          .call();
        pair = new web3BSC.eth.Contract(Pair_Pancake_Abi, pairAddress);
        reserves = await pair.methods.getReserves().call();
        router = new web3BSC.eth.Contract(
          Router_Pancake_Abi,
          Router_Pancake_Address
        );
        amountOut = await router.methods
          .getAmountOut(`${1e6}`, reserves._reserve0, reserves._reserve1)
          .call();
        return amountOut;
      case "BNB":
        pairAddress = await factoryPancake.methods
          .getPair(BNB, USDT_BSC)
          .call();
        pair = new web3BSC.eth.Contract(Pair_Pancake_Abi, pairAddress);
        reserves = await pair.methods.getReserves().call();
        router = new web3BSC.eth.Contract(
          Router_Pancake_Abi,
          Router_Pancake_Address
        );
        amountOut = await router.methods
          .getAmountOut(`${1e6}`, reserves._reserve1, reserves._reserve0)
          .call();
        return amountOut;
      default:
        break;
    }
  };
  return { Provider };
};
export default useProvider;
