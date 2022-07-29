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
      Toast("error", "Sai định dạng Transaction Hash");
    } else {
      Toast("success", "Đúng định dạng Transaction Hash");
    }
    return errors;
  };
  const handleTxHash = (e) => {
    setTxHash(e.target.value);
  };
  const handleSendTxHash = () => {
    const idLoading = Toast("loading", "Giao dịch đang được thực hiện");
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
        Toast("update reject", "Giao dịch bị hủy bỏ", idLoading);
      } else if (data.data?.status === "Success") {
        Toast("update success", "Đã nhận tiền thành công", idLoading);
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
            Không có đơn hàng nào được tạo bởi mã đơn hàng này: {serialId}
          </h3>
        ) : dataTransaction.status === "Success" ? (
          <>
            <h3>Đơn hàng {dataTransaction.result.serial}</h3>
            <p>Tạo đơn lúc: {handleTime(dataTransaction.result.beginTime)}</p>
            <Table>
              <LeftTable>
                <h4>THÔNG TIN NHẬN THANH TOÁN</h4>
                <TitleLeft>
                  <h5>Số tài khoản:</h5>
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
                  <h5>Số tiền được nhận:</h5>
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
                  <p>Nội dung nhận chuyển khoản: </p>
                  <TransferContentButton onClick={handleCopyText}>
                    MBC THANH TOAN
                  </TransferContentButton>
                </TransferContent>
                <Status>
                  <p>Trạng thái:</p>
                  {failedTransaction ? (
                    <StatusButtonFailed>ĐÃ HỦY</StatusButtonFailed>
                  ) : successTransaction ? (
                    <StatusButtonSuccess> THÀNH CÔNG </StatusButtonSuccess>
                  ) : (
                    <StatusButton>
                      ĐANG XỬ LÝ
                      <Spinner />
                    </StatusButton>
                  )}
                </Status>
                <Noted>
                  <p>Lưu ý:</p>
                  <TitleNoted>
                    BẠN HÃY GỬI VÀO ĐÚNG ĐỊA CHỈ VÍ VÀ SỐ COIN GHI TRÊN ĐƠN
                    HÀNG! COPY ĐỊA CHỈ TRANSACTION HASH 1 CÁCH CHÍNH XÁC VÌ CHỈ
                    NHẬP ĐƯỢC 1 LẦN! Thời gian bạn thực hiện chuyển khoản tối đa
                    là 30 phút. Quá thời gian quy định hệ thống sẽ tự động hủy
                    giao dịch.
                  </TitleNoted>
                </Noted>
              </LeftTable>
              <RightTable>
                <h4>THÔNG TIN ĐÃ ĐƯỢC THANH TOÁN</h4>
                <TransferContent>
                  <p>Mạng lưới: </p>
                  {convertMainnet(dataTransaction.result.network)}
                </TransferContent>
                <TransferContent>
                  <p>Địa chỉ nhận: </p>
                  <Tippy content="Copy Địa Chỉ Nhận">
                    <TransferContentButton
                      onClick={handleCopyText}
                      value={process.env.REACT_APP_DEFAULT_ACCOUNT}
                    >
                      {handleAccount(process.env.REACT_APP_DEFAULT_ACCOUNT)}
                    </TransferContentButton>
                  </Tippy>
                </TransferContent>
                <TransferContent>
                  <p>Số Coin nhận: </p>
                  <StatusButton style={{ background: "rgb(37 155 159)" }}>
                    {dataTransaction.result.amountIn}{" "}
                    {dataTransaction.result.typeCoin}
                  </StatusButton>
                </TransferContent>
                <TransactionHashInput>
                  <p>Transaction Hash: </p>
                  <TXInput
                    id="inputTxhash"
                    placeholder="Nhập Transaction Hash"
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
                  <p>Trạng thái:</p>
                  {failedTransaction ? (
                    <StatusButtonFailed>ĐÃ HỦY</StatusButtonFailed>
                  ) : successSendTxHash ? (
                    <StatusButtonSuccess> THÀNH CÔNG </StatusButtonSuccess>
                  ) : (
                    <StatusButton>
                      ĐANG XỬ LÝ
                      <Spinner />
                    </StatusButton>
                  )}
                </Status>
                {failedTxHash ? null : formError.length !== 0 &&
                  txHash.length === 66 ? (
                  <TransferContentButton onClick={handleSendTxHash}>
                    Gửi Transaction Hash
                  </TransferContentButton>
                ) : (
                  <SendTrxButton>Hãy điền Transaction Hash</SendTrxButton>
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
