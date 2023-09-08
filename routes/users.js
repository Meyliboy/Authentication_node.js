const { Router } = require("express");
const router = Router();
const postcontorller = require("../controllers/postController");

router.post("/register", postcontorller.create);
router.post("/login");

module.exports = router;
