import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import Spinner from "../Spinner/Spinner";
import Tippy from '@tippyjs/react';

function Transaction() {
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const clearInt = setInterval(() => {
      setFailedTransaction(true);
    }, 5000);
    return () => clearInterval(clearInt);
  }, []);

  return (
    <Container>
      <Body>
        <h3>Đơn hàng X62CE96B6783DB</h3>
        <p>Tạo đơn lúc: 13/07/2022 16:56:06</p>
        <Table>
          <LeftTable>
            <h4>THÔNG TIN THANH TOÁN</h4>
            <TitleLeft>
              <h5>Số tài khoản:</h5>
            </TitleLeft>
            <BankOwner>
              <InputOwner
                aria-invalid="false"
                name="amountIn"
                readOnly
                value={19033754672011}
              />
              <span>Techcombank</span>
              <span>ĐINH XUÂN HÙNG</span>
            </BankOwner>
            <TitleLeft>
              <h5>Số tiền:</h5>
            </TitleLeft>
            <AmountOwner>
              <InputAmountOwner
                aria-invalid="false"
                name="amountIn"
                readOnly
                value={"3,923,972"}
              />
              <span>VND</span>
            </AmountOwner>
            <TransferContent>
              <p>Nội dung chuyển khoản: </p>
              <TransferContentButton>MBC X62CE96B6783DB</TransferContentButton>
            </TransferContent>
            <Status>
              <p>Trạng thái:</p>
              {failedTransaction ? (
                <StatusButtonFailed>ĐÃ HỦY</StatusButtonFailed>
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
                BẠN HÃY GỬI ĐÚNG ĐỊA CHỈ NHẬN THANH TOÁN VÀ SỐ TIỀN GHI TRÊN ĐƠN
                HÀNG! Thời gian bạn thực hiện chuyển khoản tối đa là 15 phút.
                Quá thời gian quy định hệ thống sẽ tự động hủy giao dịch.
              </TitleNoted>
            </Noted>
          </LeftTable>
          <RightTable>
            <h3>THÔNG TIN NHẬN THANH TOÁN</h3>
          </RightTable>
        </Table>
      </Body>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  max-width: 1056px;
  margin: 2% auto;
  height: 100%;
`;
const Body = styled.div`
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
const Table = styled.div`
  display: flex;
  width: 100%;
`;
const LeftTable = styled.div`
  display: flex;
  flex-flow: column;
  gap: 1rem;
  width: 50%;
  h4 {
    color: rgb(59 249 255);
  }
  padding: 0 2rem;
`;
const RightTable = styled.div`
  display: flex;
  width: 50%;
`;
const BankOwner = styled.div`
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
const InputOwner = styled.input`
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
const TitleLeft = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 2rem;
`;
const AmountOwner = styled.div`
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
const InputAmountOwner = styled.input`
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
const TransferContent = styled.div`
  display: flex;
  p {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
  }
`;
const TransferContentButton = styled.button`
  cursor: pointer;
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
  &:hover {
    background: rgb(37 155 159);
  }
`;
const Status = styled.div`
  display: flex;
  p {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
  }
`;
const StatusButton = styled.button`
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
const StatusButtonFailed = styled.button`
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
const Noted = styled.div``;
const TitleNoted = styled.div`
  color: #ff2d2d;
  display: flex;
  text-align: justify;
`;
export default memo(Transaction);
