import React from "react";

const Blog = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">
                📰 Bài viết & Tin tức Home Market
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bài viết 1 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                    <img
                        src="https://cdn.tgdd.vn/2023/07/CookProduct/raucuqua-1200x628.jpg"
                        alt="Mẹo chọn rau củ tươi"
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-green-700">
                            Mẹo chọn rau củ tươi ngon 🥦
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Khám phá bí quyết chọn rau củ tươi, sạch và giàu dinh dưỡng cho
                            bữa ăn mỗi ngày.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Đọc thêm
                        </button>
                    </div>
                </div>

                {/* Bài viết 2 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                    <img
                        src="https://cdn.tgdd.vn/Files/2022/12/10/1491964/an-uong-lanh-manh-voi-7-nguyen-tac-don-gian-202212101433243291.jpg"
                        alt="Ăn uống lành mạnh"
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-green-700">
                            Ăn uống lành mạnh cùng Home Market 🥗
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Cân bằng dinh dưỡng và chọn thực phẩm an toàn — bí quyết để sống
                            khỏe mỗi ngày.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Đọc thêm
                        </button>
                    </div>
                </div>

                {/* Bài viết 3 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                    <img
                        src="https://cdn.tgdd.vn/Files/2021/09/10/1381663/5-loi-ich-bat-ngo-tu-viec-an-trai-cay-hang-ngay-202109101433579307.jpg"
                        alt="Lợi ích của trái cây"
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-green-700">
                            5 lợi ích tuyệt vời khi ăn trái cây 🍎
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Trái cây giúp tăng đề kháng, đẹp da và bảo vệ sức khỏe — đừng quên
                            bổ sung mỗi ngày!
                        </p>
                        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Đọc thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
