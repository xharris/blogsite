import React, { useState, useEffect } from "react";

import Button from "@feature/button";

import "@style/bodyedit.scss";

const ReactMarkdown = require("react-markdown");

const EditButton = props => (
  <button>
    {props.text ? (
      props.text
    ) : (
      <i className={`material-icons ${props.icon}`}></i>
    )}
  </button>
);

const EditSep = props => <div className="seperator">|</div>;

const BodyEdit = props => {
  const [input, setInput] = useState(props.defaultValue);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setInput(props.defaultValue);
  }, [props.defaultValue]);

  return (
    <div className={`f-body-edit${props.toolbar ? " has-toolbar" : ""}`}>
      {props.toolbar && false && (
        <div className="toolbar">
          {props.toolbar.split(" ").map(t => {
            switch (t) {
              case "|":
                return <EditSep />;
              case "h1":
                return <EditSep text="h1" />;
            }
          })}
        </div>
      )}
      <Button onClick={() => setShowPreview(!showPreview)}>
        toggle body preview
      </Button>
      {!showPreview ? (
        <textarea
          className="input"
          value={input}
          placeholder={props.placeholder}
          onChange={e => {
            setInput(e.target.value);
            if (props.onChange) props.onChange(e.target.value);
          }}
          onKeyDown={e => {
            var key_code = e.keyCode || e.which;
            var target = e.target;
            if (key_code === 9) {
              e.preventDefault();
              var start = target.selectionStart;
              var end = target.selectionEnd;

              // set textarea value to: text before caret + tab + text after caret
              e.target.value =
                input.substring(0, start) + "\t" + input.substring(end);

              // put caret at right position again
              target.selectionStart = target.selectionEnd = start + 1;
            }
          }}
        />
      ) : (
        <div
          className={`result ${
            props.previewClassName ? props.previewClassName : ""
          }`}
        >
          <ReactMarkdown className="markdown-body" source={input} />
        </div>
      )}
    </div>
  );
};

export default BodyEdit;
