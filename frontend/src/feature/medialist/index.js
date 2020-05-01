import React, { useEffect, useState } from "react";

import { re } from "@util";

import Thumbnail, { parseImageData } from "@feature/thumbnail";
import "./index.scss";

const MediaList = props => {
  return (
    <div className="f-medialist">
      {props.media.map(m => {
        var match;
        if (m.binary_value) {
          return (
            <div key={m._id} className="image">
              <img src={parseImageData(m.binary_value)[1]} />
              <span className="caption">{m.caption}</span>
            </div>
          );
        } else if (m.type === "video" && (match = m.value.match(re.youtube))) {
          return (
            <iframe
              key={m._id}
              width="560"
              height="315"
              src={`https://www.youtube-nocookie.com/embed/${match[1]}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          );
        }
      })}
    </div>
  );
};

export default MediaList;
