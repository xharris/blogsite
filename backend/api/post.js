import build_ctrl, { use_ctrl } from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();
const shortid = require("shortid");

const schema = new Schema({
  _id: { type: String, default: shortid.generate },
  blog_id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  body: { type: String },
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: "media" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
  likes: { type: Number, default: 0 },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("post", schema);

const controller = build_ctrl({
  name: "Post",
  model: model,
  ctrls: ["add", "update", "delete", "get_by_id", "get_all"],
  ctrl_opt: {
    add: {
      modify: (inst, req) => {
        inst.blog_id = req.params.blog_id;
      }
    },
    get_by_id: {
      populate: [{ path: "tags" }, { path: "media" }]
    },
    get_all: {
      populate: [{ path: "tags" }, { path: "media" }]
    }
  }
});

router.post("/blog/:blog_id/post/add", controller.add);
router.put("/blog/post/:id/update", controller.update);
router.delete("/blog/post/:id/delete", controller.delete);
router.get("/blog/post/:blog_id", controller.get_by_id);
router.get("/blog/:blog_id/posts", controller.get_all);

module.exports = { model, controller, router };
