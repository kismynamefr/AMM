import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import styled from "styled-components";
import Toast from "../Toast/Toast";

const DelayedLink = ({ delay, state, to, handleExcept }) => {
  const navigate = useNavigate();
  const timerRef = useRef();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const clickHandler = async (e) => {
    e.preventDefault();
    const idLoadingToast = await Toast(
      "loading",
      "Đang xử lý tạo giao dịch..."
    );
    await handleExcept();
    timerRef.current = setTimeout(async () => {
      await navigate(to);
      await Toast(
        "update success",
        "Tạo giao dịch đã hoàn thành",
        idLoadingToast
      );
    }, delay);
  };
  return (
    <Link className="delayLink" to={to} state={state} onClick={clickHandler}>
      <DelayLink>Tiếp Tục</DelayLink>
    </Link>
  );
};
const DelayLink = styled.div`
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
  .delayLink {
    text-decoration: none;
    color: inherit;
  }
`;
export default DelayedLink;
