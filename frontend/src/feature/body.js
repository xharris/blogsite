import React from "react";
import "@style/body.scss";

const Body = props => (
  <div
    className={`f-body ${props.className || ""} ${
      props.noHeader ? "no-header" : ""
    }`}
  >
    {props.children}
  </div>
);

export default Body;
