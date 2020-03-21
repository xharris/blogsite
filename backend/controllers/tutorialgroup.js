import { add, update, del, get_by_id, get_all } from ".";
const TutorialGroupModel = require("../models/tutorialgroup");

const args = ["TutorialGroup", TutorialGroupModel];

module.exports = {
  add: add(...args),
  update: update(...args),
  delete: del(...args),
  get_by_id: get_by_id(...args),
  get_all: get_all(...args)
};
