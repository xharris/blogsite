import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "purecss";
import "@style/index.scss";

import { User } from "@util/db";
import authContext from "@util/authContext";
import paths from "@util/url";

import Home from "@page/home";
import Explore from "@page/explore";
import { BlogView } from "@page/blog";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      // await User.get("1").then(user => {
      //   setUser(user.data);
      // });
    })();
  });
  return (
    <authContext.Provider value={{ user: user }}>
      <BrowserRouter className="app">
        <Switch>
          <Route exact path={paths.browse_followed_blogs()} component={Home} />
          <Route exact path={paths.browse_blogs()} component={Explore} />
          <Route exact path={paths.view_blog(":id")} component={BlogView} />
        </Switch>
      </BrowserRouter>
    </authContext.Provider>
  );
};

export default App;
