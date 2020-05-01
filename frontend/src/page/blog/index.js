import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { withRouter } from "react-router-dom";
import ReactResizeDetector from "react-resize-detector";

import { useAuthContext } from "@util/authContext";
import { Blog, Post, User } from "@util/db";
import { useWindowSize } from "@util";
import paths from "@util/url";

// import Header from "@feature/header";
import { BlogHeader } from "@feature/header";
import Body from "@feature/body";
import Thumbnail from "@feature/thumbnail";
import Search from "@feature/search";
import { Card as PostCard, Content as PostContent } from "@feature/post";
import Button from "@feature/button";

import styled from "styled-components";
import { lighten, darken, transparentize } from "polished";
import { mixins, scrollbar } from "@style";
import "./index.scss";

const defaults = {
  primary: "#FFF",
  secondary: "#757575",
  tag_primary: "#FFF",
  tag_secondary: "#000",
  btn_primary: "#212121",
  btn_secondary: "#757575",
};

export const get_color = (props, key, _default) =>
  props.style ? props.style.color[key] : _default;

export const get_attr = (props, key, _default) =>
  props.style ? props.style[key] : _default;

const S = {
  Body: styled(Body)`
    * {
      ${props => scrollbar(get_color(props, "secondary", defaults.secondary))}
    }

    .f-button {
      color: ${props => get_color(props, "secondary", defaults.btn_secondary)};
      border-color: ${props =>
        get_color(props, "secondary", defaults.btn_secondary)};

      &:hover {
        color: #f5f5f5;
        background: ${props =>
          get_color(props, "secondary", defaults.btn_secondary)};
      }
    }

    .tag-suggestions .f-tag-list {
      background-color: ${props =>
        transparentize(0.2, get_color(props, "primary", defaults.tag_primary))};
    }

    .tag-suggestions .f-tag {
      color: ${props =>
        darken(0.2, get_color(props, "secondary", defaults.tag_secondary))};
    }

    .blog-description {
      ${mixins.phone} {
        background: ${props =>
          transparentize(
            0.25,
            lighten(0.1, get_color(props, "primary", defaults.tag_primary))
          )};
      }
    }

    .color-overlay {
      background: linear-gradient(
        to right,
        transparent,
        ${props =>
            transparentize(0.2, get_color(props, "primary", defaults.primary))}
          30%
      );

      .posts {
        border-top: 1px solid
          ${props =>
            transparentize(
              0.5,
              get_color(props, "secondary", defaults.tag_secondary)
            )};
        border-bottom: 1px solid
          ${props =>
            transparentize(
              0.5,
              get_color(props, "secondary", defaults.tag_secondary)
            )};
      }

      .btn-search,
      .actions .f-button {
        border-color: ${props =>
          darken(0.2, get_color(props, "secondary", defaults.tag_secondary))};
        color: ${props =>
          darken(0.2, get_color(props, "secondary", defaults.tag_secondary))};

        &:hover {
          color: #f5f5f5;
        }
      }

      ${mixins.phone} {
        background: ${props =>
          transparentize(
            0.25,
            lighten(0.1, get_color(props, "primary", defaults.tag_primary))
          )};
      }
    }

    &.viewing-post .post-list {
      background: ${props =>
          transparentize(
            0.2,
            get_color(props, "primary", defaults.tag_primary)
          )}
        30%;
    }

    .f-search input {
      background-color: ${props =>
        darken(0.5, get_color(props, "primary", defaults.tag_primary))};
    }

    .bg .image,
    .blur-bg .image {
      background-position: ${props =>
        props.bg ? props.bg.position : "center"};
    }

    .blur-bg {
      filter: ${props => get_attr(props, "bg_effect", "none")};
    }

    ${props => (props.css ? props.css : "")}
  `,
};

export const BlogView = withRouter(props => {
  const [data, setData] = useState(null);
  const [postList, setPostList] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [postsDivWidth, setPostsDivWidth] = useState("initial");
  const [filterDims, setFilterDims] = useState();

  const [editingData, setEditingData] = useState(false);
  const [viewPost, setViewPost] = useState(); // post_id
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(null);

  // const windowSize = useWindowSize();
  const postsDiv = useRef(null);
  const { user } = useAuthContext();

  const follow_blog = async () => {
    if (!isFollowing && user) {
      Blog.follow(data._id, user._id, user.token)
        .then(e => {
          setIsFollowing(true);
        })
        .catch(e => {
          console.log("bad follow");
        });
    }
  };

  const unfollow_blog = async () => {
    if (isFollowing && user) {
      Blog.unfollow(data._id, user._id, user.token)
        .then(e => {
          setIsFollowing(false);
        })
        .catch(e => {
          console.log("bad unfollow");
        });
    }
  };

  // navigate to new post page
  const new_post = () => {
    props.history.push({
      pathname: paths.view_blog(data._id, "newpost"),
    });
  };

  const save_post = e => {
    if (!e._id) {
      // save new post
      Post.add(data._id, e)
        .then(e => {
          console.log(data._id, e);
          // props.history.push({
          //   pathname: paths.view_post(data._id, e._id)
          // });
        })
        .catch(e => {
          console.error(e);
        });
    } else {
      // save edited post
    }
  };

  const filter = useCallback(() => {
    if (searchValue && postList) {
      setFilteredList(
        postList.filter(t => {
          var include = true;
          if (t.title && !t.title.toLowerCase().includes(searchValue.text))
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
    const blog_id = props.match.params.blog_id;
    const blog_action = props.match.params.action;
    if (blog_id) {
      const fetch_data = async () => {
        await Blog.get(blog_id)
          .then(async e => {
            setData(e.data.data);
            const content_width =
              e.data.data.style.size.content_container_width;
            if (content_width.includes("px")) {
              setPostsDivWidth(parseInt(content_width));
            }
            // creating a new post
            if (blog_action === "newpost") {
              setEditingData({ blog_id });
            }
          })
          .catch(e => {
            console.log("what", blog_id);
          });
        await Post.get_by_blog_id(blog_id).then(e => {
          setPostList(e);
          setFilteredList(e);
        });
      };
      fetch_data();
    }
  }, [props.match.params.blog_id, props.match.params.action]);

  useEffect(() => {
    // viewing a post
    if (data && postList && props.match.params.post_id) {
      const post_id = props.match.params.post_id;
      postList.forEach(p => {
        if (post_id === p._id) setViewPost(p);
      });
    }
    if (!props.match.params.post_id) {
      setViewPost(null);
    }
  }, [postList, props.match.params.post_id]);

  useLayoutEffect(() => {
    if (user && data)
      User.following(user._id, "blog", data._id)
        .then(e => {
          setIsFollowing(true);
        })
        .catch(e => {
          setIsFollowing(false);
        });
  }, [user, data]);

  useEffect(() => {
    filter();
  }, [searchValue, filter]);

  useLayoutEffect(() => {
    if (user && data) setIsOwner(user._id === data.user_id);
  }, [user, data]);

  const onResize = (width, height) => {
    // setFilterDims({
    //   right: width,
    //   bottom: height,
    //   left: width - postsDivWidth
    // });
  };

  return (
    <>
      <S.Body
        noHeader={true}
        className={`p-blogview ${
          viewPost ? "viewing-post" : editingData ? "editing-post" : ""
        }`}
        style={data ? data.style : null}
        bg={data ? data.bg : null}
      >
        {data && [
          data.bg && (
            <Thumbnail key="bg" className="bg" src={data.bg.binary_value} />
          ),
          <div key="color-overlay" className="color-overlay"></div>,
          <div key="post-list" className="post-list" ref={postsDiv}>
            <div key="header" className="blog-header-container">
              <BlogHeader data={data} />
              <div className="blog-description">{data.description}</div>
            </div>
            {editingData || viewPost ? (
              <PostContent
                data={viewPost || editingData}
                styledata={data.style}
                onEdit={editingData ? save_post : null}
                onCancelEdit={() => {
                  setEditingData(null);
                }}
              />
            ) : (
              [
                <Search
                  disabled={editingData != null}
                  onChange={e => setSearchValue(e)}
                  searchbutton={{
                    color: get_color(data, "secondary", defaults.btn_secondary),
                  }}
                  cancelbutton={{
                    color: get_color(data, "primary", defaults.btn_primary),
                  }}
                />,
                <div className="posts">
                  {filteredList &&
                    filteredList.map(t => (
                      <PostCard
                        key={t._id}
                        data={t}
                        className={
                          viewPost && viewPost._id === t._id ? "viewing" : ""
                        }
                        styledata={data.style}
                      />
                    ))}
                </div>,
              ]
            )}
            <div className="actions">
              {/* Blog Actions: Follow */}
              {isOwner === false && (
                <Button
                  color={get_color(data, "secondary", defaults.btn_secondary)}
                  icon={isFollowing ? "remove" : "add"}
                  onClick={isFollowing ? unfollow_blog : follow_blog}
                >
                  {isFollowing ? "unfollow" : "follow"}
                </Button>
              )}

              {/* Blog Actions: Share */}
              <Button
                color={get_color(data, "secondary", defaults.btn_secondary)}
                icon="share"
              >
                share
              </Button>

              {/* Blog Actions: RSS */}
              <Button
                color={get_color(data, "secondary", defaults.btn_secondary)}
                icon="rss_feed"
              >
                RSS
              </Button>

              {/* Blog Actions: Add Post */}
              {isOwner === true && (
                <Button
                  color={get_color(data, "secondary", defaults.btn_secondary)}
                  onClick={new_post}
                  icon="note_add"
                >
                  post
                </Button>
              )}
            </div>
          </div>,
        ]}
      </S.Body>
    </>
  );
});
