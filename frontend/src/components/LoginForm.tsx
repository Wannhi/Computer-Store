import React from "react";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  toggleForm: () => void;
  message?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  toggleForm,
  message,
}) => {
  const navigate = useNavigate(); // Hook để điều hướng

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin(e); // Gọi hàm đăng nhập
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Điều hướng sang trang Home nếu đăng nhập thành công
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">
        <h2>Đăng nhập</h2>
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Đăng nhập</button>
        <p className="login-link">
          Chưa có tài khoản?{" "}
          <a href="#" id="register-btn" onClick={toggleForm}>
            Đăng ký
          </a>
        </p>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default LoginForm;