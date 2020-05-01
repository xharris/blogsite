import React, { useState, useEffect } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";

import { useAuthContext } from "@util/authContext";
import paths from "@util/url";

import Thumbnail from "@feature/thumbnail";
import FakeLink from "@feature/fakelink";
import { get_color } from "@page/blog";

import img_world from "@image/world.png";
import img_logo from "@front/logo48.png";

import styled from "styled-components";
import { rgba, darken, lighten, transparentize } from "polished";
import "@style/header.scss";

const S = {
  NavLink: styled(NavLink)`
    &.on-page .bg {
      background-color: ${props => rgba(props.color, 0.1)};
    }
    &.on-page > div,
    &:hover > div {
      text-shadow: 0px 0px 4px ${props => props.color};
      color: ${props => darken(0.25, props.color)};
    }
  `,
  HeaderPage: styled.div`
    color: ${props => props.color};
  `,
  BlogHeader: styled.div`
    background-color: ${props =>
      transparentize(
        0.25,
        lighten(0.1, get_color(props.data || {}, "primary", "#FFF"))
      )};
    transition: all ease-in-out 0.1s;
    &:hover {
      background-color: ${props =>
        transparentize(
          0.1,
          lighten(0.1, get_color(props.data || {}, "primary", "#FFF"))
        )};
    }
  `,
};

const HeaderPage = props => (
  <S.NavLink
    to={props.nonav ? null : props.to}
    exact={props.exact === null ? false : props.exact}
    className={`hide-link header-page ${props.size}`}
    activeClassName="on-page"
    {...props}
  >
    <S.HeaderPage {...props}>
      <div className="subcontainer">
        <div className="text">{props.text}</div>
        {props.size !== "small" && (
          <div className="subtext">{props.subtext}</div>
        )}
      </div>
    </S.HeaderPage>
    {props.size !== "small" && (
      <div className="bg">
        {props.image && <img src={props.image} alt="" />}
      </div>
    )}
  </S.NavLink>
);

HeaderPage.defaultProps = {
  size: "normal",
};

const Separator = () => <div className="separator" />;

const header_colors = ["#3F51B5", "#0D47A1", "#0277BD"];

const pages = (user, size, color) => (
  <div className={`pages-container ${size || "normal"}`}>
    <HeaderPage
      text="Home"
      subtext={user ? "view blogs you follow" : null}
      nonav={"true"}
      color={color ? darken(0.2, color) : header_colors[1]}
      to={paths.browse_followed_blogs()}
      size={size}
      exact={true}
    />
    <Separator />
    <HeaderPage
      text="Explore"
      subtext="find interesting blogs"
      color={color ? darken(0, color) : header_colors[0]}
      image={img_world}
      to={paths.browse_blogs()}
      size={size}
    />
    {user && [
      <Separator key="sep" />,
      <HeaderPage
        key="hpage"
        text="Profile"
        subtext="view and edit"
        color={color ? lighten(0.1, color) : header_colors[0]}
        image={img_world}
        to={paths.view_profile()}
        size={size}
      />,
    ]}
  </div>
);

export const BlogHeader = withRouter(({ data, match }) => {
  const { user, showLoginModal, logout } = useAuthContext();
  const [logo, setLogo] = useState(img_logo);

  useEffect(() => {
    if (data && data.thumbnail) {
      setLogo(data.thumbnail.binary_value);
    }
  }, [data]);

  return (
    <S.BlogHeader
      className={`f-blog-header ${match.params.post_id ? "viewing-post" : ""}`}
      data={data}
    >
      <Link to={data ? paths.view_blog(data._id) : ""}>
        <Thumbnail className="logo" src={logo} alt="" />
      </Link>
      <div className="content">
        {data && data.title && <div className="title">{data.title}</div>}
        {pages(
          user,
          "small",
          data ? get_color(data, "secondary", "#757575") : null
        )}
      </div>
    </S.BlogHeader>
  );
});

const Header = withRouter(props => {
  const { user, showLoginModal, logout } = useAuthContext();

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  return (
    <div className="f-header">
      <Link to={"/"} className="logo-link">
        <img className="logo" src={img_logo} alt="" />
      </Link>
      {/* middle page tabs */ !props.nolinks && pages(user)}
      {!props.noavatar && (
        <div className="right">
          {user ? (
            <>
              <div className={`menu ${avatarMenuOpen ? "expanded" : ""}`}>
                {avatarMenuOpen &&
                  ["edit profile", "logout"].map(m => (
                    <FakeLink
                      key={m}
                      className="item"
                      text={m}
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        if (m === "logout") logout();
                      }}
                    />
                  ))}
              </div>
              <Thumbnail
                className="avatar"
                src={user.img_url}
                type={"rounded"}
                onClick={() => {
                  setAvatarMenuOpen(!avatarMenuOpen);
                }}
              />
            </>
          ) : (
            <>
              <FakeLink
                className="login"
                text={"Login"}
                onClick={() => showLoginModal()}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default Header;
