// import React, { Fragment, useContext, useEffect, useState } from "react";
// import { deleteProduct } from "./FetchApi";
// import moment from "moment";
// import { ProductContext } from "./index";
// import { fetchData } from "./Actions";

// const apiURL = process.env.REACT_APP_API_URL;

// const AllProduct = (props) => {
//   const { data, dispatch } = useContext(ProductContext);
//   const { products } = data;

//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 8;
//   useEffect(() => {
//     fetchData(dispatch);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage]);
//   let currentProducts = [];
//   if (products) {
//     const indexOfLastProduct = currentPage * productsPerPage;
//     const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//     currentProducts = products.slice(
//       indexOfFirstProduct,
//       indexOfLastProduct
//     );
//   }
//   const deleteProductReq = async (pId) => {
//     try {
//       let deleteC = await deleteProduct(pId);
//       if (deleteC.error) {
//         console.log(deleteC.error);
//       } else if (deleteC.success) {
//         console.log(deleteC.success);
//         // Show alert
//         window.alert("Product deleted successfully!");
//         // Reload the page
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };


//   /* This method call the editmodal & dispatch product context */
//   const editProduct = (pId, product, type) => {
//     if (type) {
//       dispatch({
//         type: "editProductModalOpen",
//         product: { ...product, pId: pId },
//       });
//     }
//   };

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <svg
//           className="w-12 h-12 animate-spin text-gray-600"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//           ></path>
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <Fragment>
//       <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
//         <table className="table-auto border w-full my-2">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border">Tên</th>
//               <th className="px-4 py-2 border">Thương hiệu</th>
//               <th className="px-4 py-2 border">Hình ảnh</th>
//               <th className="px-4 py-2 border">Trạng thái</th>
//               <th className="px-4 py-2 border">Số lượng</th>
//               <th className="px-4 py-2 border">Danh mục</th>
//               <th className="px-4 py-2 border">Giảm giá</th>
//               <th className="px-4 py-2 border">Ngày tạo</th>
//               <th className="px-4 py-2 border">Ngày cập nhật</th>
//               <th className="px-4 py-2 border">Chức năng</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentProducts && currentProducts.length > 0 ? (
//               currentProducts.map((item, key) => (
//                 <ProductTable
//                   product={item}
//                   editProduct={(pId, product, type) =>
//                     editProduct(pId, product, type)
//                   }
//                   deleteProduct={(pId) => deleteProductReq(pId)}
//                   key={key}
//                 />
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="10" className="text-xl text-center font-semibold py-8">
//                   Không có sản phẩm
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {/* Pagination and total products info */}
//         <div className="flex justify-center mt-4">
//           {Array.from({
//             length: Math.ceil(products?.length / productsPerPage),
//           }).map((_, index) => (
//             <button
//               key={index}
//               className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
//                 }`}
//               onClick={() => setCurrentPage(index + 1)}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//         <div className="text-sm text-gray-600 mt-2">
//           Tổng có {products && products.length} sản phẩm
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// /* Single Product Component */
// const ProductTable = ({ product, deleteProduct, editProduct }) => {
//   return (
//     <Fragment>
//       <tr>
//         <td className="p-2 text-left">
//           {product.pName}
//         </td>
//         <td className="p-2 text-left">
//           {product.pBrand || "No Brand"} {/* Display brand, or 'No Brand' if none */}
//         </td>
//         <td className="p-2 text-center">
//           <img
//             className="w-12 h-12 object-cover object-center"
//             src={product.pImages[0].url}
//             alt="pic"
//           />
//         </td>
//         <td className="p-2 text-center">
//           {product.pStatus === "Active" ? (
//             <span className="bg-green-200 rounded-full text-center text-xs px-2 font-semibold">
//               {product.pStatus}
//             </span>
//           ) : (
//             <span className="bg-red-200 rounded-full text-center text-xs px-2 font-semibold">
//               {product.pStatus}
//             </span>
//           )}
//         </td>
//         <td className="p-2 text-center">{product.pQuantity}</td>
//         <td className="p-2 text-center">{product.pCategory.cName}</td>
//         <td className="p-2 text-center">{product.pOffer}</td>
//         <td className="p-2 text-center">
//           {moment(product.createdAt).format("lll")}
//         </td>
//         <td className="p-2 text-center">
//           {moment(product.updatedAt).format("lll")}
//         </td>
//         <td className="p-2 flex items-center justify-center">
//           <span
//             onClick={(e) => editProduct(product._id, product, true)}
//             className="cursor-pointer hover:bg-gray-200 rounded-lg p-2 mx-1"
//           >
//             <svg
//               className="w-6 h-6 fill-current text-green-500"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
//               <path
//                 fillRule="evenodd"
//                 d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </span>
//           <span
//             onClick={(e) => deleteProduct(product._id)}
//             className="cursor-pointer hover:bg-gray-200 rounded-lg p-2 mx-1"
//           >
//             <svg
//               className="w-6 h-6 fill-current text-red-500"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </span>
//         </td>
//       </tr>
//     </Fragment>
//   );
// };

// export default AllProduct;
import React, { Fragment, useContext, useEffect, useState } from "react";
import { deleteProduct } from "./FetchApi";
import moment from "moment";
import { ProductContext } from "./index";
import { fetchData } from "./Actions";

const AllProduct = () => {
  const { data, dispatch } = useContext(ProductContext);
  const { products } = data;

  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch, currentPage]);

  let currentProducts = [];
  if (products) {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  }

  const deleteProductReq = async (pId) => {
    try {
      const del = await deleteProduct(pId);
      if (del.success) {
        alert("Xóa sản phẩm thành công!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const editProduct = (pId, product, type) => {
    if (type) {
      dispatch({
        type: "editProductModalOpen",
        product: { ...product, pId },
      });
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center p-10 text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : (
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-green-600 text-white text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Tên</th>
                  <th className="px-4 py-3 text-left">Thương hiệu</th>
                  <th className="px-4 py-3 text-center">Hình ảnh</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-center">Số lượng</th>
                  <th className="px-4 py-3 text-center">Danh mục</th>
                  <th className="px-4 py-3 text-center">Giảm giá</th>
                  <th className="px-4 py-3 text-center">Ngày tạo</th>
                  <th className="px-4 py-3 text-center">Ngày cập nhật</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentProducts && currentProducts.length > 0 ? (
                  currentProducts.map((item, key) => (
                    <ProductRow
                      key={key}
                      product={item}
                      editProduct={editProduct}
                      deleteProduct={deleteProductReq}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-8 text-gray-500 font-medium"
                    >
                      Không có sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({
            length: Math.ceil(products?.length / productsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${currentPage === index + 1
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-600 mt-3 text-center">
          Tổng: {products?.length || 0} sản phẩm
        </div>
      </div>
    </Fragment>
  );
};

const ProductRow = ({ product, deleteProduct, editProduct }) => {
  return (
    <tr className="hover:bg-green-50 transition-all">
      <td className="px-4 py-3 font-medium">{product.pName}</td>
      <td className="px-4 py-3">{product.pBrand || "—"}</td>
      <td className="px-4 py-3 text-center">
        <img
          src={product.pImages[0]?.url}
          alt="pic"
          className="w-12 h-12 object-cover rounded-lg shadow-sm"
        />
      </td>
      <td className="px-4 py-3 text-center">
        {product.pStatus === "Active" ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
            Disabled
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-center">{product.pQuantity}</td>
      <td className="px-4 py-3 text-center">{product.pCategory?.cName}</td>
      <td className="px-4 py-3 text-center">{product.pOffer}%</td>
      <td className="px-4 py-3 text-center">
        {moment(product.createdAt).format("DD/MM/YYYY")}
      </td>
      <td className="px-4 py-3 text-center">
        {moment(product.updatedAt).format("DD/MM/YYYY")}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => editProduct(product._id, product, true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-md text-sm"
          >
            Sửa
          </button>
          <button
            onClick={() => deleteProduct(product._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-md text-sm"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AllProduct;
