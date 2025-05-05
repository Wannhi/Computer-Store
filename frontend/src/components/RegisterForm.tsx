import React from "react";

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  toggleForm: () => void;
  message?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  handleRegister,
  toggleForm,
  message,
}) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleRegister(e); // Gọi hàm đăng ký
    toggleForm(); // Chuyển sang form đăng nhập nếu đăng ký thành công
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">
        <h2>Đăng ký</h2>
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="btn">Đăng ký</button>
        <p className="login-link">
          Đã có tài khoản?{" "}
          <a href="#" id="login-btn" onClick={toggleForm}>
            Đăng nhập
          </a>
        </p>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterForm;