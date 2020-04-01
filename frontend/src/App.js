import React, { useLayoutEffect, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "purecss";
import "@style/index.scss";

import authContext from "@util/authContext";
import { User } from "@util/db";
import paths from "@util/url";

import Home from "@page/home";
import Explore from "@page/explore";
import { BlogView } from "@page/blog";

import { SignInModal } from "@feature/signin";

const Cookies = require("js-cookie");

const login = e => {
  console.log(e);
  Cookies.set("user", e);
  window.location.reload();
};

const logout = () => {
  //Cookies.remove("user");
  //window.location.reload();
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useLayoutEffect(() => {
    const ck_user = Cookies.get("user");
    if (ck_user) {
      (async () => {
        await User.checkAuth(JSON.parse(ck_user).token)
          .then(e => {
            console.log("Auth success");
            setUser(JSON.parse(ck_user));
          })
          .catch(e => {
            console.error("Auth failed", e);
            logout();
          });
      })();
    }
  }, []);

  return (
    <authContext.Provider
      value={{
        user: user,
        showLoginModal: () => setLoginModalOpen(true),
        logout: logout
      }}
    >
      <BrowserRouter className="app">
        <Switch>
          <Route exact path={paths.browse_followed_blogs()} component={Home} />
          <Route exact path={paths.browse_blogs()} component={Explore} />
          <Route
            exact
            path={paths.view_blog(":blog_id")}
            component={BlogView}
          />
          <Route
            exact
            path={paths.view_post(":blog_id", ":post_id")}
            component={BlogView}
          />
        </Switch>

        <SignInModal
          is_open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSignIn={login}
        />
      </BrowserRouter>
    </authContext.Provider>
  );
};

export default App;
