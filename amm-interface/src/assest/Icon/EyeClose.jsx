import styled from "styled-components";
import { memo } from "react";

const EyeClose = ({ handleShowPassword }) => {
  return (
    <EyeCloseContainer onClick={handleShowPassword}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
        width="20px"
        height="20px"
      >
        <g
          stroke="#161823"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          opacity="0.5"
        >
          <path d="M2.8 7.8c2.1 1 4.5 1.6 7 1.6s4.9-.6 7-1.6M9.8 9.8v3M5.1 9.2l-1.5 2.6M14.6 9.2l1.5 2.6"></path>
        </g>
      </svg>
    </EyeCloseContainer>
  );
};

const EyeCloseContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  height: 100%;
  cursor: pointer;
`;

export default memo(EyeClose);
