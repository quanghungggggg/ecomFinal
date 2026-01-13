import React, { useState, useContext } from "react";
import { LayoutContext } from "../index";
import { confirmSignupReq } from "./fetchApi";

const ConfirmSignup = ({ emailFromSignUp, onSuccess }) => {
  const { dispatch } = useContext(LayoutContext);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleConfirm = async () => {
    // Validate OTP
    if (!otp || otp.trim().length === 0) {
      setMessage({ type: 'error', text: 'Please enter OTP' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Gọi hàm confirmSignupReq từ fetchApi.js
      const response = await confirmSignupReq({ email: emailFromSignUp, otp });

      if (response.success) {
        // Hiển thị thông báo thành công lên UI
        setMessage({ type: 'success', text: response.success });
        setLoading(false);

        // Delay 2 giây rồi gọi callback để switch sang login form
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      } else if (response.error) {
        setMessage({ type: 'error', text: response.error });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      setLoading(false);
    }
  };

  const alert = (msg, type) => {
    const styleClass = type === 'success'
      ? 'text-green-600 border-green-600 bg-green-50'
      : 'text-red-600 border-red-600 bg-red-50';

    return (
      <div className={`text-sm ${styleClass} mb-4 p-3 border rounded font-medium`}>
        {msg}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Confirm Signup</h2>
      <p className="text-gray-600 mb-4">Email: <strong>{emailFromSignUp}</strong></p>

      {message.text && alert(message.text, message.type)}

      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.toUpperCase())}
          placeholder="Enter OTP"
          disabled={loading}
          maxLength="8"
          className="px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleConfirm}
          disabled={loading}
          style={{ background: loading ? '#ccc' : '#303031' }}
          className="px-4 py-2 text-white text-center cursor-pointer font-medium rounded"
        >
          {loading ? 'Verifying...' : 'Confirm'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">Didn't receive OTP? <span className="text-blue-500 cursor-pointer">Resend</span></p>
    </div>
  );
};

export default ConfirmSignup;
