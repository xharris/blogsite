import build_ctrl from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  likes: { type: Number, default: 0 },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
  thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: "media" },
  deleted: { type: Boolean, default: false },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("tutorial", schema);

const controller = build_ctrl({
  name: "Tutorial",
  model: model,
  ctrls: ["add", "update", "get_by_id", "get_all"],
  ctrl_opt: {
    get_by_id: {
      populate: [{ path: "tags" }, { path: "thumbnail" }]
    },
    get_all: {
      populate: [{ path: "tags" }, { path: "thumbnail" }]
    }
  }
});

router.post("/tutorials/add", controller.add);
router.get("/tutorials/:id", controller.get_by_id);
router.get("/tutorials", controller.get_all);
router.put("/tutorials/:id/update", controller.update);
router.post("/tutorials/:id/delete", controller.update);

module.exports = { model, controller, router };
