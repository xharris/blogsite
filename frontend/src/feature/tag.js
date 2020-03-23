import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import { Tag as dbTag } from "@db";

import FakeLink from "@feature/fakelink";

import "@style/tag.scss";

export const Tag = withRouter(props => {
  const [tagValue, setTagValue] = useState(props.value || "");

  useEffect(() => {
    if (props.id) {
      (async () => {
        await dbTag.get(props.id).then(e => {
          setTagValue(e.data.data.value);
        });
      })();
    }
  }, []);

  useEffect(() => {
    setTagValue(
      tagValue.length > 50 ? tagValue.slice(0, 50) + "..." : tagValue
    );
  }, [tagValue]);

  // return props.onClick ? (
  return (
    <FakeLink
      text={`#${tagValue}`}
      className="f-tag"
      onClick={
        props.onClick
          ? props.onClick
          : () => {
              props.history.push({
                pathname: "/browse",
                search: `?tags=${encodeURI(tagValue)}`
              });
            }
      }
    />
  );
  // ) : (
  //   <Link to={`/browse?search=${encodeURI(" #" + tagValue)}`} className="f-tag">
  //     {`#${tagValue}`}
  //   </Link>
  // );
});

export const TagList = props => {
  return (
    <div className="f-tag-list">
      {props.list && props.list.map(t => <Tag key={t} id={t} />)}
    </div>
  );
};
