import build_ctrl, { status } from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const BlogModel = require("./blog").model;

const schema = new Schema({
  color: {
    primary: { type: String }
  },
  size: {
    content_container_width: { type: String, default: "initial" }
  },
  bg_effect: { type: String },
  css: { type: String },
  name: { type: String },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("style", schema);

const controller = build_ctrl({
  name: "Style",
  model: model,
  ctrls: ["add", "update", "delete", "get_by_id"]
});

const get_style = async (req, res) => {
  await BlogModel.findOne({ _id: req.params.blog_id }, (err, instance) => {
    if (err || !instance)
      return status(400, res, {
        error: err || `blog ${req.params.id} not found`
      });
  }).then(async instance => {
    await model.findOne({ _id: instance.style }, (err, instance) =>
      status(200, res, { data: instance })
    );
  });
};

router.post("/style/add", controller.add);
router.put("/style/:id/update", controller.update);
router.get("/style/:id", controller.get_by_id);
router.get("/style/blog/:blog_id", get_style);

module.exports = { model, controller, router };
