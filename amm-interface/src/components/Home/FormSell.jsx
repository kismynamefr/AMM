import axios from "axios";
import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import ArrowDown from "../../assest/Icon/ArrowDown";
import ArrowUp from "../../assest/Icon/ArrowUp";
import BNB from "../../assest/Icon/BNB";
import Ethereum from "../../assest/token/Ethereum";
import useDebounce from "../../hooks/useDebounce";
import Spinner from "../Spinner/Spinner";
import Toast from "../Toast/Toast";
import { TitleRightSide } from "./Home";
import { Bank } from "./JSONBank";

const FormSell = ({ coinName }) => {
  const { type, amount, network } = coinName;
  const [openNetworks, setOpenNetworks] = useState(false);
  const [openBanks, setOpenBanks] = useState(false);
  const [serialTransaction, setSerialTransaction] = useState();
  const [formValue, setFormValue] = useState({
    amountIn: "0",
    nameBank: "",
    ownerBank: "",
    txHash: "",
    accountNumber: "",
    condition: "Sell",
    network: !network ? "Ethereum" : network,
    typeCoin: type,
    amountOut: "0",
  });
  console.log(formValue);
  console.log(serialTransaction);
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

  const OpenChooseBank = () => {
    return !openBanks ? setOpenBanks(true) : setOpenBanks(false);
  };

  const test = () => {
    setFormError(validate(debounced));
  };

  const validate = (values) => {
    let errors = {};
    const regexName = /^(?=.*?[0-9])(?=.*?[#?!@$%^&*-])$/;
    if (values.amountIn == "0") {
      errors.amountIn = "Cannot be a Zero";
      Toast("error", "Số lượng không được bằng 0");
    } else if (values.amountIn < 0.005) {
      errors.amountIn = "Cannot be smaller 0.005";
      Toast("error", "Tối thiểu: 0.005");
    }
    if (values.ownerBank?.length < 9) {
      errors.ownerBank = "Cannot be smaller 9 character";
      Toast("error", "Tên chủ tài khoản tối thiểu 9 ký tự");
    } else if (regexName.test(values.ownerBank)) {
      errors.ownerBank = "Invalid owner format";
      Toast("error", "Sai định dạng chủ tài khoản");
    }
    if (values.accountNumber?.length < 9) {
      errors.accountNumber = "Cannot be smaller 9 character";
      Toast("error", "Số tài khoản tối thiểu 9 ký tự");
    }
    if (values.nameBank?.length == "0") {
      errors.nameBank = "Cannot be blank";
      Toast("error", "Vui lòng chọn loại ngân hàng");
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

  const handleExcept = () => {
    const beginTime = Math.floor(new Date().getTime() / 1000);
    const lastestTime = beginTime + 30 * 60;
    setIsSpinner(true);
    const idLoading = Toast("loading", "Đang xử lý tạo giao dịch...");
    axios({
      method: "post",
      url: "http://localhost:5506/users",
      data: {
        ...debounced,
        amountOut: (debounced.amountIn * amount).toFixed(0),
        serial: serialTransaction,
        condition: "Sell",
        status: "pending",
        beginTime: beginTime,
        lastestTime: lastestTime,
      },
    }).then((data) => {
      console.log(data.data.status);
      if (data.data.status === "Success") {
        Toast("update success", "Tạo giao dịch thành công...", idLoading);
        setTimeout(() => {
          window.location.href = `http://localhost:3000/Exchange/TransactionHash/${serialTransaction}`;
        }, 5000);
      }
    });
  };

  const handleCheckBank = () => {
    const result = Bank.filter((value) => value.name === formValue.nameBank);
    return result.length > 0 ? (
      result.map((value, index) => (
        <>
          <Avatars src={value.urlIcon} />
          <InputNetwork
            aria-invalid="false"
            name="nameBank"
            readOnly
            aria-haspopup="true"
            value={value.name}
          />
        </>
      ))
    ) : (
      <p>Chọn loại ngân hàng</p>
    );
  };

  useEffect(() => {
    if (
      debounced.accountNumber.length > 0 &&
      debounced.ownerBank.length > 0 &&
      debounced.amountIn > 0
    ) {
      test();
    }
  }, [debounced]);

  useEffect(() => {
    const serial = makeRandomSerials(10);
    setSerialTransaction(serial);
    setFormValue({
      amountIn: "0",
      nameBank: "",
      ownerBank: "",
      txHash: "",
      accountNumber: "",
      condition: "Sell",
      network: !network ? "Ethereum" : network,
      typeCoin: type,
      amountOut: "0",
    });
    setOpenNetworks(false);
  }, [type]);

  return (
    <>
      <TitleRightSide>
        <h4>Số lượng {type} cần bán:</h4>
      </TitleRightSide>
      <AmountIn>
        <input
          type="number"
          name="amountIn"
          onChange={handleForm}
          min="0.005"
          value={formValue.amountIn}
        />
        <span>{type}</span>
      </AmountIn>
      <TitleRightSide>
        <h4>Chọn loại {type} cần bán (Blockchain):</h4>
      </TitleRightSide>
      <HalveButton>
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
        <ChooseNetwork onClick={OpenChooseBank}>
          {handleCheckBank()}
          <IconInput>{openNetworks ? <ArrowUp /> : <ArrowDown />}</IconInput>
          {openBanks ? (
            <OptionNetwork>
              {Bank.map((value, index) => (
                <ValueOption key={index}>
                  <Avatars src={value.urlIcon} />
                  <InputNetwork
                    aria-invalid="false"
                    name="nameBank"
                    readOnly
                    aria-haspopup="true"
                    value={value.name}
                    onClick={handleForm}
                  />
                </ValueOption>
              ))}
            </OptionNetwork>
          ) : null}
        </ChooseNetwork>
      </HalveButton>
      <TitleRightSide>
        <h4>Số tiền bạn nhận được:</h4>
      </TitleRightSide>
      <AmountOut>
        <InputAmountOut
          aria-invalid="false"
          name="amountOut"
          readOnly
          value={
            debounced.amountIn !== 0 && debounced.amountIn < 0.005
              ? "NaN"
              : (debounced.amountIn * amount)
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        />
        <span>VND</span>
      </AmountOut>
      <TitleRightSide>
        <h4>Tên chủ tài khoản nhận tiền:</h4>
      </TitleRightSide>
      <AmountIn>
        <input
          type="text"
          name="ownerBank"
          onChange={handleForm}
          maxLength="25"
          style={{ textTransform: "uppercase" }}
          value={formValue.ownerBank}
        />
      </AmountIn>
      <TitleRightSide>
        <h4>Số tài khoản:</h4>
      </TitleRightSide>
      <AmountIn>
        <input
          type="text"
          name="accountNumber"
          onChange={handleForm}
          maxLength="19"
          value={formValue.accountNumber}
        />
      </AmountIn>
      {formError.length != 0 &&
      formValue.amountIn >= "0.005" &&
      formValue.ownerBank?.length >= 9 &&
      formValue.accountNumber?.length >= 9 ? (
        isSpinner ? (
          <ButtonContinues>
            <Spinner />
          </ButtonContinues>
        ) : (
          <ButtonContinue onClick={handleExcept}>Tiếp Tục</ButtonContinue>
        )
      ) : (
        <ButtonContinues>Tiếp Tục</ButtonContinues>
      )}
    </>
  );
};

export const Avatars = styled.img`
  width: 30px;
  height: 30px;
  transition: all 0.5s ease-out;
  object-fit: cover;
  @media only screen and (max-width: 1700px) {
    width: 30px;
    height: 30px;
  }
`;
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
const HalveButton = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
`;
export const ChooseNetwork = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
const ValueOption = styled.li`
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
const ButtonContinue = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 2px solid rgb(37 155 159);
  width: 100%;
  height: 40px;
  font-size: 14px;
  padding: 20px 10px;
  color: #cfcfcf;
  background: rgb(31 101 104);
  transition: all 0.5s ease-in-out 0s;
  &:hover {
    color: white;
    background: rgb(31 101 104);
    background: rgb(37 155 159);
  }
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

export default memo(FormSell);
