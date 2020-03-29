import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { withRouter } from "react-router-dom";

import { Blog, Post } from "@util/db";
import { useWindowSize } from "@util";

import Header from "@feature/header";
import Body from "@feature/body";
import Thumbnail from "@feature/thumbnail";
import Search from "@feature/search";
import { Card as PostCard } from "@feature/post";

import styled from "styled-components";
import { darken, transparentize } from "polished";
import "./index.scss";

const S = {
  Body: styled(Body)`
    .right {
      * {
        scrollbar-color: ${props =>
            props.style ? props.style.color.secondary : "#757575"}
          rgba(224, 224, 224, 0.1) !important;
      }

      *::-webkit-scrollbar-thumb {
        background-color: ${props =>
          props.style ? props.style.color.secondary : "#757575"} !important;
      }

      background: linear-gradient(
        to right,
        transparent,
        ${props =>
            transparentize(
              0.25,
              props.style ? props.style.color.primary : "#FFF"
            )}
          30%
      );

      .posts {
        border-bottom: 1px solid
          ${props =>
            transparentize(
              0.5,
              props.style ? props.style.color.secondary : "#000"
            )};
      }
    }

    .f-search input {
      background-color: ${props =>
        darken(0.5, props.style ? props.style.color.primary : "#FFF")};
    }

    .left {
      background-position: ${props =>
        props.thumbnail ? props.thumbnail.position : "center"};
    }
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

  const filter = () => {
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
  };

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
  }, []);

  useEffect(() => {
    filter();
  }, [postList, searchValue]);

  return (
    <S.Body
      noHeader={true}
      className="p-blogview"
      style={data ? data.style : null}
      thumbnail={data ? data.thumbnail : null}
    >
      {data && [
        <Thumbnail
          key="left"
          className="left"
          src={data.thumbnail.binary_value}
        />,
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
          key="right"
          className="right"
          ref={rightDiv}
          style={{
            maxWidth: rightDivWidth
          }}
        >
          <div className="blog-title">{data.title}</div>
          <Search onChange={e => setSearchValue(e)} />
          <div className="posts">
            {filteredList &&
              filteredList.map(t => (
                <PostCard key={t._id} data={t} styledata={data.style} />
              ))}
          </div>
        </div>
      ]}
    </S.Body>
  );
});
