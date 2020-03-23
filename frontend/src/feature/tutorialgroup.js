import React, { useState, useEffect } from "react";

import { Link, withRouter } from "react-router-dom";
import { TutorialGroup } from "@db";

import "@style/tutorialgroup.scss";

export const Card = props => {
  const desc_len = 100;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (props.data) {
      setData(props.data);
    } else {
      (async () => {
        await TutorialGroup.get(props.id).then(e => {
          setData(e.data.data);
        });
      })();
    }
  }, []);

  return (
    data && (
      <div className="f-tutorialgroup-card">
        <div className="text-container">
          <div className="text-1">
            <Link to={`/tutorial/${data._id}`} className="title">
              {data.title}
            </Link>
            <span className="icons">
              {data.likes > 0 && (
                <div>
                  <i className="material-icons">thumb_up_off_alt</i>
                  {data.likes}
                </div>
              )}
              {data.likes > 0 && (
                <div>
                  <i className="material-icons">library_books</i>
                  {data.likes}
                </div>
              )}
            </span>
          </div>
          <div className="text-2">
            <span className="description">
              {data.description.length > desc_len
                ? data.description.slice(0, desc_len) + "..."
                : data.description}
            </span>
          </div>
          <div className="text-3">
            {data.tags.map(t => (
              <Link
                key={t._id}
                to={`/browse?tags=${t.value}`}
                className="tag-link"
              >
                {`#${t.value}`}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  );
};
