import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Tutorial } from "@db";

import Header from "@feature/header";
import Body from "@feature/body";
import Search from "@feature/search";
import { TagList } from "@feature/tag";
import { Card as TGCard } from "@feature/tutorial";

import "@style/browse.scss";

const Browse = withRouter(props => {
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
        setTutorialList(e.data.data);
        setFilteredList(e.data.data);
      });
    })();
  }, []);

  useEffect(() => {
    filter();
  }, [tutorialList, searchValue]);

  return (
    <div className="p-browse">
      <Header />
      <Body>
        <div className="left">
          <Search onChange={setSearchValue} />
          <TagList />
        </div>
        <div className="right">
          {filteredList &&
            filteredList.map(t => <TGCard key={t._id} data={t} />)}
        </div>
      </Body>
    </div>
  );
});

export default Browse;
