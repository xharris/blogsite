import React, { useEffect, useState } from "react";

import FakeLink from "@feature/fakelink";
import Modal from "@feature/modal";
import SignInContent from "./content";

import "./modal.scss";

const Separator = () => <div className="separator" />;

export const SignInLinks = props => {
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (props.onChange) props.onChange(showSignUp);
  }, [showSignUp, props]);

  return (
    <div className="f-signin-title">
      <FakeLink
        className={showSignUp ? "" : "selected"}
        text={"Login"}
        onClick={() => setShowSignUp(false)}
      ></FakeLink>
      <Separator />
      <FakeLink
        className={showSignUp ? "selected" : ""}
        text={"Create an account"}
        onClick={() => setShowSignUp(true)}
      ></FakeLink>
    </div>
  );
};

const SignInModal = props => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Modal
      className="f-modal-login"
      is_open={props.is_open}
      title={
        <div className="modal-login-title">
          <SignInLinks onChange={setShowSignUp} />
        </div>
      }
      onClose={props.onClose}
    >
      <SignInContent showSignUp={showSignUp} onSignIn={props.onSignIn} />
    </Modal>
  );
};

export default SignInModal;
