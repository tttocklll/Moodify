import React from "react";



const ErrorMessage = (props) => {
  const { message } = props
  if (message === null || message === "") {
    return null;
  }
  return <p style={{ color: "red" }}>{message}</p>;
};

export default ErrorMessage;
