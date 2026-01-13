const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { deleteModel } = require("mongoose");

function generateOTP() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'duyvivoo@gmail.com',
    pass: 'dryn axhv jabw tyxc',
  },
});

function sendOTPEmail(email, otp) {
  return new Promise((resolve, reject) => {
    console.log(`📧 Sending OTP email to ${email} with OTP: "${otp}"`);

    const mailOptions = {
      from: 'Home Market <duyvivoo@gmail.com>',
      to: email,
      subject: 'OTP for Signup Verification',
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Xác minh tài khoản Home Market</h2>
        <p>Mã OTP của bạn là:</p>
        <h1 style="color: #FF6B6B; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>Mã này có hiệu lực trong 10 phút.</p>
        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        reject(error);
      } else {
        console.log('OTP email sent successfully:', info.response);
        resolve(info);
      }
    });
  });
}
class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  }

  async allUser(req, res) {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  }

  /* User Registration/Signup controller  */
  async postSignup(req, res) {
    let { name, email, password, cPassword } = req.body;
    let error = {};
    if (!name || !email || !password || !cPassword) {
      error = {
        ...error,
        name: "Filed must not be empty",
        email: "Filed must not be empty",
        password: "Filed must not be empty",
        cPassword: "Filed must not be empty",
      };
      return res.json({ error });
    }
    if (name.length < 3 || name.length > 25) {
      error = { ...error, name: "Name must be 3-25 charecter" };
      return res.json({ error });
    } else {
      if (validateEmail(email)) {
        name = toTitleCase(name);
        if ((password.length > 255) | (password.length < 8)) {
          error = {
            ...error,
            password: "Password must be greater than 8 characters and less than 255 characters",
            name: "",
            email: "",
          };
          return res.json({ error });
        } else {
          // If Email & Number exists in Database then:
          try {
            console.log('Before findOne');
            const data = await userModel.findOne({ email: email });
            console.log('After findOne', data);

            if (data) {
              if (data.verified) {
                // User already verified
                console.log('User already verified');
                error = {
                  ...error,
                  password: "",
                  name: "",
                  email: "Email already exists",
                };
                return res.json({ error });
              }

              // User exists but not verified - REUSE existing OTP instead of creating new one
              console.log('User exists but not verified - reusing existing OTP');
              const otp = data.otp; // Use existing OTP, don't create new one
              console.log(`♻️ Reusing OTP for ${email}: "${otp}"`);
              const hashedPassword = bcrypt.hashSync(password, 10);

              // Update existing user instead of creating new one
              data.password = hashedPassword;
              // Keep userImage as is (don't upload new image)
              // Keep the same OTP - don't generate a new one!

              try {
                // Save updated user to the database
                const savedUser = await data.save();
                console.log(`💾 User updated with OTP: "${savedUser.otp}"`);

                // Send OTP email asynchronously (don't wait for it)
                sendOTPEmail(email, otp).catch((mailErr) => {
                  console.error('Failed to send OTP email:', mailErr);
                  // Email error doesn't affect signup response
                });

                console.log('Account created successfully. Please confirm OTP to verify account');
                return res.json({
                  success: "Account created successfully. Please confirm OTP to verify account",
                  email: email,
                });
              } catch (err) {
                console.log('Error during user update:', err);
                return res.json({ error: "An error occurred during signup. Please try again." });
              }
            }

            // User does not exist, create new user
            console.log('User does not exist, creating new user');
            const otp = generateOTP();
            console.log(`🆕 Generated new OTP for ${email}: "${otp}"`);
            const hashedPassword = bcrypt.hashSync(password, 10);

            let newUser = new userModel({
              name,
              email,
              // userImage will be null or default (no upload during signup)
              password: hashedPassword,
              otp,
              userRole: 0,
              point: 0,
            });

            try {
              // Save new user to the database
              const savedUser = await newUser.save();
              console.log(`💾 User saved with OTP: "${savedUser.otp}"`);

              console.log(savedUser);

              // Send OTP email asynchronously (don't wait for it)
              sendOTPEmail(email, otp).catch((mailErr) => {
                console.error('Failed to send OTP email:', mailErr);
                // Email error doesn't affect signup response
              });

              console.log('Account created successfully. Please confirm OTP to verify account');
              return res.json({
                success: "Account created successfully. Please confirm OTP to verify account",
                email: email,
              });
            } catch (err) {
              console.log('Error during user save:', err);
              return res.json({ error: "An error occurred during signup. Please try again." });
            }
          } catch (err) {
            console.log('Error during findOne:', err);
            return res.json({ error: "An error occurred during signup. Please try again." });
          }
        }
      }
      else if (!validateEmail(email)) {
        error = { ...error, name: "Email is not in correct format" };
        return res.json({ error });
      }
    }
  }

  async confirmSignup(req, res) {
    const { email, otp } = req.body;

    try {
      // Validate input
      if (!email || !otp) {
        return res.json({ error: 'Email and OTP are required.' });
      }

      // Truy xuất thông tin người dùng từ cơ sở dữ liệu bằng email
      const user = await userModel.findOne({ email });

      // Kiểm tra xem người dùng có tồn tại
      if (!user) {
        return res.json({ error: 'User not found. Please signup first.' });
      }

      // Debug: Log OTP từ DB và OTP nhận được
      console.log(`OTP from DB: "${user.otp}" (type: ${typeof user.otp}, length: ${String(user.otp).length})`);
      console.log(`OTP received: "${otp}" (type: ${typeof otp}, length: ${String(otp).length})`);

      // Kiểm tra OTP khớp không (trim và convert to string để tránh lỗi)
      const dbOTP = String(user.otp).trim().toUpperCase();
      const receivedOTP = String(otp).trim().toUpperCase();

      console.log(`OTP comparison: "${dbOTP}" === "${receivedOTP}" ? ${dbOTP === receivedOTP}`);

      if (dbOTP === receivedOTP) {
        // Nếu OTP khớp, đặt trạng thái đã xác minh và xóa OTP
        user.verified = true;
        user.otp = null;
        await user.save();

        console.log(`User ${email} verified successfully`);
        return res.json({
          success: 'The account has been verified and created successfully. Please Login.',
        });
      } else {
        return res.json({ error: 'OTP is not valid. Please try again.' });
      }
    } catch (error) {
      console.error('Error during confirmSignup:', error);
      return res.json({ error: 'An error occurred during signup. Please try again.' });
    }
  }
  /* User Login/Signin controller  */
  async postSignin(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Fields must not be empty",
      });
    }
    try {
      const data = await userModel.findOne({ email: email });
      if (!data) {
        return res.json({
          error: "Invalid email or password",
        });
      }
      if (!data.verified) {
        return res.json({ error: "Account not verified. Please signup again and check your email for OTP." });
      }
      else {
        const login = await bcrypt.compare(password, data.password);
        if (login) {
          const token = jwt.sign(
            { _id: data._id, role: data.userRole, point: data.point },
            JWT_SECRET
          );
          const encode = jwt.verify(token, JWT_SECRET);
          return res.json({
            success: 'Đăng nhập thành công.',
            token: token,
            user: encode,
          });
        } else {
          return res.json({
            error: "Invalid email or password",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  async resetPasswordAfterOtp(req, res) {
    let { email, otp, newPassword } = req.body;
    try {
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await userModel.findOne({ email });

      // Kiểm tra xem người dùng tồn tại và mã OTP khớp không
      if (user && user.verified) {
        if (user.otp === otp) {
          // Đặt mật khẩu mới
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          user.password = hashedPassword;

          // Xóa mã OTP sau khi đã sử dụng
          user.otp = null;

          // Lưu người dùng vào cơ sở dữ liệu
          await user.save();

          return res.json({ success: 'Password has been reset successfully.' });
        } else {
          return res.json({ error: 'Invalid OTP. Please try again.' });
        }
      } else {
        return res.json({ error: 'Email not exist or not verified.' });
      }
    } catch (error) {
      console.error(error);
      return res.json({ error: 'An error occurred while processing your request. Please try again.' });
    }
  }

  // Hàm để gửi mã OTP để đặt lại mật khẩu
  async sendOtpForResetPassword(req, res) {
    let { email } = req.body;
    try {
      // Validate input
      if (!email) {
        return res.json({ error: 'Email is required.' });
      }

      // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.json({ error: 'Email not found.' });
      }

      if (!user.verified) {
        return res.json({ error: 'Account not verified. Please complete signup first.' });
      }

      // Tạo mã OTP mới
      const otp = generateOTP();

      // Lưu mã OTP vào cơ sở dữ liệu
      user.otp = otp;
      await user.save();

      // Gửi email chứa mã OTP
      try {
        await sendOTPEmail(email, otp);
      } catch (mailErr) {
        console.error('Failed to send OTP email:', mailErr);
        return res.json({ error: 'Failed to send OTP email. Please try again.' });
      }

      return res.json({ success: 'OTP has been sent to your email. Please check your inbox.' });
    } catch (error) {
      console.error('Error during sendOtpForResetPassword:', error);
      return res.json({ error: 'An error occurred while processing your request. Please try again.' });
    }
  }
}

const authController = new Auth();
module.exports = authController;