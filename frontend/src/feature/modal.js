import React from "react";
import ReactModal from "react-modal";

import Button from "@feature/button";

import "@style/modal.scss";

ReactModal.setAppElement("#root");

const Modal = props => (
  <ReactModal isOpen={props.is_open}>
    <div className="modal-title">{props.title}</div>
    <Button
      className="modal-close rounded"
      color={"#90a4ae"}
      onClick={props.onClose}
    >
      <i className="material-icons">close</i>
    </Button>
    <div className={`modal-body ${props.className}`}>{props.children}</div>
  </ReactModal>
);
export default Modal;
