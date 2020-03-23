import build_ctrl, { use_ctrl } from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema({
  tutorial_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  body: { type: String },
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: "media" }],

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("tutorialparts", schema);

const controller = build_ctrl({
  name: "TutorialPart",
  model: model,
  ctrls: ["add", "update", "delete", "get_all"],
  ctrl_opt: {
    get_all: {
      populate: ["media"]
    }
  }
});

router.post("/tutorial/part/add", controller.add);
router.put("/tutorial/part/update", controller.update);
router.delete("/tutorial/part/:id/delete", controller.delete);
router.get("/tutorial/:tutorial_id/parts", controller.get_all);

module.exports = { model, controller, router };
