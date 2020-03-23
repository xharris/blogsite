import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Tutorial as dbTutorial, TutorialPart } from "@db";

import Header from "@feature/header";
import Body from "@feature/body";
import FakeLink from "@feature/fakelink";

import "@style/tutorialview.scss";

const TutorialView = withRouter(props => {
  const [data, setData] = useState(null);
  const [parts, setParts] = useState(null);

  useEffect(() => {
    (async () => {
      await dbTutorial.get(props.match.params.id).then(e => {
        setData(e.data.data);
      });
    })();
    (async () => {
      await TutorialPart.get_by_tutorial_id(props.id).then(e => {
        setParts(e.data.data);
        console.log(e.data.data);
      });
    })();
  }, []);

  return (
    data &&
    parts && (
      <div className="p-tutorialview">
        <Header />
        <Body>
          <div className="sidebar">
            <div className="fixed-content">
              <div className="title">{data.title}</div>
              <div className="part-list">
                {parts.map(p => (
                  <FakeLink key={p._id} text={p.title} />
                ))}
              </div>
            </div>
          </div>

          <div className="part-content">
            {parts.map(p => (
              <div key={p._id} className="part-container">
                <div className="part-title">{p.title}</div>
                <div className="part-body">{decodeURI(p.body)}</div>
              </div>
            ))}
          </div>
          <div className="part-media-content">
            {parts.map(p => (
              <div key={p._id} className="media-container">
                {p.media.slice(1, 2).map(m => {
                  switch (m.type) {
                    case "image":
                      return (
                        <img
                          key={m._id}
                          className={`media ${m.type}`}
                          src={`data:image/png;base64,${m.value}`}
                        />
                      );
                      break;
                    case "video":
                      return (
                        <iframe
                          key={m._id}
                          className={`media ${m.type}`}
                          width="560"
                          height="315"
                          src={m.value.replace(
                            /(.*)v=(\w+)/,
                            "https://www.youtube.com/embed/$2"
                          )}
                          eborder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      );
                      break;
                    case "code":
                      return (
                        <div key={m._id} className={`media ${m.type}`}>
                          {m.value}
                        </div>
                      );
                      break;
                  }
                })}
              </div>
            ))}
          </div>
        </Body>
      </div>
    )
  );
});

export default TutorialView;
