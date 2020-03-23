import React, { useState, useEffect, useRef } from "react";
import "@style/search.scss";

import { Tag } from "@db";

import FakeLink from "@feature/fakelink";

const re_search = [/(.*\s)(#\w+)$/, /^()(#\w+)$/];

const Search = props => {
  const [tagList, setTagList] = useState(null);
  const [tagSuggestions, setTagSuggestions] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const el_input = useRef();

  const triggerOnChange = () => {
    if (props.onChange) {
      var text = [],
        tags = [];
      searchValue
        .trim()
        .replace(/\s+/g, " ") // remove extra spacing
        .split(" ")
        .forEach(v => {
          if (v.startsWith("#")) tags.push(v.slice(1));
          else text.push(v);
        });
      props.onChange({ text: text.join(" "), tags: tags });
    }
  };

  const resetTagSuggestions = () => {
    setTagSuggestions(tagList);
  };

  useEffect(() => {
    triggerOnChange();
  }, [searchValue]);

  useEffect(() => {
    (async () => {
      await Tag.get().then(e => {
        setTagList(e.data.data);
        setTagSuggestions(e.data.data);
      });
    })();
  }, []);

  return (
    <div className="f-search">
      <input
        ref={el_input}
        className="input"
        type="text"
        placeholder="Search"
        value={searchValue}
        onChange={e => {
          // if query ends with #sometext (no trailing space), show tag autocomplete
          var tag_match;
          if (tagList) {
            for (var re of re_search) {
              if (!tag_match) tag_match = e.target.value.match(re);
            }
          }

          if (tag_match) {
            var tag_start = tag_match[2].slice(1);
            setTagSuggestions(
              tagList.filter(tag => tag.value.startsWith(tag_start))
            );
          } else {
            resetTagSuggestions();
          }

          setSearchValue(e.target.value);
        }}
      />
      <div className="tag-suggestions">
        {tagSuggestions &&
          tagSuggestions.map(tag => (
            <FakeLink
              key={tag._id}
              to={`/browse?tags=${tag.value}`}
              text={`#${tag.value}`}
              onClick={() => {
                var matched = false;
                for (var re of re_search) {
                  if (searchValue.match(re)) {
                    matched = true;
                    setSearchValue(searchValue.replace(re, `$1#${tag.value} `));
                  }
                }
                if (!matched) {
                  setSearchValue(`${searchValue}#${tag.value} `);
                }
                resetTagSuggestions();
                triggerOnChange();
                el_input.current.focus();
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default Search;
