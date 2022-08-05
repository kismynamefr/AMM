import React from "react";
import styled from "styled-components";

const Error = ({ width, height }) => {
  return (
    <ErrorContainer>
      <svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="rgba(254, 44, 85, 1.0)"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.5522 6.91656C22.0988 4.28733 25.9011 4.28734 27.4477 6.91656L43.9509 34.9719C45.5194 37.6385 43.5968 41 40.5031 41H7.49679C4.40313 41 2.48051 37.6385 4.04906 34.9719L20.5522 6.91656ZM24 8.94464L7.49679 37H40.5031L24 8.94464ZM22 18C22 17.4477 22.4477 17 23 17H25C25.5522 17 26 17.4477 26 18V27C26 27.5523 25.5522 28 25 28H23C22.4477 28 22 27.5523 22 27V18ZM24 35C25.3807 35 26.5 33.8807 26.5 32.5C26.5 31.1193 25.3807 30 24 30C22.6192 30 21.5 31.1193 21.5 32.5C21.5 33.8807 22.6192 35 24 35Z"
        ></path>
      </svg>
    </ErrorContainer>
  );
};
const ErrorContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  height: 100%;
`;

export default Error;
