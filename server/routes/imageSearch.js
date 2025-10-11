const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // const response = await axios.post("http://localhost:8000/search", formData, {
        //     headers: formData.getHeaders(),
        // });
        const response = await axios.post("http://127.0.0.1:8000/search", formData, {
            headers: formData.getHeaders(),
        });

        res.json(response.data); // Expect { productId: "xxx" }
    } catch (error) {
        console.error("Lỗi tìm kiếm hình ảnh:", error.message);
        res.status(500).json({ error: "Image search failed" });
    }
});

module.exports = router;
