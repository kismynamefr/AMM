import React from "react";
import './CloseButton.css';

const CloseButton = ({handleClosed}) => {
  
  return (
    <div onClick={handleClosed} className="close-container">
      <div className="leftright"></div>
      <div className="rightleft"></div>
      <label className="close">close</label>
    </div>
  );
};



export default CloseButton;
