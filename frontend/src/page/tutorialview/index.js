import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import Prism from "prismjs";

import { Tutorial as dbTutorial, TutorialPart, Tag } from "@util/db";

import Header from "@feature/header";
import Body from "@feature/body";
import FakeLink from "@feature/fakelink";
import Button from "@feature/button";
import BodyEdit from "@feature/bodyedit";

import "./index.scss";
import { bytesToSize } from "@util";

const Media = props => {
  var m = props.media;
  switch (m && m.type) {
    case "image":
      return (
        <img
          key={m._id}
          className={`media ${m.type}`}
          src={`data:image/png;base64,${m.value}`}
        />
      );
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
    case "code":
      return (
        <div key={m._id} className={`media ${m.type}`}>
          {m.value}
        </div>
      );
    default:
      return <></>;
  }
};

const TutorialView = withRouter(props => {
  const [data, setData] = useState(null);
  const [parts, setParts] = useState(null);

  const editing = props.match.params.action === "edit";
  const [partIndex, setPartIndex] = useState(0);
  const [bodyContent, setBodyContent] = useState("");
  const [bodySize, setBodySize] = useState(0);
  const [tags, setTags] = useState([]);

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

    const update_parts = async () => {
      // DB: add new tutorial parts
      await Promise.all(
        new_data.map(async p => await TutorialPart.add(data._id, p))
      )
        .then(
          async e =>
            // DB: update existing tutorial parts
            await Promise.all(
              update_data.map(async p => {
                // console.log(p);
                // await TutorialPart.update(p)
              })
            )
        )
        .then(e => {
          window.location.reload(true);
        });
    };

    // DB: create any new tags
    var tag_ids = [];
    await Promise.all(
      tags.map(
        async t =>
          await Tag.add({ value: t }).then(e => {
            if (e.status === 200) {
              // tag already exists
              tag_ids.push(e.data.data._id);
            } else {
              // new tag
              tag_ids.push(e.data.id);
            }
          })
      )
    ).then(async e => {
      var new_data = { ...data, tags: tag_ids };
      if (new_data._id) {
        // DB: update tutorial data
        await dbTutorial.update(new_data).then(e => {
          update_parts();
        });
      } else {
        // DB: new tutorial data
        await dbTutorial.add(new_data).then(e => {
          update_parts();
        });
      }
    });
    // await dbTutorial.update(data);
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
    // retrieve tutorial data
    (async () => {
      await dbTutorial.get(props.match.params.id).then(e => {
        setData(e.data.data);
        setTags(e.data.data.tags.map(t => t.value));
      });
    })();
    // retrieve data for tutorial parts
    (async () => {
      await TutorialPart.get_by_tutorial_id(props.id).then(e => {
        setParts(e.data.data);
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
                [
                  <input
                    key={"title"}
                    className="input title"
                    defaultValue={data.title}
                    placeholder="Title"
                    onChange={e => setData({ ...data, title: e.target.value })}
                  />,
                  <textarea
                    key={"desc"}
                    className="input description"
                    defaultValue={data.description}
                    placeholder="Description"
                    onChange={e =>
                      setData({ ...data, description: e.target.value })
                    }
                  />,
                  <textarea
                    key={"tags"}
                    className="input tags"
                    defaultValue={data.tags.map(t => t.value).join(", ")}
                    placeholder="Tags (comma-seperated)"
                    onChange={e =>
                      setTags(e.target.value.split(",").map(t => t.trim()))
                    }
                  />
                ]
              ) : (
                <div className="title">{data.title}</div>
              )}
              <div className="part-list">
                {parts.map((p, i) =>
                  editing ? (
                    <div key={p._id} className="part-title-input">
                      {/*<i className="material-icons drag">drag_handle</i>*/}
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
                      <Media media={p.media} />
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
