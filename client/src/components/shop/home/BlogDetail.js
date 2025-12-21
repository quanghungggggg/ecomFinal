// import React from "react";
// import Layout from "../layout";
// import { useParams } from "react-router-dom";

// const blogData = [
//     {
//         id: 1,
//         title: "Mẹo chọn rau củ tươi ngon 🥦",
//         img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
//         content: `
//       Việc chọn rau củ tươi ngon là bước đầu tiên để đảm bảo bữa ăn giàu dinh dưỡng.
//       🌱 Hãy chú ý đến màu sắc tươi sáng, phần lá xanh không bị úa vàng, thân rau giòn và không dập nát.
//       🥕 Các loại củ như cà rốt, củ cải nên có bề mặt nhẵn, chắc tay, không bị nứt.
//       Khi mua, ưu tiên chọn sản phẩm địa phương theo mùa để đảm bảo độ tươi và giá cả hợp lý.
//     `
//     },
//     {
//         id: 2,
//         title: "Ăn uống lành mạnh cùng Home Market 🥗",
//         img: "https://images.unsplash.com/photo-1556911220-e15b29be8c03?auto=format&fit=crop&w=800&q=80",
//         content: `
//       Ăn uống lành mạnh không chỉ giúp bạn duy trì cân nặng mà còn cải thiện sức khỏe tinh thần.
//       🥬 Hãy ăn đa dạng thực phẩm, cân bằng giữa protein, chất béo và tinh bột.
//       🚫 Hạn chế đồ chiên rán, nước ngọt có gas và tăng cường rau củ quả mỗi ngày.
//       Home Market luôn mang đến thực phẩm sạch và an toàn cho sức khỏe gia đình bạn.
//     `
//     },
//     {
//         id: 3,
//         title: "5 lợi ích tuyệt vời khi ăn trái cây 🍎",
//         img: "https://images.unsplash.com/photo-1615486364050-6e749b9df7c4?auto=format&fit=crop&w=800&q=80",
//         content: `
//       Trái cây là nguồn cung cấp vitamin và khoáng chất tự nhiên tuyệt vời.
//       🍊 Giúp tăng cường hệ miễn dịch, đẹp da, hỗ trợ tiêu hóa và giảm stress.
//       🍌 Mỗi ngày, bạn nên bổ sung ít nhất 2-3 loại trái cây tươi để cân bằng dinh dưỡng.
//       Home Market luôn đảm bảo nguồn cung trái cây sạch, tươi ngon và giá hợp lý.
//     `
//     }
// ];

// const BlogDetail = () => {
//     const { id } = useParams();
//     const blog = blogData.find((b) => b.id === parseInt(id));

//     if (!blog) {
//         return (
//             <Layout>
//                 <div className="text-center py-20">
//                     <h2 className="text-3xl font-bold text-red-600">Bài viết không tồn tại!</h2>
//                 </div>
//             </Layout>
//         );
//     }

//     return (
//         <Layout>
//             <div className="min-h-screen bg-green-50 py-16 px-6 md:px-24">
//                 <h1 className="text-4xl font-bold text-green-700 text-center mb-10">{blog.title}</h1>
//                 <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
//                     <img
//                         src={blog.img}
//                         alt={blog.title}
//                         className="w-full h-96 object-cover rounded-lg mb-8"
//                     />
//                     <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                         {blog.content}
//                     </p>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default BlogDetail;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../layout";

const BlogDetail = () => {
    const { id } = useParams(); // 👈 lấy id từ URL
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`)
            .then((res) => {
                setBlog(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching blog detail:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <p className="text-center mt-10 text-gray-500">Đang tải bài viết...</p>
            </Layout>
        );
    }

    if (!blog) {
        return (
            <Layout>
                <p className="text-center mt-10 text-red-600">Không tìm thấy bài viết!</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-10">
                <img
                    src={blog.image || "https://via.placeholder.com/800x400?text=No+Image"}
                    alt={blog.title}
                    className="w-full h-80 object-cover rounded-lg shadow-md mb-6"
                />
                <h1 className="text-3xl font-bold text-green-700 mb-4">{blog.title}</h1>
                <p className="text-gray-600 mb-6">{blog.shortDesc}</p>
                <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {blog.content}
                </div>
            </div>
        </Layout>
    );
};

export default BlogDetail;

