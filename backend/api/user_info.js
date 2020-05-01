import build_ctrl from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      unique: true
    },
    name: { type: String },
    avatar: { type: mongoose.Schema.Types.ObjectId, ref: "media" },

    date_created: { type: Date, required: true },
    date_modified: { type: Date, required: true }
  },
  { collection: "user_info" }
);

const model = mongoose.model("user_info", schema);

const controller = build_ctrl({
  name: "User_Info",
  model: model,
  ctrls: ["add", "update", "get_by_id"],
  ctrl_opt: {
    get_by_id: {
      populate: [{ path: "avatar" }]
    }
  }
});

router.post("/user/:user_id/info/add", controller.add);
router.get("/user/:user_id/info", controller.get_by_id);
router.post("/user/:user_id/info/update", controller.update);

module.exports = { model, controller, router };
