import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import { Tag as dbTag } from "@db";

import FakeLink from "@feature/fakelink";

import styled from "styled-components";
import { lighten } from "polished";
import "@style/tag.scss";

const default_tag_color = "#546E7A";

export const Tag = withRouter(props => {
  const [data, setData] = useState(props.data);
  const [tagValue, setTagValue] = useState(props.value || "");

  const S = {
    Tag: styled(FakeLink)`
      &.light {
        color: ${data.color || default_tag_color} !important;
      }
      &.dark {
        color: ${lighten(0.4, data.color || default_tag_color)} !important;
      }
    `
  };

  useEffect(() => {
    if (!data && props.id) {
      (async () => {
        await dbTag.get(props.id).then(e => {
          setData(e.data.data);
        });
      })();
    }
  }, []);

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
        text={`#${tagValue}`}
        className={`f-tag ${props.dark ? "dark" : "light"} ${data.type}`}
        onClick={() => {
          if (props.onClick) props.onClick(data);
          else {
            props.history.push({
              pathname: "/browse",
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

export const TagList = props => (
  <div className="f-tag-list">
    {props.data_list &&
      props.data_list.map(t => (
        <Tag
          key={t._id}
          data={t}
          dark={props.dark}
          onClick={() => {
            if (props.onClick) props.onClick(t);
          }}
        />
      ))}
  </div>
);
