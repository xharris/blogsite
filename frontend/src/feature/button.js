import React from "react";
import { withRouter } from "react-router-dom";

import styled from "styled-components";
import { darken } from "polished";
import "@style/button.scss";

const S = {
  Button: styled.button`
    background-color: ${props => props.color};

    &:hover {
      background-color: ${props => darken(0.1, props.color)} !important;
      border-color: ${props => darken(0.1, props.color)} !important;
    }

    &:active {
      background-color: ${props => darken(0.2, props.color)} !important;
      border-color: ${props => darken(0.2, props.color)} !important;
    }
  `
};

const Button = props => (
  <S.Button
    type="button"
    {...props}
    className={`f-button ${props.className || ""}`}
    onClick={e => {
      if (props.to) props.history.push(props.to);
      else if (props.onClick) props.onClick(e);
    }}
  >
    {props.children}
  </S.Button>
);

Button.defaultProps = {
  color: "#51aded"
};

export default withRouter(Button);
