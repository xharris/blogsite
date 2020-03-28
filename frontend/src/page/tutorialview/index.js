import React, { useState, useEffect } from "react";
import { withRouter, Redirect } from "react-router-dom";

import Prism from "prismjs";

import { Tutorial as dbTutorial, TutorialPart, Tag } from "@util/db";

import Header from "@feature/header";
import Body from "@feature/body";
import FakeLink from "@feature/fakelink";
import Button from "@feature/button";
import BodyEdit from "@feature/bodyedit";
import MediaModal from "@feature/mediamodal";
import Thumbnail, { parseImageData } from "@feature/thumbnail";

import "./index.scss";
import { bytesToSize, color } from "@util";

const Media = props => {
  var m = props.media;
  switch (m && m.type) {
    case "image":
      return (
        <img
          key={m._id}
          className={`media ${m.type}`}
          src={parseImageData(m.binary_value)}
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
  const [deletedParts, setDeletedParts] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const get_part_id = () => `new${parts.length}-${deletedParts.length}`;

  const add_part = () => {
    setParts([...parts, { _id: get_part_id(), title: "", body: "" }]);
    setPartIndex(parts.length);
  };

  const modify_part = (i, key, value) => {
    if (parts && parts[i])
      setParts(
        parts.map(p => (p._id === parts[i]._id ? { ...p, [key]: value } : p))
      );
  };

  const duplicate_part = i => {
    setParts([
      ...parts.slice(0, partIndex + 1),
      { ...parts[partIndex], _id: get_part_id() },
      ...parts.slice(partIndex + 1, parts.length)
    ]);
    setPartIndex(partIndex + 1);
  };

  const remove_part = i => {
    setParts(
      parts.filter((p, _i) => {
        if (i === _i) {
          setDeletedParts([...deletedParts, p._id]);
          return false;
        }
        return true;
      })
    );
    if (partIndex === i) setPartIndex(Math.max(0, partIndex - 1));
  };

  const delete_tutorial = async () => {
    await dbTutorial.delete(data._id).then(() => {
      window.location.reload(true);
    });
  };

  const save_tutorial = async () => {
    const ordered_parts = parts.map((p, i) => ({ ...p, order: i }));
    const new_parts = ordered_parts
      .filter(p => p._id.startsWith("new") && !deletedParts.includes(p._id))
      .map(p => ({ ...p, _id: null }));
    const update_parts = ordered_parts.filter(p => !p._id.startsWith("new"));

    var tag_ids = [];
    var tutorial_id = data ? data._id : null;
    var new_data = { ...data };

    const finish_save = () => window.location.reload(true);

    const update_tutorial_parts = async () =>
      await Promise.all([
        // DB: add new tutorial parts
        ...new_parts.map(async p => await TutorialPart.add(tutorial_id, p)),
        // DB: update existing tutorial parts
        ...update_parts.map(async p => await TutorialPart.update(p)),
        // DB: delete parts
        ...deletedParts
          .filter(id => !id.startsWith("new"))
          .map(async id => await TutorialPart.delete(id))
      ]).catch(e => {});

    const update_tutorial = async () => {
      new_data = { ...new_data, tags: tag_ids };
      // DB: create any new tags
      return await Promise.all(
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
        if (tutorial_id) {
          // DB: update tutorial data
          return await dbTutorial.update(new_data);
        } else {
          // DB: new tutorial data
          return await dbTutorial.add(new_data).then(e => {
            tutorial_id = e._id;
          });
        }
      });
    };

    return await update_tutorial()
      .then(async e => {
        await update_tutorial_parts();
      })
      .then(e => finish_save());
  };

  useEffect(() => {
    if (parts && parts[partIndex]) {
      console.log(parts[partIndex]);
      setBodyContent(parts[partIndex].body);
    }
    // if there are no parts, add one
    if (parts && parts.length === 0) add_part();
  }, [parts, editing, partIndex]);

  useEffect(() => {
    if (bodyContent) setBodySize(bytesToSize(bodyContent.length));
  }, [bodyContent]);

  useEffect(() => {
    // retrieve tutorial data
    (async () => {
      await dbTutorial.get(props.match.params.id).then(e => {
        setData(e[0]);
        setTags(e[0].tags.map(t => t.value));
      });
    })();
    // retrieve data for tutorial parts
    (async () => {
      await TutorialPart.get_by_tutorial_id(props.id).then(e => {
        setParts(e.data.data.sort((a, b) => a.order > b.order));
      });
    })();
  }, []);

  return data && data.deleted === true ? (
    <Redirect
      to={{
        pathname: "/tutorials"
      }}
    />
  ) : (
    data && parts && (
      <div className={`p-tutorialview ${editing ? "edit" : "view"}`}>
        <Header />
        <Body>
          <div className="sidebar">
            <div className="fixed-content">
              {editing ? (
                <div className="tutorial-inputs">
                  <input
                    className="input title"
                    defaultValue={data.title}
                    placeholder="Title"
                    onChange={e => setData({ ...data, title: e.target.value })}
                  />
                  <textarea
                    className="input description"
                    defaultValue={data.description}
                    placeholder="Description"
                    onChange={e =>
                      setData({ ...data, description: e.target.value })
                    }
                  />
                  <textarea
                    className="input tags"
                    defaultValue={data.tags.map(t => t.value).join(", ")}
                    placeholder="Tags (comma-seperated)"
                    onChange={e =>
                      setTags(e.target.value.split(",").map(t => t.trim()))
                    }
                  />
                </div>
              ) : (
                <div className="title">{data.title}</div>
              )}
              <div className="part-list">
                {parts.map((p, i) =>
                  editing ? (
                    <div
                      key={p._id}
                      className={`part-title-input${
                        partIndex === i ? " selected" : ""
                      }`}
                    >
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
                  {/* Tutorial: Save */}
                  <Button className="round save" onClick={save_tutorial}>
                    <i className="material-icons">save</i>
                  </Button>
                  {/* Tutorial: Delete */}
                  <Button
                    className="round delete"
                    color={color.red}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this tutorial?"
                        )
                      )
                        delete_tutorial();
                    }}
                  >
                    <i className="material-icons">delete</i>
                  </Button>
                </div>
              ) : (
                <div className="actions">
                  {/* Tutorial: Like */}
                  <Button
                    className="round like"
                    onClick={() => {
                      // like
                    }}
                  >
                    <i className="material-icons">thumb_up</i>
                  </Button>

                  {/* Tutorial: Share */}
                  <Button
                    className="round share"
                    onClick={() => {
                      // share
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
                    {/* Part: Primary media */}

                    {parts[partIndex].media ? (
                      <div>
                        <span>
                          Primary media ({parts[partIndex].media.type}):
                        </span>
                        <Button
                          onClick={() => {
                            setShowMediaModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          color={color.red}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to remove this media?"
                              )
                            )
                              modify_part(partIndex, "media", null);
                          }}
                        >
                          Remove
                        </Button>
                        <MediaModal
                          data={parts[partIndex].media}
                          is_open={showMediaModal}
                          onClose={() => {
                            setShowMediaModal(false);
                          }}
                        />
                      </div>
                    ) : (
                      <div>
                        <span>Add primary media:</span>
                        <Button>Image</Button>
                        <Button>Video Embed</Button>
                        <Button>Code</Button>
                      </div>
                    )}

                    <div className="move-action-container">
                      <span>Move part:</span>
                      <Button
                        onClick={e => {
                          if (partIndex > 0) {
                            var new_parts = parts.slice();
                            [new_parts[partIndex], new_parts[partIndex - 1]] = [
                              new_parts[partIndex - 1],
                              new_parts[partIndex]
                            ];
                            setParts(new_parts);
                            setPartIndex(partIndex - 1);
                          }
                        }}
                      >
                        <i className="material-icons">arrow_upward</i>
                      </Button>
                      <Button
                        onClick={e => {
                          if (partIndex < parts.length - 1) {
                            var new_parts = parts.slice();
                            [new_parts[partIndex], new_parts[partIndex + 1]] = [
                              new_parts[partIndex + 1],
                              new_parts[partIndex]
                            ];
                            setParts(new_parts);
                            setPartIndex(partIndex + 1);
                          }
                        }}
                      >
                        <i className="material-icons">arrow_downward</i>
                      </Button>
                    </div>
                    <div>
                      <span>Part actions:</span>
                      {/* Part: Duplicate */}
                      <Button onClick={() => duplicate_part(partIndex)}>
                        Duplicate
                      </Button>
                      {/* Tutorial: Remove */}
                      <Button
                        color={color.red}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this part of the tutorial? (This is permanent)"
                            )
                          )
                            remove_part(partIndex);
                        }}
                      >
                        Remove
                      </Button>
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
