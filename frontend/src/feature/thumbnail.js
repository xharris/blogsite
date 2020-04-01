import React, { useState, useEffect } from "react";

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

const Image = props => (
  <S.Image {...props} src={props.src[1]}>
    {props.src[0] === "video" && (
      <i className="material-icons thumbnail-play">play_arrow</i>
    )}
  </S.Image>
);

const re_youtube = /https?:\/\/www\.(?:youtube\.com\/watch\?v=(\w+))|(?:\.be\/(\w+))/;

export const parseImageData = value => {
  if (Array.isArray(value)) return value.map(v => parseImageData(v));
  var ret = value
    ? typeof value === "string"
      ? value
      : value.type && value.type === "Buffer"
      ? Buffer.from(value).toString("utf8")
      : atob(Buffer.from(value).toString("utf8"))
    : value;
  var type = "image";
  if (ret && typeof ret === "string") {
    if (ret.match(re_youtube)) type = "video";
    ret = ret.replace(re_youtube, "http://i3.ytimg.com/vi/$1/hqdefault.jpg");
  }
  return [type, ret];
};

const Thumbnail = props => {
  const [file, setFile] = useState(parseImageData(props.src));

  useEffect(() => {
    setFile(parseImageData(props.src));
  }, [props.src]);

  return (
    <S.Thumbnail
      {...props}
      className={`f-thumbnail ${props.type || "square"} ${props.className ||
        ""}${props.onClick ? " clickable" : " "}`}
      src={null}
      onClick={props.onClick}
    >
      {Array.isArray(file[0])
        ? file.map((src, i) => [
            <Image className="image" key={i} src={src} alt={props.alt} />
          ])
        : [
            <Image
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
                    setFile(["image", URL.createObjectURL(e.target.files[0])]);
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
