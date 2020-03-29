import build_ctrl from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId },
  blog_id: { type: mongoose.Schema.Types.ObjectId },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("follow", schema);

const controller = build_ctrl({
  name: "Follow",
  model: model,
  ctrls: ["add", "delete", "get_all"]
});

router.post("/follow/user/:user_id/blog/:blog_id", controller.add);
router.delete("/unfollow/user/:user_id/blog/:blog_id", controller.delete);
router.get("/following/:user_id", controller.get_all);
router.get("/followers/:blog_id", controller.get_all);

module.exports = { model, controller, router };
