// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const axios = require("axios");
// const FormData = require("form-data");

// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/", upload.single("file"), async (req, res) => {
//     try {
//         const formData = new FormData();
//         formData.append("file", req.file.buffer, req.file.originalname);

//         // const response = await axios.post("http://localhost:8000/search", formData, {
//         //     headers: formData.getHeaders(),
//         // });
//         const response = await axios.post("http://127.0.0.1:8000/search", formData, {
//             headers: formData.getHeaders(),
//         });

//         res.json(response.data); // Expect { productId: "xxx" }
//     } catch (error) {
//         console.error("Lỗi tìm kiếm hình ảnh:", error.message);
//         res.status(500).json({ error: "Image search failed" });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Lưu file vào bộ nhớ RAM (buffer) để gửi đi ngay lập tức
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        // 1. Kiểm tra đầu vào: Nếu không có file thì báo lỗi ngay
        if (!req.file) {
            return res.status(400).json({ error: "Vui lòng upload một hình ảnh." });
        }

        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // 2. Xác định URL của AI Server
        // Ưu tiên lấy từ biến môi trường (khi deploy), nếu không có thì dùng localhost (khi chạy máy mình)
        let aiHost = process.env.AI_SERVER_URL || "http://127.0.0.1:8000";

        // Xử lý an toàn: Nếu URL có dấu '/' ở cuối thì cắt bỏ để tránh lỗi trùng (vd: ...com//search)
        if (aiHost.endsWith("/")) {
            aiHost = aiHost.slice(0, -1);
        }

        const targetUrl = `${aiHost}/search`;
        console.log(`Backend Node.js đang gọi tới AI Server tại: ${targetUrl}`);

        // 3. Gửi Request sang Python Server
        const response = await axios.post(targetUrl, formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity, // Cho phép gửi ảnh dung lượng lớn
            maxContentLength: Infinity
        });

        // 4. Trả kết quả (ProductId) về cho Frontend
        res.json(response.data);

    } catch (error) {
        console.error("Lỗi khi gọi AI Server:", error.message);

        // Nếu Python Server trả về lỗi cụ thể (ví dụ 400, 500), log ra để debug
        if (error.response) {
            console.error("Chi tiết lỗi từ Python:", error.response.data);
            console.error("Status Code:", error.response.status);
        }

        res.status(500).json({ error: "Tìm kiếm hình ảnh thất bại. Vui lòng thử lại sau." });
    }
});

module.exports = router;