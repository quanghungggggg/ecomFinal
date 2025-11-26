const Contact = require("../models/contact");

// [POST] /api/contact → Lưu thông tin liên hệ
exports.createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({
            message: "Gửi liên hệ thành công!",
            contact: newContact,
        });
    } catch (err) {
        console.error("Lỗi khi lưu liên hệ:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// [GET] /api/contact → Cho admin xem danh sách liên hệ
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// [DELETE] /api/contact/:id → Xoá liên hệ
exports.deleteContact = async (req, res) => {
    try {
        const deleted = await Contact.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Không tìm thấy liên hệ." });
        }
        res.json({ message: "Xoá liên hệ thành công!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
