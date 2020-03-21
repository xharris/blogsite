import React, { useState } from "react";

import styled from "styled-components";
import "@style/thumbnail.scss";

const S = {
  Thumbnail: styled.div`
    grid-template-columns: repeat(
      ${props => (Array.isArray(props.src) ? props.src.length : 1)},
      1fr
    );
  `,
  Image: styled.div`
    background-image: url(${props => props.src});
  `
};

const Thumbnail = props => {
  const [file, setFile] = useState(props.src);

  return (
    <S.Thumbnail
      {...{
        ...props,
        className: `f-thumbnail ${props.type || "square"} ${props.className ||
          ""}`
      }}
    >
      {Array.isArray(file)
        ? file.map((src, i) => (
            <S.Image className="image" key={i} src={src} alt={props.alt} />
          ))
        : [
            <S.Image
              key="image"
              className={`image ${props.onChange ? "editable" : ""}`}
              src={file}
              alt={props.alt}
            />,
            props.onChange && [
              <input
                key="edit"
                type="file"
                className="edit-input"
                onChange={e => {
                  if (e.target.files.length > 0)
                    setFile(URL.createObjectURL(e.target.files[0]));
                  props.onChange(e);
                }}
              />,
              <span key="icon" className="edit-label">
                <i className="material-icons">image</i>change thumbnail
              </span>
            ]
          ]}
    </S.Thumbnail>
  );
};

export default Thumbnail;
