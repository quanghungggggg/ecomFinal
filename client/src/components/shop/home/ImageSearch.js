import React, { useState } from "react";
import axios from "axios";

const ImageSearch = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSearch = async () => {
        if (!image) return alert("Vui lòng chọn ảnh!");
        setLoading(true);
        const formData = new FormData();
        formData.append("file", image);

        try {
            const res = await axios.post("http://localhost:5000/api/image-search", formData);
            const { productId } = res.data;

            if (productId) {
                window.location.href = `/products/${productId}`;
            } else {
                alert("Không tìm thấy sản phẩm phù hợp 😢");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi tìm kiếm hình ảnh!");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-1 text-md md:text-lg hover:text-green-700 ml-2"
            >
                <span>📸 Tìm kiếm bằng hình ảnh</span>
            </button>

            {open && (
                <div className="absolute bg-green-50 border border-green-300 rounded-lg shadow-md p-3 mt-2 w-64 z-50 right-0">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-700 mb-2"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-32 h-32 object-cover mx-auto mb-2 rounded border border-green-200"
                        />
                    )}
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
                    >
                        {loading ? "Đang tìm..." : "Tìm sản phẩm"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageSearch;
