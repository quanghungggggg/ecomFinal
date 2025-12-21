// import React from "react";
// import Layout from "../layout";
// import { useHistory } from "react-router-dom"; // ✅ Dùng useHistory thay vì useNavigate

// const Blog = () => {
//     const history = useHistory(); // ✅ Khai báo hook điều hướng cho React Router v5

//     return (
//         <Layout>
//             <div className="bg-green-50 min-h-screen py-20 px-6 md:px-16">
//                 <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10 mt-16">
//                     📰 Bài viết & Tin tức Home Market
//                 </h1>

//                 <div className="grid md:grid-cols-3 gap-8">
//                     {/* Bài viết 1 */}
//                     <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all">
//                         <img
//                             src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
//                             alt="Mẹo chọn rau củ"
//                             className="w-full h-48 object-cover"
//                         />
//                         <div className="p-5">
//                             <h3 className="text-xl font-semibold text-green-700">
//                                 Mẹo chọn rau củ tươi ngon 🥦
//                             </h3>
//                             <p className="text-gray-600 mt-2">
//                                 Khám phá bí quyết chọn rau củ tươi, sạch và giàu dinh dưỡng cho bữa ăn mỗi ngày.
//                             </p>
//                             <button
//                                 onClick={() => history.push(`/blog/1`)} // ✅ sử dụng history.push
//                                 className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                             >
//                                 Đọc thêm
//                             </button>
//                         </div>
//                     </div>

//                     {/* Bài viết 2 */}
//                     <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all">
//                         <img
//                             src="https://images.unsplash.com/photo-1556911220-e15b29be8c03?auto=format&fit=crop&w=800&q=80"
//                             alt="Ăn uống lành mạnh"
//                             className="w-full h-48 object-cover"
//                         />
//                         <div className="p-5">
//                             <h3 className="text-xl font-semibold text-green-700">
//                                 Ăn uống lành mạnh cùng Home Market 🥗
//                             </h3>
//                             <p className="text-gray-600 mt-2">
//                                 Cân bằng dinh dưỡng và chọn thực phẩm an toàn — bí quyết để sống khỏe mỗi ngày.
//                             </p>
//                             <button
//                                 onClick={() => history.push(`/blog/2`)}
//                                 className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                             >
//                                 Đọc thêm
//                             </button>
//                         </div>
//                     </div>

//                     {/* Bài viết 3 */}
//                     <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all">
//                         <img
//                             src="https://images.unsplash.com/photo-1615486364050-6e749b9df7c4?auto=format&fit=crop&w=800&q=80"
//                             alt="Trái cây tốt cho sức khỏe"
//                             className="w-full h-48 object-cover"
//                         />
//                         <div className="p-5">
//                             <h3 className="text-xl font-semibold text-green-700">
//                                 5 lợi ích tuyệt vời khi ăn trái cây 🍎
//                             </h3>
//                             <p className="text-gray-600 mt-2">
//                                 Trái cây giúp tăng đề kháng, đẹp da và bảo vệ sức khỏe — đừng quên bổ sung mỗi ngày!
//                             </p>
//                             <button
//                                 onClick={() => history.push(`/blog/3`)}
//                                 className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                             >
//                                 Đọc thêm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default Blog;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../layout";
import { useHistory } from "react-router-dom";

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`) // ✅ gọi API từ backend
            .then(res => setBlogs(res.data))
            .catch(err => console.error("Error fetching blogs:", err));
    }, []);

    return (
        <Layout>
            <div className="bg-green-50 min-h-screen py-20 px-6 md:px-16">
                <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10 mt-16">
                    📰 Bài viết & Tin tức Home Market
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map(blog => (
                        <div
                            key={blog._id}
                            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all"
                        >
                            <img
                                src={blog.image || "https://via.placeholder.com/800x400?text=No+Image"}
                                alt={blog.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-5">
                                <h3 className="text-xl font-semibold text-green-700">{blog.title}</h3>
                                <p className="text-gray-600 mt-2">{blog.shortDesc}</p>
                                <button
                                    onClick={() => history.push(`/blog/${blog._id}`)}
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Đọc thêm
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Blog;
