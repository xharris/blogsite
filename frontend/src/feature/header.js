import React, { useContext, useState } from "react";

import { NavLink, Link, withRouter } from "react-router-dom";
import authContext from "@db/authContext";

import Thumbnail from "@feature/thumbnail";
import FakeLink from "@feature/fakelink";

import img_world from "@image/world.png";
import img_logo from "@front/logo48.png";

import styled from "styled-components";
import { rgba, darken, transparentize } from "polished";
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
    to={props.to}
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

const Header = withRouter(props => {
  const { user } = useContext(authContext);

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="f-header">
      <Link to={"/"} className="logo-link">
        <img className="logo" src={img_logo} alt="" />
      </Link>
      {!props.nolinks && (
        <div className="pages-container">
          <HeaderPage
            text="Browse"
            subtext="lots of tutorials"
            color={"#3F51B5"}
            image={img_world}
            to={"/browse"}
          />
          <Separator />
          <HeaderPage
            text="Profile"
            subtext="tutorials you've saved/created"
            color={"#2196F3"}
            to={user ? "/me" : "/signin"}
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
                onClick={() => setLoginModalOpen(true)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default Header;
