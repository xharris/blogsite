import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "purecss";
import "@style/index.scss";

import { User } from "@db";
import authContext from "@db/authContext";

import Home from "@page/home";
import Browse from "@page/browse";

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
          <Route exact path="/" component={Home} />
          <Route exact path="/browse" component={Browse} />
        </Switch>
      </BrowserRouter>
    </authContext.Provider>
  );
};

export default App;
