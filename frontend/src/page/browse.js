import React, { useState, useEffect } from "react";

import { TutorialGroup } from "@db";

import Header from "@feature/header";
import Body from "@feature/body";
import Search from "@feature/search";
import { TagList } from "@feature/tag";

import "@style/browse.scss";

const Browse = () => {
  const [tutorialList, setTutorialList] = useState(null);

  useEffect(() => {
    (async () => {
      await TutorialGroup.get().then(e => {
        setTutorialList(e.data.data);
      });
    })();
  }, []);

  return (
    <div className="p-browse">
      <Header />
      <Body>
        <div className="left">
          <Search />
          <TagList />
        </div>
        <div className="right">
          {tutorialList &&
            tutorialList.map(t => <div key={t._id}>{t.title}</div>)}
        </div>
      </Body>
    </div>
  );
};

export default Browse;
