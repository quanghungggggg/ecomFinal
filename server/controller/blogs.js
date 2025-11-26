const Blog = require("../models/blogs");

// [GET] /api/blogs → Lấy tất cả bài viết
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// [GET] /api/blogs/:id → Lấy chi tiết bài viết
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Không tìm thấy bài viết!" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// [POST] /api/blogs → Tạo bài viết mới
exports.createBlog = async (req, res) => {
    try {
        const { title, shortDesc, content, image } = req.body;

        if (!title || !shortDesc || !content) {
            return res.status(400).json({ message: "Thiếu thông tin bài viết!" });
        }

        const newBlog = new Blog({ title, shortDesc, content, image });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
