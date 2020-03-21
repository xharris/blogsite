const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TutorialGroup = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  likes: { type: Number, required: true }
});

module.exports = mongoose.model("tutorialgroup", TutorialGroup);
