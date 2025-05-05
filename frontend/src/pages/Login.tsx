import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../Login.module.css"; // Import CSS module
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import API from "../service/api"; // Import API service

interface LoginProps {
  closeModal: () => void; // Hàm để đóng modal
}

export default function Login({ closeModal }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const formData = { name, email, password };
      const response = await API.post("/auth/customer/register", formData);
      setMessage("Đăng ký thành công!");
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        setIsLogin(true);
        setMessage("");
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Đăng ký thất bại!");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/customer/login", {
        email,
        password,
      });
      const {token, user} = response.data;
      console.log(response.data);
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("id", user.id); // Lưu _id của user
      localStorage.setItem("name", user.name); // Lưu name của user
      setMessage("Đăng nhập thành công!");
      
      setTimeout(() => {
        closeModal(); // Gọi hàm đóng modal
        if (user.role === "admin") {
          navigate("/admin"); // Điều hướng sang trang Admin
          window.location.reload(); // Reload trang
        } else {
          navigate("/"); // Điều hướng sang trang Home
          window.location.reload(); // Reload trang
        }
      }, 500);
      
    } catch (error) {
      setMessage(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
        "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại."
      );
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {isLogin ? (
          <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleLogin={handleLogin}
            toggleForm={toggleForm}
            message={message}
          />
        ) : (
          <RegisterForm
            name={name}
            email={email}
            password={password}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            handleRegister={handleRegister}
            toggleForm={toggleForm}
            message={message}
          />
        )}
      </div>
    </div>
  );
}