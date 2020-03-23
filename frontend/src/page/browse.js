import React, { useState, useEffect } from "react";

import { TutorialGroup } from "@db";

import Header from "@feature/header";
import Body from "@feature/body";
import Search from "@feature/search";
import { TagList } from "@feature/tag";
import { Card as TGCard } from "@feature/tutorialgroup";

import "@style/browse.scss";

const Browse = () => {
  const [tutorialList, setTutorialList] = useState(null);
  const [filteredList, setFilteredList] = useState(null);

  useEffect(() => {
    (async () => {
      await TutorialGroup.get().then(e => {
        setTutorialList(e.data.data);
        setFilteredList(e.data.data);
      });
    })();
  }, []);

  return (
    <div className="p-browse">
      <Header />
      <Body>
        <div className="left">
          <Search
            onChange={e => {
              if (tutorialList)
                setFilteredList(
                  tutorialList.filter(t => {
                    var include = true;
                    if (!t.title.toLowerCase().includes(e.text))
                      include = false;
                    if (
                      e.tags.length > 0 &&
                      !e.tags.every(tag =>
                        t.tags.map(new_tag => new_tag.value).includes(tag)
                      )
                    )
                      include = false;
                    return include;
                  })
                );
            }}
          />
          <TagList />
        </div>
        <div className="right">
          {filteredList &&
            filteredList.map(t => <TGCard key={t._id} data={t} />)}
        </div>
      </Body>
    </div>
  );
};

export default Browse;
