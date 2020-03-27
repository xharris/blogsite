import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import { Tutorial, TutorialPart } from "@util/db";
import paths from "@util/url";

import { Tag } from "@feature/tag";
import Thumbnail from "@feature/thumbnail";

import "@style/tutorial.scss";

export const Card = withRouter(props => {
  const desc_len = 100;
  const [data, setData] = useState(null);
  const [parts, setParts] = useState(null);

  useEffect(() => {
    if (props.data) {
      setData(props.data);
    } else {
      (async () => {
        await Tutorial.get(props.id).then(e => {
          setData(e.data.data);
        });
      })();
    }
    (async () => {
      await TutorialPart.get_by_tutorial_id(props.id).then(e => {
        setParts(e.data.data);
      });
    })();
  }, []);

  return (
    data && (
      <div className="f-tutorial-card">
        <Thumbnail
          src={data.thumbnail ? `${atob(data.thumbnail.value)}` : null}
          onClick={() => {
            props.history.push(paths.view_tutorial(data._id));
          }}
        />
        <div className="text-container">
          <div className="text-1">
            <Link to={paths.view_tutorial(data._id)} className="title">
              {data.title}
            </Link>
            <span className="icons">
              {data.likes > 0 && (
                <div>
                  <i className="material-icons">thumb_up_off_alt</i>
                  {data.likes}
                </div>
              )}
              {parts && parts.length > 0 && (
                <div>
                  <i className="material-icons">library_books</i>
                  {parts.length}
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
              <Tag key={t._id} data={t} dark={true} />
            ))}
          </div>
        </div>
      </div>
    )
  );
});
