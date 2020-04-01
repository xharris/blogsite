import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Tag as dbTag } from "@util/db";

import FakeLink from "@feature/fakelink";

import styled from "styled-components";
import { lighten } from "polished";
import "@style/tag.scss";

const default_tag_color = "#546E7A";

const S = {
  Tag: styled(FakeLink)`
    &.light {
      color: ${props => props.color || default_tag_color} !important;
    }
    &.dark {
      color: ${props =>
        lighten(0.4, props.color || default_tag_color)} !important;
    }
  `
};

export const Tag = withRouter(props => {
  const [data, setData] = useState(props.data);
  const [tagValue, setTagValue] = useState(props.value || "");

  useEffect(() => {
    if (!data && props.id) {
      (async () => {
        await dbTag.get(props.id).then(e => {
          setData(e.data.data);
        });
      })();
    }
  }, [data, props.id]);

  useEffect(() => {
    if (data)
      setTagValue(
        data.value.length > 50 ? data.value.slice(0, 50) + "..." : data.value
      );
  }, [data]);

  // return props.onClick ? (
  return (
    data && (
      <S.Tag
        color={props.color}
        text={`#${tagValue}`}
        className={`f-tag ${props.dark ? "dark" : "light"} ${data.type}`}
        onClick={() => {
          if (props.onClick) props.onClick(data);
          else {
            props.history.push({
              search: `?tags=${encodeURI(data.value)}`
            });
          }
        }}
      />
    )
  );
});

Tag.defaultProps = {
  type: "light"
};

export const TagList = withRouter(props => (
  <div className="f-tag-list">
    {props.data &&
      props.data.map(t => (
        <Tag
          key={t._id}
          data={t}
          dark={props.dark}
          onClick={() => {
            if (props.onClick) props.onClick(t);
            else {
              props.history.push({
                search: `?tags=${encodeURI(t.value)}`
              });
            }
          }}
        />
      ))}
  </div>
));
