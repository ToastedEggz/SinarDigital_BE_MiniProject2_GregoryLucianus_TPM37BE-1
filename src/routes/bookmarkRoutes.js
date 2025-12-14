const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const bookmarkController = require("../controllers/bookmarkController");

// CREATE bookmark (with image)
router.post("/", upload.single("image"), bookmarkController.createBookmark);

// READ all bookmarks
router.get("/", bookmarkController.getBookmarks);

// READ one bookmark
router.get("/:id", bookmarkController.getBookmarkById);

// UPDATE bookmark (with image replacement)
router.put("/:id", upload.single("image"), bookmarkController.updateBookmark);

// DELETE bookmark
router.delete("/:id", bookmarkController.deleteBookmark);

module.exports = router;
