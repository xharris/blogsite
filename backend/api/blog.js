import build_ctrl from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();
const shortid = require("shortid");

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  likes: { type: Number, default: 0 },
  bg: { type: mongoose.Schema.Types.ObjectId, ref: "media" },
  thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: "media" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user_info" }, // owner
  deleted: { type: Boolean, default: false },
  style: { type: mongoose.Schema.Types.ObjectId, ref: "style" },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("blog", schema);

const controller = build_ctrl({
  _id: { type: String, default: shortid.generate },
  name: "Blog",
  model: model,
  ctrls: ["add", "update", "get_by_id", "get_all"],
  ctrl_opt: {
    get_by_id: {
      populate: [{ path: "thumbnail" }, { path: "style" }, { path: "bg" }]
    },
    get_all: {
      populate: [{ path: "thumbnail" }, { path: "style" }, { path: "bg" }]
    }
  }
});

router.post("/blog/add", controller.add);
router.get("/blog/:id", controller.get_by_id);
router.get("/blogs", controller.get_all);
router.put("/blog/:id/update", controller.update);
router.post("/blog/:id/delete", controller.update);

module.exports = { model, controller, router };
