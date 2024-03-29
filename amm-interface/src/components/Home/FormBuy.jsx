import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ArrowDown from "../../assest/Icon/ArrowDown";
import ArrowUp from "../../assest/Icon/ArrowUp";
import BNB from "../../assest/Icon/BNB";
import Ethereum from "../../assest/token/Ethereum";
import createAxiosJWT from "../../hooks/axiosJWT";
import useDebounce from "../../hooks/useDebounce";
import { sendTx } from "../../redux/apiRequest/apiRequest";
import { loginSuccess } from "../../redux/slice/authSlice";
import DelayedLink from "../DelayLink/DelayLink";
import Spinner from "../Spinner/Spinner";
import Toast from "../Toast/Toast";
import { TitleRightSide } from "./Home";

const FormBuy = ({ coinName }) => {
  const { type, amount, network } = coinName;
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const [openNetworks, setOpenNetworks] = useState(false);
  const [serialTransaction, setSerialTransaction] = useState();
  const [formValue, setFormValue] = useState({
    amountOut: "0",
    network: !network ? "Ethereum" : network,
    typeCoin: type,
    condition: "Buy",
    walletAddress: "",
    amountIn: "0",
  });
  const [formError, setFormError] = useState({});
  const [isSpinner, setIsSpinner] = useState(false);
  const debounced = useDebounce(formValue, 500);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...debounced, [name]: value });
  };

  const OpenChooseNetwork = () => {
    return !openNetworks ? setOpenNetworks(true) : setOpenNetworks(false);
  };

  const test = () => {
    setFormError(validate(debounced));
  };

  const validate = (values) => {
    let errors = {};
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{42,}$/;
    if (values.amountOut == "0") {
      errors.amountOut = "Cannot be a Zero";
      Toast("error", "Số dư không được bằng 0");
    } else if (values.amountOut < 0.005) {
      errors.amountOut = "Cannot be smaller 0.005";
      Toast("error", "Tối thiểu: 0.005");
    }
    if (!values.walletAddress) {
      errors.walletAddress = "Cannot be blank";
    } else if (!regex.test(values.walletAddress)) {
      errors.walletAddress = "Invalid wallet address format";
      Toast("error", "Sai định dạng địa chỉ ví");
    } else {
      Toast("success", "Đúng định dạng địa chỉ ví");
    }
    return errors;
  };

  function makeRandomSerials(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleExcept = async () => {
    try {
      const beginTime = Math.floor(new Date().getTime() / 1000);
      const lastestTime = beginTime + 30 * 60;
      setIsSpinner(true);
      sendTx(
        {
          ...debounced,
          amountIn: (debounced.amountOut * amount).toFixed(0),
          serial: serialTransaction,
          status: "pending",
          condition: "Buy",
          beginTime: beginTime,
          lastestTime: lastestTime,
        },
        user.accessToken,
        dispatch,
        createAxiosJWT(user, dispatch, loginSuccess)
      );
      return true;
    } catch (error) {
      return false;
    }

  };

  useEffect(() => {
    if (debounced.walletAddress != "0" && debounced.walletAddress.length >= 1) {
      test();
    }
  }, [debounced]);

  useEffect(() => {
    const serial = makeRandomSerials(10);
    setSerialTransaction(serial);
    setFormValue({
      amountOut: "0",
      network: !network ? "Ethereum" : network,
      typeCoin: type,
      condition: "Buy",
      walletAddress: "",
      amountIn: "0",
    });
    setOpenNetworks(false);
  }, [type]);

  return (
    <>
      <TitleRightSide>
        <h4>Số tiền {type} cần mua:</h4>
      </TitleRightSide>
      <AmountIn>
        <input
          type="number"
          name="amountOut"
          onChange={handleForm}
          min="0.005"
          value={formValue.amountOut}
        />
        <span>{type}</span>
      </AmountIn>
      <TitleRightSide>
        <h4>Chọn loại {type} cần mua (Blockchain):</h4>
      </TitleRightSide>
      <ChooseNetwork onClick={OpenChooseNetwork}>
        {formValue.network && formValue.network === "Binance" ? (
          <>
            <BNB width="25px" height="25px" />
            <InputNetwork
              aria-invalid="false"
              name="network"
              readOnly
              aria-haspopup="true"
              value="Binance"
              onClick={handleForm}
            />
          </>
        ) : (
          <>
            <Ethereum width="25px" height="25px" />
            <InputNetwork
              aria-invalid="false"
              name="network"
              readOnly
              aria-haspopup="true"
              value="Ethereum"
            />
          </>
        )}
        <IconInput>{openNetworks ? <ArrowUp /> : <ArrowDown />}</IconInput>
        {openNetworks && !network ? (
          <OptionNetwork>
            <ValueOption>
              <Ethereum width="25px" height="25px" />
              <InputNetwork
                aria-invalid="false"
                name="network"
                readOnly
                aria-haspopup="true"
                value="Ethereum"
                onClick={handleForm}
              />
            </ValueOption>
            <ValueOption>
              <BNB width="25px" height="25px" />
              <InputNetwork
                aria-invalid="false"
                name="network"
                readOnly
                aria-haspopup="true"
                value="Binance"
                onClick={handleForm}
              />
            </ValueOption>
          </OptionNetwork>
        ) : null}
      </ChooseNetwork>
      <TitleRightSide>
        <h4>Số tiền bạn cần thanh toán:</h4>
      </TitleRightSide>
      <AmountOut>
        <InputAmountOut
          aria-invalid="false"
          name="amountIn"
          readOnly
          value={
            debounced.amountOut != 0 && debounced.amountOut < 0.005
              ? "NaN"
              : (debounced.amountOut * amount)
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        />
        <span>VND</span>
      </AmountOut>
      <TitleRightSide>
        <h4>
          Địa chỉ ví {type}{" "}
          {!formValue.network ? "Ethereum" : formValue.network} nhận tiền:
        </h4>
      </TitleRightSide>
      <AmountIn>
        <input
          type="text"
          name="walletAddress"
          onChange={handleForm}
          maxLength="42"
        />
        <span>0x...</span>
      </AmountIn>
      {user ? (
        formError.length != 0 &&
          formValue.amountOut >= "0.005" &&
          formValue.walletAddress.length === 42 ? (
          isSpinner ? (
            <ButtonContinues>
              <Spinner />
            </ButtonContinues>
          ) : (
            <DelayedLink
              delay={5000}
              to={`/Exchange/Transaction/${serialTransaction}`}
              state={serialTransaction}
              handleExcept={handleExcept}
              setIsSpinner={setIsSpinner}
            />
          )
        ) : (
          <ButtonContinues>Tiếp Tục</ButtonContinues>
        )
      ) : (
        <ButtonContinues>Bạn phải đăng nhập để tiếp tục</ButtonContinues>
      )}
    </>
  );
};
const AmountIn = styled.div`
  display: flex;
  input {
    width: 100%;
    padding: 5px 10px;
    border-start-start-radius: 5px;
    border-bottom-left-radius: 5px;
    background-color: #fff;
    border: 1px solid #ccc;
    line-height: 25px;
    &:focus-visible {
      outline: none;
    }
  }
  span {
    display: table-cell;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0 15px;
    line-height: 35px;
    border-left: 0;
    background: rgb(37 155 159);
    font-weight: bold;
    font-size: 11px;
    color: white;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;
const AmountOut = styled.div`
  display: flex;
  background: rgb(37 155 159);
  border-radius: 5px;
  cursor: not-allowed;
  span {
    position: relative;
    display: table-cell;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0 15px;
    line-height: 35px;
    border-left: 0;
    background: rgb(37 155 159);
    font-weight: bold;
    font-size: 11px;
    color: white;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    &:after {
      content: "";
      width: 1px;
      height: 24px;
      background: rgb(0 0 0 / 12%);
      left: 0;
      right: unset;
      position: absolute;
      margin: 5px 0px;
    }
  }
`;
export const ChooseNetwork = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 2px solid rgb(37 155 159);
  width: 100%;
  padding: 20px 10px;
  height: 40px;
  font-size: 14px;
  position: relative;
`;
export const InputNetwork = styled.input`
  padding-left: 10px;
  background-color: transparent;
  border: none;
  color: inherit;
  outline: none;
  width: 100%;
  font-size: 16px;
  line-height: 26px;
  min-height: 26px;
  cursor: pointer;
  &:focus:not(:focus-visible) {
    cursor: pointer;
  }
`;
export const IconInput = styled.div``;
export const OptionNetwork = styled.ul`
  display: flex;
  flex-flow: column;
  background: rgb(37 155 159);
  border: 1px solid rgb(37 155 159);
  border-radius: 5px;
  margin: 0px;
  padding-left: 0px;
  list-style-type: none;
  position: absolute;
  bottom: 0;
  z-index: 9;
  inset: 0px 0px auto 0px;
  transform: translate3d(0, 44px, 0px);
`;
export const ValueOption = styled.li`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid rgb(23 218 204);
  transition: all 0.5s ease-out;
  &:hover {
    background-color: rgb(26 126 128 / 78%);
  }
`;
const InputAmountOut = styled.input`
  padding-left: 10px;
  background-color: transparent;
  border: none;
  color: inherit;
  outline: none;
  width: 100%;
  font-size: 14px;
  line-height: 26px;
  min-height: 26px;
  cursor: not-allowed;
`;
const ButtonContinues = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 2px solid rgb(37 155 159);
  width: 100%;
  height: 40px;
  font-size: 14px;
  padding: 20px 10px;
  cursor: not-allowed;
`;

export default memo(FormBuy);
