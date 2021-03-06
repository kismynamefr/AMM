import Tippy from "@tippyjs/react";
import axios from "axios";
import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import "tippy.js/dist/tippy.css";
import BNB from "../../assest/Icon/BNB";
import Ethereum from "../../assest/token/Ethereum";
import Spinner from "../Spinner/Spinner";

function Transaction() {
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successTransaction, setSuccessTransaction] = useState(false);
  const [dataTransaction, setDataTransaction] = useState({});
  const serialId = window.location.href.substring(43, 53);

  const handleCopyText = (e) => {
    navigator.clipboard.writeText(e.target.value);
  };

  const handleAccount = (account) => {
    const splitAddress =
      account.substring(0, 6) + "..." + account.substring(38, 42);
    return splitAddress;
  };

  const handleTime = (unixTime) => {
    var date = new Date(unixTime * 1000);
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 101).toString().substring(1);
    let day = (date.getDate() + 100).toString().substring(1);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return (
      day +
      "/" +
      month +
      "/" +
      year +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  };

  const convertMainnet = (mainnet) => {
    switch (mainnet) {
      case "Ethereum":
        return (
          <StatusButton>
            <Ethereum width="25px" height="25px" />
            Ethereum
          </StatusButton>
        );
      case "Binance":
        return (
          <StatusButton>
            <BNB width="25px" height="25px" />
            Binance
          </StatusButton>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const clearInt = setInterval(() => {
      axios({
        method: "get",
        url: `http://localhost:5506/users/transaction/${serialId}`,
      }).then((data) => {
        if (data.data.result.status === "failed") {
          setFailedTransaction(true);
        } else if (data.data.result.status === "success") {
          setSuccessTransaction(true);
        } else if (data.data.result.status === "pending") {
          setIsLoading(true);
        }
        setDataTransaction(data.data);
      });
    }, 900000);
    return () => clearInterval(clearInt);
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5506/users/transaction/${serialId}`,
    }).then((data) => {
      console.log(data);
      if (data.data.status === "Error") {
        setDataTransaction({
          status: "Error",
        });
      } else {
        if (data.data.result.status === "failed") {
          console.log(data.data.result);
          setFailedTransaction(true);
        } else if (data.data.result.status === "success") {
          setSuccessTransaction(true);
        } else if (data.data.result.status === "pending") {
          setIsLoading(true);
        }
        setDataTransaction(data.data);
      }
    });
  }, []);

  return (
    <Container>
      <Body>
        {dataTransaction.status === "Error" ? (
          <h3>
            Kh??ng c?? ????n h??ng n??o ???????c t???o b???i m?? ????n h??ng n??y: {serialId}
          </h3>
        ) : dataTransaction.status === "Success" ? (
          <>
            <h3>????n h??ng {dataTransaction.result.serial}</h3>
            <p>T???o ????n l??c: {handleTime(dataTransaction.result.beginTime)}</p>
            <Table>
              <LeftTable>
                <h4>TH??NG TIN THANH TO??N</h4>
                <TitleLeft>
                  <h5>S??? t??i kho???n:</h5>
                </TitleLeft>
                <BankOwner>
                  <Tippy content="Copy S??? T??i Kho???n">
                    <InputOwner
                      aria-invalid="false"
                      name="amountIn"
                      readOnly
                      value={9362405511}
                      onClick={handleCopyText}
                    />
                  </Tippy>
                  <span>Vietcombank</span>
                  <span>??INH XU??N H??NG</span>
                </BankOwner>
                <TitleLeft>
                  <h5>S??? ti???n:</h5>
                </TitleLeft>
                <AmountOwner>
                  <InputAmountOwner
                    aria-invalid="false"
                    name="amountIn"
                    readOnly
                    value={dataTransaction.result.amountIn
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  />
                  <span>VND</span>
                </AmountOwner>
                <TransferContent>
                  <p>N???i dung chuy???n kho???n: </p>
                  <Tippy content="Copy N???i Dung">
                    <TransferContentButton
                      onClick={handleCopyText}
                      value={`MBC ${dataTransaction.result.serial}`}
                    >
                      MBC {dataTransaction.result.serial}
                    </TransferContentButton>
                  </Tippy>
                </TransferContent>
                <Status>
                  <p>Tr???ng th??i:</p>
                  {failedTransaction ? (
                    <StatusButtonFailed>???? H???Y</StatusButtonFailed>
                  ) : successTransaction ? (
                    <StatusButtonSuccess> TH??NH C??NG </StatusButtonSuccess>
                  ) : (
                    <StatusButton>
                      ??ANG X??? L??
                      <Spinner />
                    </StatusButton>
                  )}
                </Status>
                <Noted>
                  <p>L??u ??:</p>
                  <TitleNoted>
                    B???N H??Y G???I ????NG ?????A CH??? NH???N THANH TO??N V?? S??? TI???N GHI TR??N
                    ????N H??NG! Th???i gian b???n th???c hi???n chuy???n kho???n t???i ??a l?? 30
                    ph??t. Qu?? th???i gian quy ?????nh h??? th???ng s??? t??? ?????ng h???y giao
                    d???ch.
                  </TitleNoted>
                </Noted>
              </LeftTable>
              <RightTable>
                <h4>TH??NG TIN NH???N THANH TO??N</h4>
                <TransferContent>
                  <p>M???ng l?????i: </p>
                  {convertMainnet(dataTransaction.result.network)}
                </TransferContent>
                <TransferContent>
                  <p>?????a ch??? nh???n: </p>
                  <Tippy content="Copy ?????a Ch??? Nh???n">
                    <TransferContentButton
                      onClick={handleCopyText}
                      value={dataTransaction.result.walletAddress}
                    >
                      {handleAccount(dataTransaction.result.walletAddress)}
                    </TransferContentButton>
                  </Tippy>
                </TransferContent>
                <TransferContent>
                  <p>S??? Coin nh???n: </p>
                  <StatusButton style={{ background: "rgb(37 155 159)" }}>
                    {dataTransaction.result.amountOut}{" "}
                    {dataTransaction.result.typeCoin}
                  </StatusButton>
                </TransferContent>
                <Status>
                  <p>Tr???ng th??i:</p>
                  {failedTransaction ? (
                    <StatusButtonFailed>???? H???Y</StatusButtonFailed>
                  ) : successTransaction ? (
                    <StatusButtonSuccess> TH??NH C??NG </StatusButtonSuccess>
                  ) : (
                    <StatusButton>
                      ??ANG X??? L??
                      <Spinner />
                    </StatusButton>
                  )}
                </Status>
              </RightTable>
            </Table>
          </>
        ) : null}
      </Body>
    </Container>
  );
}
export const Container = styled.div`
  width: 100%;
  max-width: 1056px;
  margin: 2% auto;
  height: 100%;
`;
export const Body = styled.div`
  width: 100%;
  height: 100%;
  min-height: 75vh;
  padding: 2%;
  display: flex;
  flex-flow: column;
  gap: 10px;
  background: linear-gradient(
    123.64deg,
    rgba(255, 255, 255, 0) -22.38%,
    rgba(255, 255, 255, 0.039) 70.38%
  );
  backdrop-filter: blur(42px);
  border-radius: 10px;
  border: 2px solid #757575;
  transition: all 0.5s ease-out;
`;
export const Table = styled.div`
  display: flex;
  width: 100%;
`;
export const LeftTable = styled.div`
  display: flex;
  flex-flow: column;
  gap: 1rem;
  width: 50%;
  padding: 0 2rem;
  position: relative;
  &::after {
    content: "";
    width: 1px;
    height: 100%;
    background-color: rgb(27 158 161);
    right: 0;
    left: unset;
    position: absolute;
  }
  h4 {
    color: rgb(59 249 255);
  }
`;
export const RightTable = styled.div`
  display: flex;
  flex-flow: column;
  gap: 1rem;
  width: 50%;
  h4 {
    color: rgb(59 249 255);
  }
  padding: 0 2rem;
`;
export const BankOwner = styled.div`
  display: flex;
  background: rgb(37 155 159);
  border-radius: 5px;
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
export const InputOwner = styled.input`
  padding-left: 10px;
  background-color: transparent;
  border: none;
  color: #444444;
  outline: none;
  width: 100%;
  font-size: 14px;
  line-height: 26px;
  min-height: 26px;
  cursor: pointer;
  transition: all 0.5s ease-out;
  &:hover {
    color: white;
  }
`;
export const TitleLeft = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 2rem;
`;
export const AmountOwner = styled.div`
  display: flex;
  background: rgb(37 155 159);
  border-radius: 5px;
  span {
    position: relative;
    display: flex;
    justify-content: center;
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
export const InputAmountOwner = styled.input`
  padding-left: 10px;
  background-color: transparent;
  border: none;
  color: inherit;
  outline: none;
  width: 100%;
  font-size: 14px;
  line-height: 26px;
  min-height: 26px;
`;
export const TransferContent = styled.div`
  display: flex;
  p {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
  }
`;
export const TransferContentButton = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  border: 2px solid rgb(37 155 159);
  background: transparent;
  color: white;
  padding: 20px 20px;
  height: 40px;
  font-size: 14px;
  position: relative;
  transition: all 0.5s ease-out;
  gap: 10px;
  &:hover {
    background: rgb(37 155 159);
  }
`;
export const Status = styled.div`
  display: flex;
  p {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
  }
`;
export const StatusButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  border: 2px solid rgb(37 155 159);
  background: transparent;
  color: white;
  padding: 20px 20px;
  height: 40px;
  font-size: 14px;
  position: relative;
  transition: all 0.5s ease-out;
  gap: 10px;
`;
export const StatusButtonFailed = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  border: 2px solid #d42727cf;
  background: #d42727cf;
  color: white;
  padding: 20px 20px;
  height: 40px;
  font-size: 14px;
  position: relative;
  transition: all 0.5s ease-out;
  gap: 10px;
`;
export const StatusButtonSuccess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  border: 2px solid #14e01bcf;
  background: #14e01bcf;
  color: white;
  padding: 20px 20px;
  height: 40px;
  font-size: 14px;
  position: relative;
  transition: all 0.5s ease-out;
  gap: 10px;
`;
export const Noted = styled.div``;
export const TitleNoted = styled.div`
  color: #ff2d2d;
  display: flex;
  text-align: justify;
`;
export default memo(Transaction);
