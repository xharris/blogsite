import build_ctrl from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  likes: { type: Number, default: 0 },
  thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: "media" },
  deleted: { type: Boolean, default: false },
  style: { type: mongoose.Schema.Types.ObjectId, ref: "style" },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("blog", schema);

const controller = build_ctrl({
  name: "Blog",
  model: model,
  ctrls: ["add", "update", "get_by_id", "get_all"],
  ctrl_opt: {
    get_by_id: {
      populate: [{ path: "thumbnail" }, { path: "style" }]
    },
    get_all: {
      populate: [{ path: "thumbnail" }, { path: "style" }]
    }
  }
});

router.post("/blog/add", controller.add);
router.get("/blog/:id", controller.get_by_id);
router.get("/blogs", controller.get_all);
router.put("/blog/:id/update", controller.update);
router.post("/blog/:id/delete", controller.update);

module.exports = { model, controller, router };
