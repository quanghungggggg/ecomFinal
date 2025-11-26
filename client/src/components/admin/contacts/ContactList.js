import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, Trash2, Loader2 } from "lucide-react"; // npm install lucide-react
import ContactDetailModal from "./ContactDetailModal";
import AdminLayout from "../layout";

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const fetchContacts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/contact");
            setContacts(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách liên hệ:", error);
            toast.error("Không thể tải danh sách liên hệ!");
        } finally {
            setLoading(false);
        }
    };

    const deleteContact = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/contact/${id}`);
            setContacts((prev) => prev.filter((c) => c._id !== id));
            toast.success("Xóa liên hệ thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Không thể xóa liên hệ!");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <AdminLayout>
            <div className="p-8 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h1 className="text-3xl font-bold text-green-700 tracking-tight">
                        💬 Quản lý liên hệ khách hàng
                    </h1>
                    <p className="text-gray-500 mt-2 md:mt-0">
                        Tổng cộng:{" "}
                        <span className="font-semibold text-green-600">
                            {contacts.length}
                        </span>{" "}
                        liên hệ
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-3" />
                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Không có liên hệ nào.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-gray-700">
                                <thead className="bg-green-600 text-white text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Họ và tên</th>
                                        <th className="px-6 py-4 text-left">Email</th>
                                        <th className="px-6 py-4 text-left">Tin nhắn</th>
                                        <th className="px-6 py-4 text-left">Ngày gửi</th>
                                        <th className="px-6 py-4 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contacts.map((contact) => (
                                        <tr
                                            key={contact._id}
                                            className="hover:bg-green-50 transition-all duration-150"
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                {contact.name || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-blue-600">
                                                {contact.email}
                                            </td>
                                            <td className="px-6 py-4 truncate max-w-[280px]">
                                                {contact.message}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(contact.createdAt).toLocaleString("vi-VN")}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => setSelected(contact)}
                                                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" /> Xem
                                                    </button>
                                                    <button
                                                        onClick={() => deleteContact(contact._id)}
                                                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal chi tiết */}
                {selected && (
                    <ContactDetailModal contact={selected} onClose={() => setSelected(null)} />
                )}
            </div>
        </AdminLayout>
    );
};

export default ContactList;
