import build_ctrl from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema({
  value: { type: String, required: true },
  type: { type: String, default: "normal" },
  color: { type: String },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("tag", schema);

const controller = build_ctrl({
  name: "Tag",
  model: model,
  ctrls: ["add", "update", "delete", "get_by_id", "get_all"]
});

router.post("/tags/add", controller.add);
router.put("/tags/:id/update", controller.update);
router.delete("/tags/:id/delete", controller.delete);
router.get("/tags/:id", controller.get_by_id);
router.get("/tags", controller.get_all);

module.exports = { model, controller, router };
