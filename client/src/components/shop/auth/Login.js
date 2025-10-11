import React, { useState, useContext } from "react";
import { loginReq } from "./fetchApi";
import { LayoutContext } from "../index";
import PasswordReset from "./PasswordReset";

const Login = () => {
  const { data: layoutData } = useContext(LayoutContext);

  const [data, setData] = useState({
    email: "",
    password: "",
    error: false,
    loading: false,
    showPasswordReset: false,
  });

  const formSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, loading: true });
    try {
      let responseData = await loginReq({
        email: data.email,
        password: data.password,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
        });
      } else if (responseData.token) {
        setData({ email: "", password: "", loading: false, error: false });
        localStorage.setItem("jwt", JSON.stringify(responseData));
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-400 px-4">
      <div className="w-full max-w-md">
        {/* Box tiêu đề */}
        <div className="bg-green-300 text-green-900 text-center py-4 rounded-lg mb-6 shadow-md">
          <h2 className="text-3xl font-bold">Đăng nhập</h2>
          <p className="text-sm">Chào mừng bạn trở lại 👋</p>
        </div>

        {/* Thông báo lỗi chung */}
        {layoutData.loginSignupError && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-center shadow-md">
            Bạn cần đăng nhập để tiếp tục.
          </div>
        )}

        {/* Form */}
        {data.showPasswordReset ? (
          <PasswordReset
            onResetSuccess={() =>
              setData({ ...data, showPasswordReset: false })
            }
          />
        ) : (
          <form className="space-y-5" onSubmit={formSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-green-900">
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none 
                           text-gray-900 placeholder-gray-400 shadow"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-green-900">
                Password
              </label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none 
                           text-gray-900 placeholder-gray-400 shadow"
                placeholder="••••••••"
                required
              />
            </div>

            {data.error && (
              <p className="text-sm text-red-600">{data.error}</p>
            )}

            <button
              type="submit"
              disabled={data.loading}
              className="w-full py-3 font-semibold text-white bg-green-500 rounded-lg 
                         hover:bg-green-600 transition shadow-lg"
            >
              {data.loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        )}

        {/* Link phụ */}
        <div className="flex justify-between mt-4 text-sm text-green-900">
          <button
            onClick={() => setData({ ...data, showPasswordReset: true })}
            className="hover:underline"
          >
            Quên mật khẩu?
          </button>
          <a href="/register" className="hover:underline">
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
