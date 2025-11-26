import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { getBrainTreeToken, getPaymentProcess } from "./FetchApi";
import { fetchData, fetchbrainTree, pay } from "./Action";

import DropIn from "braintree-web-drop-in-react";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    deliveryDate: "",
    deliveryTime: "",
    error: false,
    success: false,
    clientToken: null,
    instance: {},
  });

  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    fetchbrainTree(getBrainTreeToken, setState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ FIXED: chọn ngày nhận hàng (không cho chọn ngày quá khứ)
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      setState({
        ...state,
        deliveryDate: "",
        error: "Ngày nhận đã qua đi",
      });
    } else {
      setState({
        ...state,
        deliveryDate: e.target.value,
        error: false,
      });
    }
  };

  // ✅ FIXED: chọn giờ nhận hàng dự kiến
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value; // dạng "HH:MM"
    const current = new Date();

    // Giới hạn khung giờ hợp lệ: 08:00–20:00
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const selectedMinutes = hours * 60 + minutes;
    const eightAM = 8 * 60;
    const eightPM = 20 * 60;

    if (selectedMinutes < eightAM || selectedMinutes > eightPM) {
      setState({
        ...state,
        deliveryTime: "",
        error: "Giờ nhận phải nằm trong khoảng 08:00 đến 20:00",
      });
      return;
    }

    // Nếu chọn ngày hôm nay → không được chọn giờ trong quá khứ
    if (state.deliveryDate) {
      const selectedDate = new Date(state.deliveryDate);
      const today = new Date();
      if (
        selectedDate.getFullYear() === today.getFullYear() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getDate() === today.getDate()
      ) {
        const nowMinutes = today.getHours() * 60 + today.getMinutes();
        if (selectedMinutes <= nowMinutes) {
          setState({
            ...state,
            deliveryTime: "",
            error: "Không thể chọn giờ đã qua trong hôm nay",
          });
          return;
        }
      }
    }

    // Nếu hợp lệ
    setState({
      ...state,
      deliveryTime: selectedTime,
      error: false,
    });
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Vui lòng đợi
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2">Đơn hàng</div>

        <div className="flex flex-col md:flex md:space-x-2 md:flex-row">
          <div className="md:w-1/2">
            <CheckoutProducts products={data.cartProduct} />
          </div>

          <div className="w-full order-first md:order-last md:w-1/2">
            {state.clientToken !== null ? (
              <Fragment>
                <div
                  onBlur={(e) => setState({ ...state, error: false })}
                  className="p-4 md:p-8"
                >
                  {state.error ? (
                    <div className="bg-red-200 py-2 px-4 rounded mb-2">
                      {state.error}
                    </div>
                  ) : (
                    ""
                  )}

                  {/* Địa chỉ */}
                  <div className="flex flex-col py-2">
                    <label htmlFor="address" className="pb-2">
                      Địa chỉ giao hàng
                    </label>
                    <input
                      value={state.address}
                      onChange={(e) =>
                        setState({
                          ...state,
                          address: e.target.value,
                          error: false,
                        })
                      }
                      type="text"
                      id="address"
                      className="border px-4 py-2"
                      placeholder="Nhập địa chỉ..."
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="flex flex-col py-2 mb-2">
                    <label htmlFor="phone" className="pb-2">
                      Số điện thoại
                    </label>
                    <input
                      value={state.phone}
                      onChange={(e) =>
                        setState({
                          ...state,
                          phone: e.target.value,
                          error: false,
                        })
                      }
                      type="number"
                      id="phone"
                      className="border px-4 py-2"
                      placeholder="+84"
                    />
                  </div>

                  {/* Ngày nhận hàng */}
                  <div className="flex flex-col py-2 mb-2">
                    <label htmlFor="deliveryDate" className="pb-2">
                      Chọn ngày nhận hàng dự kiến
                    </label>
                    <input
                      value={state.deliveryDate}
                      onChange={handleDateChange}
                      type="date"
                      id="deliveryDate"
                      className="border px-4 py-2"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Giờ nhận hàng */}
                  <div className="flex flex-col py-2 mb-2">
                    <label htmlFor="deliveryTime" className="pb-2">
                      Chọn giờ nhận hàng dự kiến
                    </label>
                    <input
                      value={state.deliveryTime}
                      onChange={handleTimeChange}
                      type="time"
                      id="deliveryTime"
                      className="border px-4 py-2"
                      min="08:00"
                      max="20:00"
                    />
                  </div>

                  {/* Thanh toán */}
                  <DropIn
                    options={{
                      authorization: state.clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => (state.instance = instance)}
                  />

                  <div className="font-semibold text-gray-600 text-sm mb-4">
                    Tổng giá: {totalCost()}.000 VND
                  </div>

                  {paymentError && (
                    <div className="bg-red-200 py-2 px-4 rounded mb-4">
                      {paymentError}
                    </div>
                  )}

                  <div
                    onClick={(e) =>
                      pay(
                        data,
                        dispatch,
                        state,
                        setState,
                        getPaymentProcess,
                        totalCost,
                        history
                      )
                    }
                    className="w-full px-4 py-2 text-center text-white font-semibold cursor-pointer"
                    style={{ background: "#303031" }}
                  >
                    Thanh toán ngay
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="flex items-center justify-center py-12">
                <svg
                  className="w-12 h-12 animate-spin text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

// =======================
// HIỂN THỊ DANH SÁCH SẢN PHẨM
// =======================
const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className="grid grid-cols-2 md:grid-cols-1">
        {products && products.length > 0 ? (
          products.map((product, index) => {
            const price = Math.round(
              product.pPrice - (product.pPrice * product.pOffer) / 100
            );
            return (
              <div
                key={index}
                className="col-span-1 m-2 md:py-6 md:border-t md:border-b md:my-2 md:mx-0 md:flex md:items-center md:justify-between"
              >
                <div className="md:flex md:items-center md:space-x-4">
                  <img
                    onClick={() => history.push(`/products/${product._id}`)}
                    className="cursor-pointer md:h-20 md:w-20 object-cover object-center"
                    src={product.pImages[0].url}
                    alt="product"
                  />
                  <div className="text-lg md:ml-6 truncate">{product.pName}</div>
                  <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                    Giá: {price}.000 VND
                  </div>
                  <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                    SL: {quantity(product._id)}
                  </div>
                  <div className="font-semibold text-gray-600 text-sm">
                    Tổng: {subTotal(product._id, price)}.000 VND
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>Không có sản phẩm trong giỏ hàng</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;
