import React, { useEffect, useState, useRef, useCallback } from "react";
import { withRouter } from "react-router-dom";

import { Blog, Post } from "@util/db";
import { useWindowSize } from "@util";
import paths from "@util/url";

// import Header from "@feature/header";
import Body from "@feature/body";
import Thumbnail from "@feature/thumbnail";
import Search from "@feature/search";
import { Card as PostCard } from "@feature/post";
import Button from "@feature/button";

import styled from "styled-components";
import { darken, transparentize } from "polished";
import "./index.scss";

const get_color = (props, key, _default) =>
  props.style ? props.style.color[key] : _default;

const S = {
  Body: styled(Body)`
    .right {
      * {
        scrollbar-color: ${props => get_color(props, "secondary", "#757575")}
          rgba(224, 224, 224, 0.1) !important;
      }

      *::-webkit-scrollbar-thumb {
        background-color: ${props =>
          get_color(props, "secondary", "#757575")} !important;
      }

      background: linear-gradient(
        to right,
        transparent,
        ${props => transparentize(0.25, get_color(props, "primary", "#FFF"))}
          30%
      );

      .posts {
        border-bottom: 1px solid
          ${props => transparentize(0.5, get_color(props, "secondary", "#000"))};
      }

      .posts .f-post-card {
        border-color: ${props =>
          transparentize(0.9, get_color(props, "primary", "#212121"))};
      }

      .posts .f-post-card:hover {
        border-color: ${props =>
          transparentize(0.65, get_color(props, "primary", "#212121"))};
      }

      .btn-search,
      .actions .f-button {
        border-color: ${props =>
          darken(0.2, get_color(props, "secondary", "#000"))};
        color: ${props => darken(0.2, get_color(props, "secondary", "#000"))};

        &:hover {
          color: #f5f5f5;
        }
      }
    }

    .f-search input {
      background-color: ${props =>
        darken(0.5, get_color(props, "primary", "#fff"))};
    }

    .bg {
      background-position: ${props =>
        props.thumbnail ? props.thumbnail.position : "center"};
    }

    ${props => (props.css ? props.css : "")}
  `
};

export const BlogView = withRouter(props => {
  const [data, setData] = useState(null);
  const [postList, setPostList] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [rightDivWidth, setRightDivWidth] = useState(0);

  const windowSize = useWindowSize();
  const rightDiv = useRef(null);

  const filter = useCallback(() => {
    if (searchValue && postList) {
      setFilteredList(
        postList.filter(t => {
          var include = true;
          if (!t.title.toLowerCase().includes(searchValue.text))
            include = false;
          if (
            searchValue.tags.length > 0 &&
            !searchValue.tags.every(tag =>
              t.tags.map(new_tag => new_tag.value).includes(tag)
            )
          )
            include = false;
          return include;
        })
      );
    }
  }, [searchValue, postList]);

  useEffect(() => {
    const blog_id = props.match.params.id;
    if (blog_id) {
      const fetch_data = async () => {
        await Blog.get(blog_id).then(e => {
          setData(e.data.data);
          const content_width = e.data.data.style.size.content_container_width;
          if (content_width === "initial") {
            setRightDivWidth(320);
          }
          if (content_width.includes("px")) {
            setRightDivWidth(
              parseInt(e.data.data.style.size.content_container_width)
            );
          }
        });
        await Post.get_by_blog_id(blog_id).then(e => {
          setPostList(e);
          setFilteredList(e);
        });
      };
      fetch_data();
    }
  }, [props.match.params.id]);

  useEffect(() => {
    filter();
  }, [searchValue, filter]);

  return (
    <S.Body
      noHeader={true}
      className="p-blogview"
      style={data ? data.style : null}
      thumbnail={data ? data.thumbnail : null}
    >
      <Thumbnail />
      {data && [
        <Thumbnail key="bg" className="bg" src={data.thumbnail.binary_value} />,
        <div
          key="blur-bg"
          className="blur-bg"
          style={{
            clip: `rect(0px, ${windowSize.width}px, ${
              windowSize.height
            }px, ${windowSize.width - rightDivWidth}px)`
          }}
        >
          <Thumbnail src={data.thumbnail.binary_value} />
        </div>,
        <div
          key="left"
          className="left"
          style={{ paddingRight: rightDivWidth + 24 }}
        >
          <div className="blog-title">{data.title}</div>
          <div className="blog-description">{data.description}</div>
        </div>,
        <div
          key="right"
          className="right"
          ref={rightDiv}
          style={{
            maxWidth: rightDivWidth
          }}
        >
          {/*<div className="blog-title">{data.title}</div>*/}
          <div className="posts">
            {/*<div className="blog-description">{data.description}</div>*/}
            <Search
              onChange={e => setSearchValue(e)}
              searchbutton={{ color: get_color(data, "secondary", "#757575") }}
              cancelbutton={{ color: get_color(data, "primary", "#212121") }}
            />
            {filteredList &&
              filteredList.map(t => (
                <PostCard key={t._id} data={t} styledata={data.style} />
              ))}
          </div>
          <div className="actions">
            {/* Blog Actions: Follow */}
            <Button color={get_color(data, "secondary", "#757575")} icon="add">
              follow
            </Button>

            {/* Blog Actions: Share */}
            <Button
              color={get_color(data, "secondary", "#757575")}
              icon="share"
            >
              share
            </Button>

            {/* Blog Actions: RSS */}
            <Button
              color={get_color(data, "secondary", "#757575")}
              icon="rss_feed"
            >
              RSS
            </Button>

            {/* Blog Actions: Add Post */}
            <Button
              color={get_color(data, "secondary", "#757575")}
              onClick={e => {
                props.history.push({
                  pathname: paths.new_post(data._id)
                });
              }}
              icon="note_add"
            >
              post
            </Button>
          </div>
        </div>
      ]}
    </S.Body>
  );
});
