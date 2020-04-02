import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import { Post } from "@util/db";
import paths from "@util/url";

import Thumbnail from "@feature/thumbnail";
import { TagList } from "@feature/tag";
import FakeLink from "@feature/fakelink";

import { get_color } from "@page/blog";

import styled from "styled-components";
import { lighten, darken, transparentize } from "polished";
import "./card.scss";

const S = {
  PostCard: styled.div`
    border-color: ${props =>
      transparentize(0.9, get_color(props, "primary", "#212121"))};
    &:hover,
    &.viewing {
      border-color: ${props =>
        transparentize(0.65, get_color(props, "primary", "#212121"))};
    }
    .title {
      color: ${props =>
        lighten(0.2, get_color(props, "primary", "#FFF"))} !important;
    }
  `,
  TitleBody: styled.div`
    background-color: ${props =>
      lighten(0.2, get_color(props, "primary", "#FFF"))};

    .title,
    .description {
      color: ${props =>
        darken(0.5, get_color(props, "primary", "#FFF"))} !important;
    }
  `,
  TitleMedia: styled.div`
    .title {
      background-color: ${props =>
        transparentize(0.5, get_color(props, "primary", "#212121"))};
    }
  `
};

const Card = withRouter(props => {
  const body_limit = 100;
  const [data, setData] = useState(null);
  const [body, setBody] = useState();
  const [styleData, setStyleData] = useState(null);
  const [type, setType] = useState(); // media, title, title-media, body, title-body

  const checkData = new_data => {
    if (new_data.body) {
      setBody(
        new_data.body.length > body_limit
          ? new_data.body.slice(0, body_limit) + "..."
          : new_data.body
      );
    }
    setData(new_data);
  };

  useEffect(() => {
    if (props.data) {
      checkData(props.data);
    } else {
      (async () => {
        await Post.get(props.id).then(e => {
          checkData(e.data.data);
        });
      })();
    }
    if (props.styledata) {
      setStyleData(props.styledata);
    } else {
      // Style.get_by_post_id
    }
  }, [props.data, props.id, props.styledata]);

  useEffect(() => {
    if (data) {
      var contents = [];
      if (data.title) contents.push("Title");
      if (data.media.length > 0) contents.push("Media");
      else {
        if (data.body) contents.push("Body");
      }

      setType(contents.join(""));
    }
  }, [data]);

  return (
    data && (
      <S.PostCard
        className={`f-post-card ${type} ${props.className || ""}`}
        style={styleData}
      >
        {type === "TitleBody" ? (
          <S.TitleBody className="card-title-body" style={styleData}>
            <Link to={paths.view_post(data.blog_id, data._id)}>
              <div className="title">{data.title}</div>
              <div className="description">{body}</div>
            </Link>
            <TagList data={data.tags} />
          </S.TitleBody>
        ) : type === "Title" ? (
          <S.TitleBody className="card-title" style={styleData}>
            <Link to={paths.view_post(data.blog_id, data._id)}>
              <div className="title">{data.title}</div>
            </Link>
            <TagList data={data.tags} />
          </S.TitleBody>
        ) : type === "TitleMedia" ? (
          <S.TitleMedia className="card-title-media" style={styleData}>
            <Link to={paths.view_post(data.blog_id, data._id)}>
              <div className="title">{data.title}</div>
              <Thumbnail src={data.media.map(m => m.binary_value || m.value)} />
            </Link>
          </S.TitleMedia>
        ) : type === "Body" ? (
          <S.TitleBody className="card-body" style={styleData}>
            <Link to={paths.view_post(data.blog_id, data._id)}>
              <div className="description">{body}</div>
            </Link>
            <TagList data={data.tags} />
          </S.TitleBody>
        ) : type === "Media" ? (
          <S.TitleMedia className="card-media" style={styleData}>
            <Link to={paths.view_post(data.blog_id, data._id)}>
              <Thumbnail src={data.media.map(m => m.binary_value || m.value)} />
            </Link>
          </S.TitleMedia>
        ) : (
          <div>{type}</div>
        )}
      </S.PostCard>
    )
  );
});

export default Card;
