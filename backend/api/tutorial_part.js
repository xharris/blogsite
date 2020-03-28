import build_ctrl, { use_ctrl } from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema({
  tutorial_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  order: { type: Number },
  body: { type: String },
  media: { type: mongoose.Schema.Types.ObjectId, ref: "media" },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("tutorialparts", schema);

const controller = build_ctrl({
  name: "TutorialPart",
  model: model,
  ctrls: ["add", "update", "delete", "get_all"],
  ctrl_opt: {
    add: {
      modify: (inst, req) => {
        inst.instance_id = req.params.tutorial_id;
      }
    },
    get_all: {
      populate: [
        {
          path: "media",
          populate: {
            path: ""
          }
        }
      ]
    }
  }
});

router.post("/tutorial/:tutorial_id/part/add", controller.add);
router.put("/tutorial/part/:id/update", controller.update);
router.delete("/tutorial/part/:id/delete", controller.delete);
router.get("/tutorial/:tutorial_id/parts", controller.get_all);

module.exports = { model, controller, router };
