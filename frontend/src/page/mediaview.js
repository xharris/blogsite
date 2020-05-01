import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Media } from "@util/db";
import { re } from "@util";

import { parseImageData } from "@feature/thumbnail";

const MediaView = props => {
  const [mediaData, setMediaData] = useState();

  useEffect(() => {
    var match;
    if (
      window.location.pathname &&
      (match = window.location.pathname.match(re.media_url_id))
    ) {
      Media.get(match[1]).then(e => {
        const data = e.data.data;
        if (data.binary_value) {
          setMediaData(parseImageData(data.binary_value));
        } else {
          setMediaData([data.type, data.value]);
        }
      });
    }
  }, [window.location.pathname]);

  return mediaData ? (
    mediaData[0] === "image" ? (
      <img src={mediaData[1]} alt={mediaData[1]} />
    ) : (
      mediaData[1]
    )
  ) : null;
};

export default MediaView;
