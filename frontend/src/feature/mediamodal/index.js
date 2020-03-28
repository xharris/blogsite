import React from "react";

import Modal from "@feature/modal";
import Thumbnail from "@feature/thumbnail";
import Button from "@feature/button";

import "./index.scss";

const MediaModal = props => {
  if (props.type === "image") console.log(props.data.value);
  return (
    <Modal
      {...props}
      className={`f-media-modal ${props.data.type} ${props.className || ""}`}
      title={`Add ${props.data.type}`}
    >
      {props.data.type === "image" ? (
        <div>
          <Thumbnail
            src={props.data.binary_value}
            onChange={e => {
              console.log(e);
            }}
          />
          <Button
            onClick={() => {
              if (props.onClose) props.onClose();
            }}
          >
            Submit
          </Button>
        </div>
      ) : props.data.type === "video" ? (
        <div></div>
      ) : props.data.type === "code" ? (
        <div></div>
      ) : null}
    </Modal>
  );
};

export default MediaModal;
