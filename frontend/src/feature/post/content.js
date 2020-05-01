import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import paths from "@util/url";

import Button from "@feature/button";
import MediaList from "@feature/medialist";
import BodyEdit from "@feature/bodyedit";
import Form, { Input, Submit } from "@feature/form";

import { get_color } from "@page/blog";
import styled from "styled-components";
import { lighten, darken, transparentize } from "polished";
import { scrollbar } from "@style";
import "./content.scss";

const moment = require("moment");

const S = {
  Content: styled.div`
    ${props => scrollbar(get_color(props, "secondary", "#757575"))}

    background-color: ${props =>
      lighten(
        0.15,
        transparentize(0.05, get_color(props, "primary", "#212121"))
      )};
    .title,
    .body,
    .date,
    .input,
    input,
    .body * {
      color: ${props =>
        darken(0.5, get_color(props, "primary", "#FFF"))} !important;
      border-color: ${props =>
        transparentize(
          0.75,
          darken(0.5, get_color(props, "primary", "#FFF"))
        )} !important;
    }

    .f-medialist {
      .caption {
        background-color: ${props =>
          lighten(
            0.15,
            transparentize(0.4, get_color(props, "primary", "#212121"))
          )};
      }
    }
  `
};

const Content = withRouter(props => {
  const [data, setData] = useState();

  useEffect(() => {
    if (props.data) {
      if (props.data._id)
        setData({
          ...props.data,
          date_created: moment(props.data.date_created),
          date_modified: moment(props.data.date_modified)
        });
      else setData(props.data);
    }
  }, [props.data]);

  return data ? (
    props.onEdit ? (
      <S.Content className="f-post-editor" style={props.styledata}>
        <Button
          className="rounded btn-close"
          icon="close"
          color={get_color({ style: props.styledata }, "secondary", "#FFF")}
          onClick={() => {
            if (window.confirm("Are you sure you want to cancel?")) {
              if (props.onCancelEdit) {
                props.onCancelEdit();
              }
              props.history.push({
                pathname: data._id
                  ? paths.view_post(data.blog_id, data._id)
                  : paths.view_blog(data.blog_id)
              });
            }
          }}
        />
        <div className="title">
          {data._id ? "Edit a post" : "Add a new post"}
        </div>
        <Form
          onSubmit={e => {
            var new_data = Object.assign(data, e);
            if (
              (new_data.title && new_data.title.length > 0) ||
              (new_data.body && new_data.body.length > 0)
            ) {
              if (new_data.tags) {
                new_data.tags = new_data.tags.split(",").map(t =>
                  t
                    .trim()
                    .replace("#", "")
                    .replace(/\s/, "-")
                );
              }
              if (data._id) new_data._id = data._id;
              console.log(new_data);
              if (props.onEdit) props.onEdit(new_data);
            } else window.alert("Your post must have a title or body!");
          }}
        >
          <Input name="title" placeholder="Title" defaultValue={data.title} />
          <BodyEdit
            placeholder="Body"
            defaultValue={data.body}
            previewClassName="body"
            onChange={e => {
              setData({ ...data, body: e });
            }}
          />

          <Input
            name="tags"
            placeholder="Tags (comma-separated) Ex. anime, art, photography"
            defaultValue={data.tags && data.tags.map(t => t.value)}
          />
          <Submit label={"Submit Post"} />
        </Form>
      </S.Content>
    ) : (
      <S.Content className="f-post-content" style={props.styledata}>
        <Button
          className="rounded btn-close"
          icon="close"
          color={get_color({ style: props.styledata }, "secondary", "#FFF")}
          onClick={() => {
            props.history.push({
              pathname: paths.view_blog(data.blog_id)
            });
          }}
        />
        <div className="container">
          <div className="title">{data.title}</div>
          <div
            title={`created ${data.date_modified.format("l h:mma")}${
              !data.date_modified.isSame(data.date_created)
                ? `\nedited ${data.date_created.format("l h:mma")}`
                : ""
            }`}
            className="date"
          >
            {(data.date_modified.isSame(data.date_created)
              ? "created"
              : "edited") +
              " " +
              data.date_modified.format("l h:mma")}
          </div>
          <div className="body">{data.body}</div>
          <MediaList media={data.media} />
          <div className="actions">
            {/* Blog Actions: Like */}
            <Button
              color={get_color(
                { style: props.styledata },
                "secondary",
                "#757575"
              )}
              icon="thumb_up"
            >
              like
            </Button>
            {/* Blog Actions: Share */}
            <Button
              color={get_color(
                { style: props.styledata },
                "secondary",
                "#757575"
              )}
              icon="share"
            >
              share
            </Button>
          </div>
        </div>
      </S.Content>
    )
  ) : null;
});

export default Content;
