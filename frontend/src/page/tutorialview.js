import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import Prism from "prismjs";

import { Tutorial as dbTutorial, TutorialPart } from "@db";

import Header from "@feature/header";
import Body from "@feature/body";
import FakeLink from "@feature/fakelink";
import Button from "@feature/button";
import BodyEdit from "@feature/bodyedit";

import "@style/tutorialview.scss";
import { bytesToSize } from "@front/util";

const TutorialView = withRouter(props => {
  const [data, setData] = useState(null);
  const [parts, setParts] = useState(null);

  const editing = props.match.params.action === "edit";
  const [partIndex, setPartIndex] = useState(0);
  const [bodyContent, setBodyContent] = useState("");
  const [bodySize, setBodySize] = useState(0);

  const add_part = () => {
    setParts([...parts, { _id: "new" + parts.length, title: "", body: "" }]);
    setPartIndex(parts.length);
  };

  const modify_part = (i, key, value) => {
    if (parts && parts[i])
      setParts(
        parts.map(p => (p._id === parts[i]._id ? { ...p, [key]: value } : p))
      );
  };

  const save = async () => {
    const new_data = parts
      .filter(p => p._id.startsWith("new"))
      .map(p => ({ ...p, _id: null }));
    const update_data = parts.filter(p => !p._id.startsWith("new"));

    await Promise.all(
      new_data.map(async p => await TutorialPart.add(data._id, p))
    );
    console.log(new_data, update_data);
  };

  useEffect(() => {
    if (parts && parts[partIndex]) {
      setBodyContent(parts[partIndex].body);
    }
  }, [parts, editing, partIndex]);

  useEffect(() => {
    setBodySize(bytesToSize(bodyContent.length));
  }, [bodyContent]);

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
      <div className={`p-tutorialview ${editing ? "edit" : "view"}`}>
        <Header />
        <Body>
          <div className="sidebar">
            <div className="fixed-content">
              {editing ? (
                <input
                  className="input title"
                  defaultValue={data.title}
                  placeholder="Title"
                />
              ) : (
                <div className="title">{data.title}</div>
              )}
              <div className="part-list">
                {parts.map((p, i) =>
                  editing ? (
                    <div key={p._id} className="part-title-input">
                      <i className="material-icons drag">drag_handle</i>
                      <span className="part-title">{p.title}</span>
                      <FakeLink
                        className="material-icons edit no-underline"
                        onClick={() => {
                          setPartIndex(i);
                        }}
                      />
                    </div>
                  ) : (
                    <FakeLink
                      key={p._id}
                      text={`${i + 1}. ${p.title}`}
                      onClick={() => {
                        document.getElementById(`part_${i}`).scrollIntoView();
                      }}
                    />
                  )
                )}
                {editing && (
                  <FakeLink
                    className="part-title-input no-underline"
                    text={<i className="material-icons">add</i>}
                    onClick={add_part}
                  />
                )}
              </div>
              {editing ? (
                <div className="actions">
                  <Button className="round save" onClick={save}>
                    <i className="material-icons">save</i>
                  </Button>
                </div>
              ) : (
                <div className="actions">
                  <Button
                    className="round like"
                    onClick={() => {
                      // like
                    }}
                  >
                    <i className="material-icons">thumb_up</i>
                  </Button>
                  <Button
                    className="round share"
                    onClick={() => {
                      // like
                    }}
                  >
                    <i className="material-icons">share</i>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="part-content">
            {editing
              ? parts[partIndex] && [
                  <input
                    key={"title" + parts[partIndex]._id}
                    className="input"
                    placeholder="Section title"
                    defaultValue={parts[partIndex].title}
                    onChange={e => {
                      modify_part(partIndex, "title", e.target.value);
                    }}
                  />,
                  <div key={"actions"} className="actions">
                    <div>
                      <span>Add primary media:</span>
                      <Button>Image</Button>
                      <Button>Video Embed</Button>
                      <Button>Code</Button>
                    </div>
                    <div>
                      <span>Part actions:</span>
                      <Button>Duplicate</Button>
                      <Button color={"#e57373"}>Remove</Button>
                    </div>
                  </div>,
                  <div key={"body"} className="body">
                    <BodyEdit
                      defaultValue={decodeURI(parts[partIndex].body)}
                      placeholder={"Body text"}
                      onChange={value => {
                        modify_part(partIndex, "body", value);
                      }}
                    />
                    <span className="body-size">{bodySize}</span>
                  </div>
                ]
              : parts.map((p, i) => (
                  <div key={p._id} id={`part_${i}`} className="part-container">
                    <div className="text-container">
                      <div className="part-title">{p.title}</div>
                      <div className="part-body">{decodeURI(p.body)}</div>
                    </div>
                    <div className="media-container">
                      {p.media.length > 0 &&
                        p.media.slice(0, 2).map(m => {
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
                  </div>
                ))}
          </div>
        </Body>
      </div>
    )
  );
});

export default TutorialView;
