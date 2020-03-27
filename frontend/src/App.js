import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "purecss";
import "@style/index.scss";

import { User } from "@util/db";
import authContext from "@util/authContext";
import paths from "@util/url";

import Home from "@page/home";
import BrowseTutorials from "@page/browsetutorials";
import Create from "@page/create";
import TutorialView from "@page/tutorialview";

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
          <Route
            exact
            path={paths.browse_tutorials()}
            component={BrowseTutorials}
          />
          <Route exact path="/create" component={Create} />
          <Route
            exact
            path={paths.view_tutorial(":id")}
            component={TutorialView}
          />
          <Route
            exact
            path={paths.view_tutorial(":id", ":action")}
            component={TutorialView}
          />
        </Switch>
      </BrowserRouter>
    </authContext.Provider>
  );
};

export default App;
