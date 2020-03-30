import React, { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import { withRouter } from "react-router-dom";

import { Tag as dbTag } from "@util/db";

import { TagList } from "@feature/tag";
import Button from "@feature/button";

import "@style/search.scss";

const re_search = [/(.*\s)(#\w+)$/, /^()(#\w+)$/];

const Search = withRouter(props => {
  const [tagList, setTagList] = useState(props.tagList);
  const [tagSuggestions, setTagSuggestions] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [defaultSearchValue, setDefaultSearchValue] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  const el_input = useRef();

  const triggerOnChange = () => {
    if (props.onChange && el_input.current) {
      var value = searchActive ? el_input.current.value : "";
      var text = [],
        tags = [];
      value
        .trim()
        .replace(/\s+/g, " ") // remove extra spacing
        .split(" ")
        .forEach(v => {
          if (v.startsWith("#")) tags.push(v.slice(1));
          else text.push(v);
        });
      props.onChange({
        text: text.join(" "),
        tags: tags,
        string: value
      });
    }
  };

  const resetTagSuggestions = () => {
    // console.log(tagList, props.tagList);
    if (tagList) setTagSuggestions(tagList);
  };

  const parseInput = () => {
    // if query ends with #sometext (no trailing space), show tag autocomplete
    var tag_match;
    if (tagList) {
      for (var re of re_search) {
        if (!tag_match) tag_match = searchValue.match(re);
      }
    }

    if (tag_match) {
      var tag_start = tag_match[2].slice(1);
      setTagSuggestions(tagList.filter(tag => tag.value.startsWith(tag_start)));
    } else {
      resetTagSuggestions();
    }
    triggerOnChange();
  };

  const inputChange = e => setSearchValue(e.target.value);

  useEffect(() => {
    const query_params = queryString.parse(props.location.search);
    var search_value = "";
    // search: value
    if (query_params.search) search_value += query_params.search + " ";
    // search: tags
    if (query_params.tags)
      search_value +=
        query_params.tags
          .split(",")
          .map(t => "#" + t)
          .join(" ") + " ";

    setDefaultSearchValue(search_value);
  }, [props.location.search]);

  useEffect(() => {
    if (searchValue.length > 0) setSearchActive(true);
    parseInput();
  }, [searchValue]);

  useEffect(() => {
    triggerOnChange();
    if (searchActive) resetTagSuggestions();
  }, [searchActive]);

  useEffect(() => {
    if (!tagList)
      (async () => {
        await dbTag
          .get()
          .then(e => {
            setTagList(e.data.data);
            setTagSuggestions(e.data.data);
          })
          .catch(e => {
            setTagList([]);
            setTagSuggestions([]);
          });
      })();
  }, []);

  return (
    <div className={`f-search ${searchActive ? "active" : ""}`}>
      <div className="input-container">
        <input
          key="input"
          ref={el_input}
          type="text"
          placeholder="Search"
          className="input"
          defaultValue={defaultSearchValue}
          onChange={inputChange}
        />
        <Button
          key="cancel"
          className="btn-cancel"
          icon="close"
          {...(props.cancelbutton || {})}
          onClick={e => {
            setSearchActive(false);
          }}
        />
      </div>
      <div className="tag-suggestions">
        <Button
          className="btn-search"
          onClick={e => {
            setSearchActive(true);
          }}
          icon="search"
          {...(props.searchbutton || {})}
        >
          search
        </Button>

        {tagSuggestions && (
          <TagList
            data_list={tagSuggestions}
            onClick={tdata => {
              var matched = false;
              for (var re of re_search) {
                if (searchValue.match(re)) {
                  matched = true;
                  if (el_input.current)
                    el_input.current.value = searchValue.replace(
                      re,
                      `$1#${tdata.value} `
                    );
                }
              }
              if (!matched) {
                if (el_input.current)
                  el_input.current.value = `${searchValue} #${tdata.value} `;
              }
              resetTagSuggestions();
              setSearchValue(el_input.current.value);
              if (el_input.current) el_input.current.focus();
            }}
          />
        )}
      </div>
    </div>
  );
});

export default Search;
