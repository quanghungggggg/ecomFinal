import React, { useState } from "react";
import Layout from "../layout";
import axios from "axios";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Nếu có backend thì gửi API ở đây:
            await axios.post(`${process.env.REACT_APP_API_URL}/api/contact`, form);
            // console.log("Dữ liệu gửi đi:", form);
            setStatus("success");
            setForm({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Lỗi khi gửi liên hệ:", error);
            setStatus("error");
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-green-50 py-24 px-6 md:px-16">
                {/* ✅ Phần tiêu đề */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-green-700 mb-4">
                        📞 Liên hệ với Home Market
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe phản hồi, câu hỏi hoặc góp ý của bạn.
                        Hãy để lại thông tin bên dưới để Home Market có thể hỗ trợ bạn tốt nhất 🌿
                    </p>
                </div>

                {/* ✅ Bố cục 2 cột */}
                <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* 📝 Form bên trái */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 md:p-10">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Nội dung
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Nhập nội dung bạn muốn gửi..."
                                rows="5"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Gửi liên hệ
                        </button>

                        {status === "success" && (
                            <p className="text-green-600 mt-3">✅ Gửi thành công! Cảm ơn bạn đã liên hệ.</p>
                        )}
                        {status === "error" && (
                            <p className="text-red-600 mt-3">❌ Có lỗi xảy ra. Vui lòng thử lại.</p>
                        )}
                    </form>

                    {/* 📍 Thông tin liên hệ bên phải */}
                    <div className="bg-green-100 flex flex-col justify-between p-10 space-y-6">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <Mail className="text-green-700" />
                                <p className="text-gray-700">
                                    Email:{" "}
                                    <a
                                        href="mailto:support@homemarket.vn"
                                        className="text-green-700 font-medium hover:underline"
                                    >
                                        support@homemarket.vn
                                    </a>
                                </p>
                            </div>

                            <div className="flex items-center space-x-3 mb-4">
                                <Phone className="text-green-700" />
                                <p className="text-gray-700">
                                    Hotline:{" "}
                                    <a
                                        href="tel:19001009"
                                        className="text-green-700 font-medium hover:underline"
                                    >
                                        1900 1009
                                    </a>
                                </p>
                            </div>

                            <div className="flex items-center space-x-3 mb-4">
                                <MapPin className="text-green-700" />
                                <p className="text-gray-700">
                                    Địa chỉ: 123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                                </p>
                            </div>
                        </div>

                        <iframe
                            title="Home Market Location"
                            className="rounded-lg shadow-md w-full h-64"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.481547259773!2d106.70175551536974!3d10.77484706215583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46b8dd42e5%3A0xe05909df6483e2de!2zQ8O0bmcgVHkgQ-G7lSBQaOG6oW0gQ8O0bmcgTmdoaeG7h3AgSOG7jWMgUXXhuqNuIFRQLiBIQ00!5e0!3m2!1svi!2s!4v1691314739123!5m2!1svi!2s"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;
