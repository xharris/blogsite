var express = require("express");
var router = express.Router();

const TutorialGroupCtrl = require("../controllers/tutorialgroup");

router.post("/tutorialgroup", TutorialGroupCtrl.add);
router.put("/tutorialgroup/:id", TutorialGroupCtrl.update);
router.delete("/tutorialgroup/:id", TutorialGroupCtrl.delete);
router.get("/tutorialgroup/:id", TutorialGroupCtrl.get_by_id);
router.get("/tutorialgroups", TutorialGroupCtrl.get_all);

module.exports = router;
