import React from "react";
import { withRouter } from "react-router-dom";

import styled from "styled-components";
import { darken } from "polished";
import "@style/button.scss";

const S = {
  Button: styled.button`
    // background-color: ${props => props.color};
    border-color: ${props => darken(0.2, props.color)};
    color: ${props => darken(0.2, props.color)};

    &:hover {
      background-color: ${props => darken(0.1, props.color)};
      border-color: ${props => darken(0.1, props.color)};
      color: #f5f5f5;
    }

    &:active {
      background-color: ${props => darken(0.2, props.color)};
      border-color: ${props => darken(0.2, props.color)};
    }
  `
};

const Button = props => (
  <S.Button
    type="button"
    {...props}
    className={`f-button ${
      props.children ? "" : "no-btn-children"
    } ${props.className || ""}`}
    onClick={e => {
      if (props.to) props.history.push(props.to);
      else if (props.onClick) props.onClick(e);
    }}
  >
    {props.icon
      ? [
          <i key="icon" className={`material-icons ${props.icon}`} />,
          props.children && <span key="children">{props.children}</span>
        ]
      : props.children}
  </S.Button>
);

Button.defaultProps = {
  color: "#51aded"
};

export default withRouter(Button);
