import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import { Post } from "@util/db";
import paths from "@util/url";

import Thumbnail from "@feature/thumbnail";
import { Tag } from "@feature/tag";

import styled from "styled-components";
import { lighten } from "polished";
import "./card.scss";

const S = {
  PostCard: styled.div`
    .title {
      color: ${props =>
        lighten(
          0.2,
          props.style ? props.style.color.primary : "#FFF"
        )} !important;
    }
  `
};

const Card = withRouter(props => {
  const desc_len = 100;
  const [data, setData] = useState(null);
  const [styleData, setStyleData] = useState(null);
  const [cardType, setCardType] = useState("media");

  useEffect(() => {
    if (props.data) {
      setData(props.data);
    } else {
      (async () => {
        await Post.get(props.id).then(e => {
          setData(e.data.data);
        });
      })();
    }
    if (props.styledata) {
      setStyleData(props.styledata);
    } else {
      // Style.get_by_post_id
    }
  }, []);

  useEffect(() => {
    if (data)
      setCardType(
        data.media
          ? "media"
          : data.body && data.body.length > 0
          ? "text"
          : "title"
      );
  }, [data]);

  return (
    data && (
      <S.PostCard className={`f-post-card ${cardType}`} style={styleData}>
        {data.media && (
          <Thumbnail
            src={data.media.binary_value}
            onClick={() => {
              props.history.push(paths.view_tutorial(data._id));
            }}
          />
        )}
        <div className="text-container">
          <div className="text-1">
            <Link to={paths.view_tutorial(data._id)} className="title">
              {data.title}
            </Link>
            <span className="icons">
              {data.likes > 0 && (
                <div>
                  <i className="material-icons">thumb_up_off_alt</i>
                  {data.likes}
                </div>
              )}
            </span>
          </div>
          <div className="text-2">
            <span className="body">
              {data.body.length > desc_len
                ? data.body.slice(0, desc_len) + "..."
                : data.body}
            </span>
          </div>
          <div className="text-3">
            {data.tags.map(t => (
              <Tag key={t._id} data={t} dark={true} />
            ))}
          </div>
        </div>
      </S.PostCard>
    )
  );
});

export default Card;
