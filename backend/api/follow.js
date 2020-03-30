import build_ctrl from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema({
  type: { type: String }, // blog, post, style, user, etc
  user_id: { type: mongoose.Schema.Types.ObjectId },
  other_id: { type: mongoose.Schema.Types.ObjectId }, // what is being followed

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("follow", schema);

const controller = build_ctrl({
  name: "Follow",
  model: model,
  ctrls: ["add", "delete", "get_all"],
  requires_auth: ["add", "delete"],
  ctrl_opt: {
    add: {
      body_mod: (body, req) => {
        body.type = req.params.type;
        body.user_id = req.params.user_id;
        body.other_id = req.params.other_id;
      }
    },
    delete: {
      body_mod: (body, req) => {
        body.type = req.params.type;
        body.user_id = req.params.user_id;
        body.other_id = req.params.other_id;
      }
    }
  }
});

router.put("/follow/:type/:other_id/user/:user_id", controller.add);
router.delete("/unfollow/:type/:other_id/user/:user_id", controller.delete);
router.get("/following/user/:user_id", controller.get_all);
router.get("/following/:type/:other_id/user/:user_id", controller.get_all);
router.get("/followers/:type/:other_id", controller.get_all);

module.exports = { model, controller, router };
