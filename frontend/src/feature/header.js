import React, { useState } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";

import { useAuthContext } from "@util/authContext";
import paths from "@util/url";

import Thumbnail from "@feature/thumbnail";
import FakeLink from "@feature/fakelink";

import img_world from "@image/world.png";
import img_logo from "@front/logo48.png";

import styled from "styled-components";
import { rgba, darken } from "polished";
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
  `
};

const HeaderPage = props => (
  <S.NavLink
    to={props.nonav ? null : props.to}
    className="hide-link header-page"
    activeClassName="on-page"
    {...props}
  >
    <S.HeaderPage {...props}>
      <div className="subcontainer">
        <div className="text">{props.text}</div>
        <div className="subtext">{props.subtext}</div>
      </div>
    </S.HeaderPage>
    <div className="bg">{props.image && <img src={props.image} alt="" />}</div>
  </S.NavLink>
);

const Separator = () => <div className="separator" />;

const header_colors = ["#3F51B5", "#0D47A1", "#0277BD"];

const Header = withRouter(props => {
  const { user, showLoginModal } = useAuthContext();

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  return (
    <div className="f-header">
      <Link to={"/"} className="logo-link">
        <img className="logo" src={img_logo} alt="" />
      </Link>
      {!props.nolinks && (
        <div className="pages-container">
          <HeaderPage
            text="Home"
            subtext="view blogs you follow"
            nonav={"true"}
            color={header_colors[1]}
            to={paths.browse_followed_blogs()}
          />
          <Separator />
          <HeaderPage
            text="Explore"
            subtext="find interesting blogs"
            color={header_colors[0]}
            image={img_world}
            to={paths.browse_blogs()}
          />
        </div>
      )}
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
