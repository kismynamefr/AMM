import { memo } from "react";
import styled from "styled-components";

const EyeClose = ({ handleShowPassword }) => {
  return (
    <EyeOpenContainer onClick={handleShowPassword}>
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
          <path d="M9.8 4.8c3 0 5.3 1.7 7 5-1.7 3.3-4 5-7 5s-5.3-1.7-7-5c1.6-3.4 4-5 7-5z"></path>
          <path d="M9.8 11.8a2 2 0 100-4 2 2 0 000 4z"></path>
        </g>
      </svg>
    </EyeOpenContainer>
  );
};

const EyeOpenContainer = styled.div`
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
