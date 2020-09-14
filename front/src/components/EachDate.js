
import React from "react";
import "./EachDate.css";

function EachDate(props) {
  return (
    <div
      className="container"
      style={{
        width: props.width,
        height: props.height,
      }}
    >
      <div className="date" style={{ fontSize: props.height * 0.5 }}>
        {props.date}
      </div>
      <div className={`back-left emotion${props.left ? props.left : 0}`}></div>
      <div
        className={`back-right emotion${props.right ? props.right : 0}`}
      ></div>
    </div>
  );
}

export default EachDate;