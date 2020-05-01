import build_ctrl, { use_ctrl } from "../controller";
import { model as TagModel } from "./tag";

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
  date_modified: { type: Date, required: true },
});

const model = mongoose.model("post", schema);

const controller = build_ctrl({
  name: "Post",
  model: model,
  ctrls: ["add", "update", "delete", "get_by_id", "get_all"],
  // requires_auth: ["add","update","delete"],
  ctrl_opt: {
    add: {
      modify: async (inst, req) => {
        inst.blog_id = req.params.blog_id;
      },
      body_mod: async (inst, req) => {
        console.log(req.body.tags);
        await Promise.all(
          (req.body.tags || []).map(async t => {
            console.log(t);
            return await new TagModel({ value: t }).save().catch(e => {
              console.log(e);
            });
          })
        );
      },
    },
    get_by_id: {
      populate: [{ path: "tags" }, { path: "media" }],
    },
    get_all: {
      populate: [{ path: "tags" }, { path: "media" }],
    },
  },
});

const get_by_query = async (req, res) => {
  const body = req.body || {};
  if (!body) return status(400, res, { error: "Provide a body to update" });

  await model.find();
};

router.post("/blog/:blog_id/post/add", controller.add);
router.put("/blog/post/:id/update", controller.update);
router.delete("/blog/post/:id/delete", controller.delete);
router.get("/blog/post/:blog_id", controller.get_by_id);
router.get("/blog/:blog_id/posts", controller.get_all);
router.get("/posts", get_by_query);

module.exports = { model, controller, router };
