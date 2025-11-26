import React from "react";
import { X, User, Mail, Clock, MessageSquare } from "lucide-react";

const ContactDetailModal = ({ contact, onClose }) => {
    if (!contact) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[90%] md:w-[550px] border border-gray-100 animate-fadeIn overflow-hidden">
                {/* ✅ Header riêng biệt */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-green-700">
                        Chi tiết liên hệ
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-7 h-7 bg-red-500 text-white hover:bg-red-600 rounded-full transition-all"
                        aria-label="Đóng"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ✅ Nội dung */}
                <div className="p-6 space-y-4 text-gray-700">
                    <p className="flex items-start gap-2">
                        <User className="w-5 h-5 text-green-600 mt-0.5" />
                        <span>
                            <strong>Họ và tên:</strong> {contact.name}
                        </span>
                    </p>

                    <p className="flex items-start gap-2">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span>
                            <strong>Email:</strong>{" "}
                            <span className="text-blue-600">{contact.email}</span>
                        </span>
                    </p>

                    <p className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                        <span>
                            <strong>Gửi lúc:</strong>{" "}
                            {new Date(contact.createdAt).toLocaleString("vi-VN")}
                        </span>
                    </p>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                            <strong>Nội dung:</strong>
                        </div>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                            {contact.message}
                        </p>
                    </div>
                </div>

                {/* ✅ Footer */}
                <div className="px-6 py-4 text-right border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactDetailModal;
