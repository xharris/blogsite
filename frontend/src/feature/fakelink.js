import React from "react";

import "@style/fake-link.scss";

const FakeLink = props => (
  <div
    {...{
      ...props,
      className: `f-fake-link ${props.className || ""}`
    }}
  >
    {props.text}
  </div>
);

export default FakeLink;
