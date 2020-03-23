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

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("tutorialgroup", schema);

const get = instance => {
  instance;
};

const controller = build_ctrl({
  name: "TutorialGroup",
  model: model,
  ctrls: ["add", "update", "delete", "get_by_id", "get_all"]
});

controller.get_all = async (req, res) => {
  await model
    .find({}, (err, instances) => {
      return err || !instances.length
        ? res
            .status(404)
            .json({ success: false, error: err || `${name} not found` })
        : res.status(200).json({ success: true, data: instances });
    })
    .populate("tags")
    .catch(err => console.error(err));
};

router.post("/tutorialgroup", controller.add);
router.put("/tutorialgroup/:id", controller.update);
router.delete("/tutorialgroup/:id", controller.delete);
router.get("/tutorialgroup/:id", controller.get_by_id);
router.get("/tutorialgroups", controller.get_all);

module.exports = { model, controller, router };
