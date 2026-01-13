import React, { Fragment, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { signupReq } from "./fetchApi";
import { LayoutContext } from "../index";
import ConfirmSignup from "./ConfirmSignup";

const Signup = () => {
  const history = useHistory();
  const { dispatch } = useContext(LayoutContext);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    error: false,
    loading: false,
    success: false,
  });
  const [signedUp, setSignedUp] = useState(false);

  const handleOTPSuccess = () => {
    // Khi OTP verify thành công, reset signup form và hiện login form
    setSignedUp(false);
    setData({
      name: "",
      email: "",
      password: "",
      cPassword: "",
      error: false,
      loading: false,
      success: false,
    });
    // Dispatch event để parent component (LoginSignup) biết và switch sang login form
    dispatch({ type: "showLoginForm" });
  };

  const alert = (msg, type) => (
    <div className={`text-sm text-${type}-500`}>{msg}</div>
  );

  const formSubmit = async () => {
    setData({ ...data, loading: true });
    if (data.cPassword !== data.password) {
      return setData({
        ...data,
        loading: false,
        error: {
          cPassword: "Mật khẩu không khớp",
          password: "Mật khẩu không khớp",
        },
      });
    }
    try {
      let responseData = await signupReq({
        name: data.name,
        email: data.email,
        password: data.password,
        cPassword: data.cPassword,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
          cPassword: "",
        });
      } else if (responseData.success) {
        setSignedUp(true);
        setData({
          success: responseData.success,
          name: "",
          email: data.email,
          password: "",
          cPassword: "",
          loading: false,
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Box tiêu đề */}
          <div className="bg-green-300 text-green-900 text-center py-4 rounded-lg mb-6 shadow-md">
            <h2 className="text-3xl font-bold">Đăng ký</h2>
            <p className="text-sm">Tạo tài khoản mới của bạn</p>
          </div>

          {/* Thông báo thành công */}
          {data.success && (
            <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center shadow-md">
              {data.success}
            </div>
          )}

          {/* Form */}
          {signedUp ? (
            <ConfirmSignup emailFromSignUp={data.email} onSuccess={handleOTPSuccess} />
          ) : (
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); formSubmit(); }}>
              <div>
                <label className="block mb-1 text-sm font-medium text-green-900">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) =>
                    setData({
                      ...data,
                      success: false,
                      error: {},
                      name: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none 
                             text-gray-900 placeholder-gray-400 shadow ${data.error?.name ? "border-2 border-red-500" : ""
                    }`}
                  placeholder="Nhập họ và tên"
                  required
                />
                {data.error?.name && (
                  <p className="text-sm text-red-600 mt-1">{data.error.name}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-green-900">
                  Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) =>
                    setData({
                      ...data,
                      success: false,
                      error: {},
                      email: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none 
                             text-gray-900 placeholder-gray-400 shadow ${data.error?.email ? "border-2 border-red-500" : ""
                    }`}
                  placeholder="you@example.com"
                  required
                />
                {data.error?.email && (
                  <p className="text-sm text-red-600 mt-1">{data.error.email}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-green-900">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) =>
                    setData({
                      ...data,
                      success: false,
                      error: {},
                      password: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none 
                             text-gray-900 placeholder-gray-400 shadow ${data.error?.password ? "border-2 border-red-500" : ""
                    }`}
                  placeholder="••••••••"
                  required
                />
                {data.error?.password && (
                  <p className="text-sm text-red-600 mt-1">{data.error.password}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-green-900">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={data.cPassword}
                  onChange={(e) =>
                    setData({
                      ...data,
                      success: false,
                      error: {},
                      cPassword: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none 
                             text-gray-900 placeholder-gray-400 shadow ${data.error?.cPassword ? "border-2 border-red-500" : ""
                    }`}
                  placeholder="••••••••"
                  required
                />
                {data.error?.cPassword && (
                  <p className="text-sm text-red-600 mt-1">{data.error.cPassword}</p>
                )}
              </div>

              {/* Thông báo lỗi chung */}
              {data.error && typeof data.error === "string" && (
                <p className="text-sm text-red-600">{data.error}</p>
              )}

              <button
                type="submit"
                disabled={data.loading}
                className="w-full py-3 font-semibold text-white bg-green-500 rounded-lg 
                           hover:bg-green-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {data.loading ? "Đang đăng ký..." : "Tạo tài khoản"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Signup;