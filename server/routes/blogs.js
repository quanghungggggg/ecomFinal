const express = require("express");
const router = express.Router();
const { getAllBlogs, getBlogById, createBlog } = require("../controller/blogs");

// ROUTES
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", createBlog);

module.exports = router;
