import React, { useLayoutEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "purecss";
import "@style/index.scss";

import authContext from "@util/authContext";
import paths from "@util/url";

import Home from "@page/home";
import Explore from "@page/explore";
import { BlogView } from "@page/blog";

import { SignInModal } from "@feature/signin";

const Cookies = require("js-cookie");

const App = () => {
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useLayoutEffect(() => {
    (async () => {
      // await User.get("1").then(user => {
      //   setUser(user.data);
      // });
    })();
    const user = Cookies.get("user");
    if (user) setUser(user);
  });

  return (
    <authContext.Provider
      value={{ user: user, loginModal: () => setLoginModalOpen(true) }}
    >
      <BrowserRouter className="app">
        <Switch>
          <Route exact path={paths.browse_followed_blogs()} component={Home} />
          <Route exact path={paths.browse_blogs()} component={Explore} />
          <Route exact path={paths.view_blog(":id")} component={BlogView} />
        </Switch>

        <SignInModal
          is_open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSignIn={e => {
            Cookies.set("user", e);
            window.location.reload();
          }}
        />
      </BrowserRouter>
    </authContext.Provider>
  );
};

export default App;
