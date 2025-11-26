// import React, { Fragment, useContext, useState, useEffect } from "react";
// import { ProductContext } from "./index";
// import { createProduct, getAllProduct_Admin } from "./FetchApi";
// import { getAllCategory } from "../categories/FetchApi";
// import CreatableSelect from "react-select/creatable";

// // Danh sách thương hiệu mặc định
// const Brand = [
//   "Biên Hòa",
//   "Visaco",
//   "Ajinomoto",
//   "Chinsu",
//   "Guyumi",
//   "Basalco",
//   "Knorr",
//   "Nam Ngư",
//   "Bạc Liêu",
//   "Happi Koki",
//   "Đầu Bếp Tôm",
//   "Simply",
//   "Tường An",
//   "Việt Hàn",
//   "Trần Gia",
//   "NT Pearly Food",
// ];

// const AddProductDetail = ({ categories }) => {
//   const { data, dispatch } = useContext(ProductContext);

//   const alert = (msg, type) => (
//     <div className={`bg-${type}-200 py-2 px-4 w-full`}>{msg}</div>
//   );

//   const [fData, setFdata] = useState({
//     pName: "",
//     pDescription: "",
//     pStatus: "Active",
//     pImage: null,
//     pCategory: "",
//     pPrice: "",
//     pOffer: 0,
//     pBrand: "",
//     pQuantity: "",
//     success: false,
//     error: false,
//   });

//   // Danh sách brand options dùng cho react-select
//   const [brandOptions, setBrandOptions] = useState(
//     Brand.map((b) => ({ value: b, label: b }))
//   );

//   const fetchData = async () => {
//     let responseData = await getAllProduct_Admin();
//     setTimeout(() => {
//       if (responseData && responseData.Products) {
//         dispatch({
//           type: "fetchProductsAndChangeState",
//           payload: responseData.Products,
//         });
//       }
//     }, 1000);
//   };

//   const submitForm = async (e) => {
//     e.preventDefault();
//     e.target.reset();

//     if (!fData.pImage) {
//       setFdata({ ...fData, error: "Please upload at least 2 image" });
//       setTimeout(() => {
//         setFdata({ ...fData, error: false });
//       }, 2000);
//       return;
//     }

//     try {
//       let responseData = await createProduct(fData);
//       if (responseData.success) {
//         fetchData();
//         setFdata({
//           ...fData,
//           pName: "",
//           pDescription: "",
//           pImage: "",
//           pStatus: "Active",
//           pCategory: "",
//           pPrice: "",
//           pQuantity: "",
//           pOffer: 0,
//           pBrand: "",
//           success: responseData.success,
//           error: false,
//         });
//         setTimeout(() => {
//           setFdata({
//             ...fData,
//             success: false,
//             error: false,
//           });
//         }, 2000);
//       } else if (responseData.error) {
//         setFdata({ ...fData, success: false, error: responseData.error });
//         setTimeout(() => {
//           return setFdata({ ...fData, error: false, success: false });
//         }, 2000);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Fragment>
//       {/* Black Overlay */}
//       <div
//         onClick={() => dispatch({ type: "addProductModal", payload: false })}
//         className={`${data.addProductModal ? "" : "hidden"
//           } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
//       />
//       {/* End Black Overlay */}

//       {/* Modal Start */}
//       <div
//         className={`${data.addProductModal ? "" : "hidden"
//           } fixed inset-0 flex items-center z-30 justify-center overflow-auto`}
//       >
//         <div className="mt-32 md:mt-0 relative bg-white w-11/12 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 px-4 py-4 md:px-8">
//           <div className="flex items-center justify-between w-full pt-4">
//             <span className="text-left font-semibold text-2xl tracking-wider">
//               Thêm Sản Phẩm
//             </span>
//             <span
//               style={{ background: "#303031" }}
//               onClick={() =>
//                 dispatch({ type: "addProductModal", payload: false })
//               }
//               className="cursor-pointer text-gray-100 py-2 px-2 rounded-full"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </span>
//           </div>

//           {fData.error ? alert(fData.error, "red") : ""}
//           {fData.success ? alert(fData.success, "green") : ""}

//           <form className="w-full" onSubmit={(e) => submitForm(e)}>
//             {/* Tên và Giá */}
//             <div className="flex space-x-1 py-4">
//               <div className="w-1/2 flex flex-col space-y-1 space-x-1">
//                 <label htmlFor="name">Tên *</label>
//                 <input
//                   value={fData.pName}
//                   onChange={(e) =>
//                     setFdata({
//                       ...fData,
//                       error: false,
//                       success: false,
//                       pName: e.target.value,
//                     })
//                   }
//                   className="px-4 py-2 border focus:outline-none"
//                   type="text"
//                 />
//               </div>

//               <div className="w-1/2 flex flex-col space-y-1 space-x-1">
//                 <label htmlFor="price">Mức giá *</label>
//                 <input
//                   value={fData.pPrice}
//                   onChange={(e) => {
//                     const inputPrice = e.target.value;
//                     let newPrice = inputPrice < 0 ? 0 : inputPrice;
//                     setFdata({
//                       ...fData,
//                       error: false,
//                       success: false,
//                       pPrice: newPrice,
//                     });
//                   }}
//                   type="number"
//                   className="px-4 py-2 border focus:outline-none"
//                   id="price"
//                 />
//               </div>
//             </div>

//             {/* Mô tả */}
//             <div className="flex flex-col space-y-2">
//               <label htmlFor="description">Mô tả *</label>
//               <textarea
//                 value={fData.pDescription}
//                 onChange={(e) =>
//                   setFdata({
//                     ...fData,
//                     error: false,
//                     success: false,
//                     pDescription: e.target.value,
//                   })
//                 }
//                 className="px-4 py-2 border focus:outline-none"
//                 cols={5}
//                 rows={2}
//               />
//             </div>

//             {/* Upload hình ảnh */}
//             <div className="flex flex-col mt-4">
//               <label htmlFor="image">Hình ảnh *</label>
//               <span className="text-gray-600 text-xs">
//                 Cần ít nhất 1 hình ảnh
//               </span>
//               <input
//                 onChange={(e) =>
//                   setFdata({
//                     ...fData,
//                     error: false,
//                     success: false,
//                     pImage: [...e.target.files],
//                   })
//                 }
//                 type="file"
//                 accept=".jpg, .jpeg, .png"
//                 className="px-4 py-2 border focus:outline-none"
//                 id="image"
//                 multiple
//               />
//             </div>

//             {/* Danh mục & Trạng thái */}
//             <div className="flex space-x-1 py-4">
//               <div className="w-1/2 flex flex-col space-y-1">
//                 <label htmlFor="status">Trạng thái *</label>
//                 <select
//                   value={fData.pStatus}
//                   onChange={(e) =>
//                     setFdata({
//                       ...fData,
//                       error: false,
//                       success: false,
//                       pStatus: e.target.value,
//                     })
//                   }
//                   className="px-4 py-2 border focus:outline-none"
//                 >
//                   <option value="Active">Active</option>
//                   <option value="Disabled">Disabled</option>
//                 </select>
//               </div>

//               <div className="w-1/2 flex flex-col space-y-1">
//                 <label htmlFor="status">Danh mục *</label>
//                 <select
//                   value={fData.pCategory}
//                   onChange={(e) =>
//                     setFdata({
//                       ...fData,
//                       error: false,
//                       success: false,
//                       pCategory: e.target.value,
//                     })
//                   }
//                   className="px-4 py-2 border focus:outline-none"
//                 >
//                   <option disabled value="">
//                     Chọn danh mục
//                   </option>
//                   {categories.length > 0
//                     ? categories.map((elem) => (
//                       <option value={elem._id} key={elem._id}>
//                         {elem.cName}
//                       </option>
//                     ))
//                     : ""}
//                 </select>
//               </div>
//             </div>

//             {/* Số lượng, Giảm giá, Thương hiệu */}
//             <div className="flex space-x-1 py-4">
//               <div className="w-1/2 flex flex-col space-y-1">
//                 <label htmlFor="quantity">Số lượng *</label>
//                 <input
//                   value={fData.pQuantity}
//                   onChange={(e) => {
//                     const val = e.target.value < 0 ? 0 : e.target.value;
//                     setFdata({
//                       ...fData,
//                       pQuantity: val,
//                       error: false,
//                       success: false,
//                     });
//                   }}
//                   type="number"
//                   className="px-4 py-2 border focus:outline-none"
//                   id="quantity"
//                 />
//               </div>

//               <div className="w-1/2 flex flex-col space-y-1">
//                 <label htmlFor="offer">Giảm giá (%) *</label>
//                 <input
//                   value={fData.pOffer}
//                   onChange={(e) => {
//                     const val = e.target.value < 0 ? 0 : e.target.value;
//                     setFdata({
//                       ...fData,
//                       pOffer: val,
//                       error: false,
//                       success: false,
//                     });
//                   }}
//                   type="number"
//                   className="px-4 py-2 border focus:outline-none"
//                   id="offer"
//                 />
//               </div>
//             </div>

//             {/* ✅ Thương hiệu (CreatableSelect) */}
//             <div className="flex flex-col space-y-1 py-2">
//               <label htmlFor="Brand">Thương hiệu *</label>
//               <CreatableSelect
//                 id="Brand"
//                 placeholder="Nhập hoặc chọn thương hiệu..."
//                 isClearable
//                 options={brandOptions}
//                 value={
//                   fData.pBrand
//                     ? { value: fData.pBrand, label: fData.pBrand }
//                     : null
//                 }
//                 onChange={(newValue) => {
//                   // Nếu người dùng nhập mới thương hiệu
//                   if (
//                     newValue &&
//                     !brandOptions.find((b) => b.value === newValue.value)
//                   ) {
//                     setBrandOptions((prev) => [
//                       ...prev,
//                       { value: newValue.value, label: newValue.value },
//                     ]);
//                   }

//                   setFdata({
//                     ...fData,
//                     error: false,
//                     success: false,
//                     pBrand: newValue ? newValue.value : "",
//                   });
//                 }}
//                 styles={{
//                   control: (provided) => ({
//                     ...provided,
//                     borderColor: "#d1d5db",
//                     boxShadow: "none",
//                     "&:hover": { borderColor: "#9ca3af" },
//                   }),
//                   placeholder: (provided) => ({
//                     ...provided,
//                     color: "#6b7280",
//                   }),
//                 }}
//               />
//             </div>

//             <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
//               <button
//                 style={{ background: "#303031" }}
//                 type="submit"
//                 className="rounded-full bg-gray-800 text-gray-100 text-lg font-medium py-2"
//               >
//                 Tạo Sản Phẩm
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// // -------- Modal wrapper để fetch danh mục --------
// const AddProductModal = () => {
//   const [allCat, setAllCat] = useState([]);

//   const fetchCategoryData = async () => {
//     let responseData = await getAllCategory();
//     if (responseData.Categories) {
//       setAllCat(
//         responseData.Categories.filter(
//           (category) => category.cParentCategory !== null
//         ).reverse()
//       );
//     }
//   };

//   useEffect(() => {
//     fetchCategoryData();
//   }, []);

//   return (
//     <Fragment>
//       <AddProductDetail categories={allCat} />
//     </Fragment>
//   );
// };

// export default AddProductModal;
import React, { Fragment, useContext, useState, useEffect } from "react";
import { X } from "lucide-react";
import { ProductContext } from "./index";
import { createProduct, getAllProduct_Admin } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";
import CreatableSelect from "react-select/creatable";

const Brand = [
  "Biên Hòa",
  "Visaco",
  "Ajinomoto",
  "Chinsu",
  "Guyumi",
  "Basalco",
  "Knorr",
  "Nam Ngư",
  "Bạc Liêu",
  "Happi Koki",
  "Simply",
  "Tường An",
  "Việt Hàn",
  "Trần Gia",
  "NT Pearly Food",
];

const AddProductDetail = ({ categories }) => {
  const { data, dispatch } = useContext(ProductContext);
  const [fData, setFdata] = useState({
    pName: "",
    pDescription: "",
    pStatus: "Active",
    pImage: null,
    pCategory: "",
    pPrice: "",
    pOffer: 0,
    pBrand: "",
    pQuantity: "",
    success: false,
    error: false,
  });

  const [brandOptions] = useState(
    Brand.map((b) => ({ value: b, label: b }))
  );

  const fetchData = async () => {
    const res = await getAllProduct_Admin();
    if (res?.Products) {
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: res.Products,
      });
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!fData.pImage) return alert("Vui lòng chọn ít nhất 1 hình ảnh!");
    const res = await createProduct(fData);
    if (res.success) {
      fetchData();
      alert("Thêm sản phẩm thành công!");
      dispatch({ type: "addProductModal", payload: false });
    } else {
      alert("Thêm thất bại!");
    }
  };

  return (
    <Fragment>
      {data.addProductModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] md:w-[600px] border border-gray-100 animate-fadeIn overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-green-700">Thêm sản phẩm</h2>
              <button
                onClick={() =>
                  dispatch({ type: "addProductModal", payload: false })
                }
                className="flex items-center justify-center w-7 h-7 bg-red-500 text-white hover:bg-red-600 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-sm">Tên *</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none"
                    value={fData.pName}
                    onChange={(e) =>
                      setFdata({ ...fData, pName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-sm">Giá *</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none"
                    value={fData.pPrice}
                    onChange={(e) =>
                      setFdata({ ...fData, pPrice: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-sm">Mô tả *</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none"
                  rows="2"
                  value={fData.pDescription}
                  onChange={(e) =>
                    setFdata({ ...fData, pDescription: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="font-medium text-sm">Hình ảnh *</label>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFdata({ ...fData, pImage: [...e.target.files] })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-sm">Danh mục *</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none"
                    value={fData.pCategory}
                    onChange={(e) =>
                      setFdata({ ...fData, pCategory: e.target.value })
                    }
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.cName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-sm">Thương hiệu *</label>
                  <CreatableSelect
                    placeholder="Chọn hoặc nhập..."
                    isClearable
                    options={brandOptions}
                    value={
                      fData.pBrand
                        ? { value: fData.pBrand, label: fData.pBrand }
                        : null
                    }
                    onChange={(val) =>
                      setFdata({ ...fData, pBrand: val?.value || "" })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-sm">Số lượng *</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none"
                    value={fData.pQuantity}
                    onChange={(e) =>
                      setFdata({ ...fData, pQuantity: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-medium text-sm">Giảm giá (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none"
                    value={fData.pOffer}
                    onChange={(e) =>
                      setFdata({ ...fData, pOffer: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-medium text-sm">Trạng thái *</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none"
                    value={fData.pStatus}
                    onChange={(e) =>
                      setFdata({ ...fData, pStatus: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 text-right">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
                >
                  Tạo sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const AddProductModal = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategory().then((res) => {
      if (res?.Categories) setCategories(res.Categories);
    });
  }, []);

  return <AddProductDetail categories={categories} />;
};

export default AddProductModal;
