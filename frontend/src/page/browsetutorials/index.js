import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Tutorial } from "@util/db";

import Header from "@feature/header";
import Body from "@feature/body";
import Search from "@feature/search";
import { Card as TGCard } from "@feature/tutorial";

import "./index.scss";

const BrowseTutorials = withRouter(props => {
  const [tutorialList, setTutorialList] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [searchValue, setSearchValue] = useState(null);

  const filter = () => {
    if (searchValue && tutorialList) {
      setFilteredList(
        tutorialList.filter(t => {
          var include = true;
          if (!t.title.toLowerCase().includes(searchValue.text))
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
  };

  useEffect(() => {
    (async () => {
      await Tutorial.get().then(e => {
        setTutorialList(e);
        setFilteredList(e);
      });
    })();
  }, []);

  useEffect(() => {
    filter();
  }, [tutorialList, searchValue]);

  return (
    <div className="p-browse-tutorials">
      <Header />
      <Body>
        <div className="left">
          <Search onChange={setSearchValue} />
        </div>
        <div className="right">
          {filteredList &&
            filteredList.map(t => <TGCard key={t._id} data={t} />)}
        </div>
      </Body>
    </div>
  );
});

export default BrowseTutorials;
