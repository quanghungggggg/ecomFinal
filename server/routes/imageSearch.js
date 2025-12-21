// // const express = require("express");
// // const router = express.Router();
// // const multer = require("multer");
// // const axios = require("axios");
// // const FormData = require("form-data");

// // const upload = multer({ storage: multer.memoryStorage() });

// // router.post("/", upload.single("file"), async (req, res) => {
// //     try {
// //         const formData = new FormData();
// //         formData.append("file", req.file.buffer, req.file.originalname);

// //         // const response = await axios.post("http://localhost:8000/search", formData, {
// //         //     headers: formData.getHeaders(),
// //         // });
// //         const response = await axios.post("http://127.0.0.1:8000/search", formData, {
// //             headers: formData.getHeaders(),
// //         });

// //         res.json(response.data); // Expect { productId: "xxx" }
// //     } catch (error) {
// //         console.error("Lỗi tìm kiếm hình ảnh:", error.message);
// //         res.status(500).json({ error: "Image search failed" });
// //     }
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const axios = require("axios");
// const FormData = require("form-data");

// // Lưu file vào bộ nhớ RAM (buffer) để gửi đi ngay lập tức
// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/", upload.single("file"), async (req, res) => {
//     try {
//         // 1. Kiểm tra đầu vào: Nếu không có file thì báo lỗi ngay
//         if (!req.file) {
//             return res.status(400).json({ error: "Vui lòng upload một hình ảnh." });
//         }

//         const formData = new FormData();
//         formData.append("file", req.file.buffer, req.file.originalname);

//         // 2. Xác định URL của AI Server
//         // Ưu tiên lấy từ biến môi trường (khi deploy), nếu không có thì dùng localhost (khi chạy máy mình)
//         let aiHost = process.env.AI_SERVER_URL || "http://127.0.0.1:8000";

//         // Xử lý an toàn: Nếu URL có dấu '/' ở cuối thì cắt bỏ để tránh lỗi trùng (vd: ...com//search)
//         if (aiHost.endsWith("/")) {
//             aiHost = aiHost.slice(0, -1);
//         }

//         const targetUrl = `${aiHost}/search`;
//         console.log(`Backend Node.js đang gọi tới AI Server tại: ${targetUrl}`);

//         // 3. Gửi Request sang Python Server
//         const response = await axios.post(targetUrl, formData, {
//             headers: formData.getHeaders(),
//             maxBodyLength: Infinity, // Cho phép gửi ảnh dung lượng lớn
//             maxContentLength: Infinity
//         });

//         // 4. So sánh với file mapping_data.json để lấy thông tin sản phẩm thực tế
//         const fs = require("fs");
//         const path = require("path");

//         const mappingFilePath = path.join(__dirname, "..", "mappingID", "mapping_data.json");
//         const mappingData = JSON.parse(fs.readFileSync(mappingFilePath, "utf-8"));

//         // Lấy productID từ response của AI Server
//         const productIdFromAI = response.data?.productId;

//         if (productIdFromAI && mappingData[productIdFromAI]) {
//             // Nếu tìm thấy trong mapping, trả về value (ID sản phẩm thực tế)
//             const actualProductId = mappingData[productIdFromAI];
//             res.json({ productId: actualProductId, source: "mapping" });
//         } else if (productIdFromAI) {
//             // Nếu không tìm thấy trong mapping, trả về productID từ AI
//             console.warn(`ProductID ${productIdFromAI} không tìm thấy trong mapping_data.json`);
//             res.json(response.data);
//         } else {
//             // Nếu AI không trả về productId
//             res.status(400).json({ error: "AI Server không trả về productId" });
//         }

//     } catch (error) {
//         console.error("Lỗi khi gọi AI Server:", error.message);

//         // Nếu Python Server trả về lỗi cụ thể (ví dụ 400, 500), log ra để debug
//         if (error.response) {
//             console.error("Chi tiết lỗi từ Python:", error.response.data);
//             console.error("Status Code:", error.response.status);
//         }

//         res.status(500).json({ error: "Tìm kiếm hình ảnh thất bại. Vui lòng thử lại sau." });
//     }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// --- PHẦN KHỞI TẠO (CHẠY 1 LẦN KHI SERVER START) ---

// 1. Cấu hình upload
const upload = multer({ storage: multer.memoryStorage() });

// 2. Load file mapping vào RAM ngay lập tức
let mappingData = {};
const mappingFilePath = path.join(__dirname, "..", "mappingID", "mapping_data.json");

try {
    if (fs.existsSync(mappingFilePath)) {
        const rawData = fs.readFileSync(mappingFilePath, "utf-8");
        mappingData = JSON.parse(rawData);
        console.log(`✅ Đã load file mapping thành công: ${Object.keys(mappingData).length} mục.`);
    } else {
        console.warn("⚠️ Cảnh báo: Không tìm thấy file mapping_data.json tại:", mappingFilePath);
    }
} catch (err) {
    console.error("❌ Lỗi khi đọc file mapping:", err.message);
}

// --- PHẦN XỬ LÝ REQUEST (CHẠY MỖI KHI CÓ NGƯỜI GỌI API) ---

router.post("/", upload.single("file"), async (req, res) => {
    try {
        // 1. Kiểm tra đầu vào
        if (!req.file) {
            return res.status(400).json({ error: "Vui lòng upload một hình ảnh." });
        }

        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // 2. Xác định URL AI Server
        let aiHost = process.env.AI_SERVER_URL || "http://127.0.0.1:8000";
        if (aiHost.endsWith("/")) aiHost = aiHost.slice(0, -1);

        const targetUrl = `${aiHost}/search`;
        console.log(`Backend đang gọi AI Server: ${targetUrl}`);

        // 3. Gọi AI Server
        const response = await axios.post(targetUrl, formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        // 4. Xử lý kết quả trả về
        const productIdFromAI = response.data?.productId;

        // Logic mapping: Nếu AI trả về ID, kiểm tra xem có trong bảng mapping không
        let finalProductId = productIdFromAI;
        let source = "ai_direct";

        // Kiểm tra trong biến mappingData (đã load sẵn trong RAM)
        if (productIdFromAI && mappingData[productIdFromAI]) {
            finalProductId = mappingData[productIdFromAI];
            source = "mapping";
            console.log(`Mapping: ${productIdFromAI} -> ${finalProductId}`);
        } else {
            console.warn(`Không tìm thấy mapping cho ID: ${productIdFromAI}, giữ nguyên ID gốc.`);
        }

        // 5. Trả về kết quả
        // Bạn có thể trả về luôn ID, hoặc dùng ID này query DB để lấy thông tin chi tiết
        res.json({
            productId: finalProductId,
            originalAiId: productIdFromAI,
            distance: response.data?.distance,
            source: source
        });

    } catch (error) {
        console.error("Lỗi quy trình tìm kiếm:", error.message);
        if (error.response) {
            console.error("Chi tiết lỗi Python:", error.response.data);
        }
        res.status(500).json({ error: "Image search failed" });
    }
});

module.exports = router;