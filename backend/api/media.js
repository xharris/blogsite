import build_ctrl from "../controller";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const router = express.Router();

const schema = new Schema({
  type: { type: String, required: true },
  value: { type: String },
  binary_value: { type: Buffer },
  position: { type: String, default: "center" },
  mime_type: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  blog_id: { type: mongoose.Schema.Types.ObjectId }, // blog this may have been uploaded from
  subdomain: { type: String, required: true, unique: true },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

const model = mongoose.model("media", schema);

const controller = build_ctrl({
  name: "Media",
  model: model,
  ctrls: ["add", "update", "delete", "get_by_id"],
  ctrl_opt: {
    add: {
      modify: (instance, req, res) => {
        if (!["video", "image", "code"].includes(instance.type))
          return res.status(400).json({
            success: false,
            error: "Media.type should be video/image/code"
          });
      }
    }
  }
});

const get_media_data = async (req, res) => {
  await model.findOne({ _id: req.params.id }, async (err, instance) => {
    if (err || !instance)
      status(400, res, { error: err || `${name} not found` });
    if (instance.binary_value) {
      const buf = Buffer.from(instance.binary_value, "base64");
      // separate out the mime component
      var mime_type = buf
        .toString("utf8")
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      res.contentType(mime_type);
      res.send(Buffer.from(buf.toString("utf8").split(",")[1], "base64"));
    } else {
      res.send(instance.value);
    }
  });
};

router.post("/media/add", controller.add);
router.put("/media/:id/update", controller.update);
router.delete("/media/:id/delete", controller.delete);
router.get("/media/:id/view", get_media_data);
router.get("/media/:id", controller.get_by_id);

module.exports = { model, controller, router };
