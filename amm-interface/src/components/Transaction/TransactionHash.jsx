import Tippy from "@tippyjs/react";
import axios from "axios";
import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import "tippy.js/dist/tippy.css";
import BNB from "../../assest/Icon/BNB";
import Ethereum from "../../assest/token/Ethereum";
import Spinner from "../Spinner/Spinner";
import {
  StatusButton,
  Container,
  Body,
  Table,
  RightTable,
  TransferContent,
  TransferContentButton,
  Status,
  StatusButtonFailed,
  StatusButtonSuccess,
  LeftTable,
  BankOwner,
  InputOwner,
  TitleLeft,
  AmountOwner,
  InputAmountOwner,
  Noted,
  TitleNoted,
} from "./Transaction";
import Toast from "../Toast/Toast";

function Transaction() {
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successTransaction, setSuccessTransaction] = useState(false);
  const [successSendTxHash, setSuccessSendTxHash] = useState(false);
  const [dataTransaction, setDataTransaction] = useState({});
  const [txHash, setTxHash] = useState("");
  const [formError, setFormError] = useState({});
  const [failedTxHash, setFailedTxHash] = useState(false);
  const serialId = window.location.href.substring(
    window.location.href.length - 10
  );

  console.log(formError);

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
  const test = () => {
    setFormError(validate(txHash));
  };

  const validate = (values) => {
    let errors = {};
    const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{66,}$/;
    if (!regex.test(values)) {
      errors.transactionHash = "Invalid transaction hash format";
      Toast("error", "Sai ?????nh d???ng Transaction Hash");
    } else {
      Toast("success", "????ng ?????nh d???ng Transaction Hash");
    }
    return errors;
  };
  const handleTxHash = (e) => {
    setTxHash(e.target.value);
  };
  const handleSendTxHash = () => {
    const idLoading = Toast("loading", "Giao d???ch ??ang ???????c th???c hi???n");
    document.getElementById("inputTxhash").readOnly = true;
    document.getElementById("inputTxhash").value = txHash;
    setFailedTxHash(true);
    axios({
      method: "post",
      url: `http://localhost:5506/users/transactionHash/sendTrx`,
      data: {
        serial: serialId,
        txHash: txHash,
      },
    }).then((data) => {
      if (data.data?.status === "Error") {
        setFailedTransaction(true);
        Toast("update reject", "Giao d???ch b??? h???y b???", idLoading);
      } else if (data.data?.status === "Success") {
        Toast("update success", "???? nh???n ti???n th??nh c??ng", idLoading);
        setSuccessSendTxHash(true);
      }
    });
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5506/users/transactionHash/${serialId}`,
    }).then((data) => {
      console.log(data);
      if (data.data.status === "Error") {
        setDataTransaction({
          status: "Error",
        });
      } else {
        if (data.data.result.status === "failed") {
          console.log(data.data?.result);
          setFailedTransaction(true);
          setFailedTxHash(true);
        } else if (data.data?.result.status === "success") {
          setSuccessTransaction(true);
        } else if (data.data?.result.status === "pending") {
          if (data.data?.result.txHash.length > 0) {
            setSuccessSendTxHash(true);
            setFailedTxHash(true);
          } else {
            setIsLoading(true);
          }
        }
        setDataTransaction(data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (txHash.length > 0) {
      test();
    }
  }, [txHash]);

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
                <h4>TH??NG TIN NH???N THANH TO??N</h4>
                <TitleLeft>
                  <h5>S??? t??i kho???n:</h5>
                </TitleLeft>
                <BankOwner>
                  <InputOwner
                    aria-invalid="false"
                    name="amountIn"
                    readOnly
                    value={dataTransaction.result.accountNumber}
                    style={{ color: "white", cursor: "unset" }}
                  />
                  <span>{dataTransaction.result.nameBank}</span>
                  <span>{dataTransaction.result.ownerBank}</span>
                </BankOwner>
                <TitleLeft>
                  <h5>S??? ti???n ???????c nh???n:</h5>
                </TitleLeft>
                <AmountOwner>
                  <InputAmountOwner
                    aria-invalid="false"
                    name="amountIn"
                    readOnly
                    value={dataTransaction.result.amountOut
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  />
                  <span>VND</span>
                </AmountOwner>
                <TransferContent>
                  <p>N???i dung nh???n chuy???n kho???n: </p>
                  <TransferContentButton onClick={handleCopyText}>
                    MBC THANH TOAN
                  </TransferContentButton>
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
                    B???N H??Y G???I V??O ????NG ?????A CH??? V?? V?? S??? COIN GHI TR??N ????N
                    H??NG! COPY ?????A CH??? TRANSACTION HASH 1 C??CH CH??NH X??C V?? CH???
                    NH???P ???????C 1 L???N! Th???i gian b???n th???c hi???n chuy???n kho???n t???i ??a
                    l?? 30 ph??t. Qu?? th???i gian quy ?????nh h??? th???ng s??? t??? ?????ng h???y
                    giao d???ch.
                  </TitleNoted>
                </Noted>
              </LeftTable>
              <RightTable>
                <h4>TH??NG TIN ???? ???????C THANH TO??N</h4>
                <TransferContent>
                  <p>M???ng l?????i: </p>
                  {convertMainnet(dataTransaction.result.network)}
                </TransferContent>
                <TransferContent>
                  <p>?????a ch??? nh???n: </p>
                  <Tippy content="Copy ?????a Ch??? Nh???n">
                    <TransferContentButton
                      onClick={handleCopyText}
                      value={process.env.REACT_APP_DEFAULT_ACCOUNT}
                    >
                      {handleAccount(process.env.REACT_APP_DEFAULT_ACCOUNT)}
                    </TransferContentButton>
                  </Tippy>
                </TransferContent>
                <TransferContent>
                  <p>S??? Coin nh???n: </p>
                  <StatusButton style={{ background: "rgb(37 155 159)" }}>
                    {dataTransaction.result.amountIn}{" "}
                    {dataTransaction.result.typeCoin}
                  </StatusButton>
                </TransferContent>
                <TransactionHashInput>
                  <p>Transaction Hash: </p>
                  <TXInput
                    id="inputTxhash"
                    placeholder="Nh???p Transaction Hash"
                    bgCol={
                      successSendTxHash || failedTransaction
                        ? "rgb(37, 155, 159)"
                        : "white"
                    }
                    txCol={
                      successSendTxHash || failedTransaction ? "white" : "black"
                    }
                    onChange={handleTxHash}
                    value={
                      successSendTxHash || failedTransaction
                        ? dataTransaction.result.txHash
                        : undefined
                    }
                  />
                </TransactionHashInput>
                <Status>
                  <p>Tr???ng th??i:</p>
                  {failedTransaction ? (
                    <StatusButtonFailed>???? H???Y</StatusButtonFailed>
                  ) : successSendTxHash ? (
                    <StatusButtonSuccess> TH??NH C??NG </StatusButtonSuccess>
                  ) : (
                    <StatusButton>
                      ??ANG X??? L??
                      <Spinner />
                    </StatusButton>
                  )}
                </Status>
                {failedTxHash ? null : formError.length !== 0 &&
                  txHash.length === 66 ? (
                  <TransferContentButton onClick={handleSendTxHash}>
                    G???i Transaction Hash
                  </TransferContentButton>
                ) : (
                  <SendTrxButton>H??y ??i???n Transaction Hash</SendTrxButton>
                )}
              </RightTable>
            </Table>
          </>
        ) : null}
      </Body>
    </Container>
  );
}

const TransactionHashInput = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TXInput = styled.input`
  display: flex;
  height: 40px;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  border: 2px solid rgb(37 155 159);
  padding: 20px;
  position: relative;
  max-width: 232px;
  background: ${(props) => props.bgCol};
  color: ${(props) => props.txCol};
  p {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
  }
  &:focus {
    outline: none;
  }
`;
const SendTrxButton = styled.div`
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
export default memo(Transaction);
