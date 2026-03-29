import React, { useState } from 'react';
import '../assets/CSS/Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [logData, setLogData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const validateLoginForm = () => {
    let newError = {};
    if (!logData.email.trim()) newError.email = "Email is required";
    if (!logData.password.trim()) newError.password = "Password is required";
    setError(newError);
    return Object.keys(newError).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(prev => ({
      ...prev,
      [name]: ""
    }));
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return toast.error("Invalid credentials");
    try {
      const loginData = await axios.post(`${API}/auth/login`, logData);
      console.log("Log In Successfully", loginData);
      setLogData({
        email: "",
        password: ""
      });
      setError({});
      // localStorage.setItem('token', loginData.data.token);
       if (loginData.data.status) {
      localStorage.setItem("token", loginData.data.token);
      localStorage.setItem("role", loginData.data.role);
      toast.success(loginData.data.message);
      if (loginData.data.role === "Super Admin") {
        navigate("/lead-page");
      } else if (loginData.data.role === "Sub Admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    }

    }
    catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      else {
        toast.error("Server issue");
      }
      console.log(error, "Something went wrong");
    }
  }
  return (
    <>
      <section className="loginSection">
        <div className="loginForm">
          <div className="container">
            <h1>Log In</h1>
            <form onSubmit={handleLoginSubmit}>
              <input name='email' value={logData.email} placeholder='Email' type='email' onChange={handleChange} />
              {error.email && <p className="signUpError">{error.email}</p>}
              <input name='password' value={logData.password} placeholder='Password' type='password' onChange={handleChange} />
              {error.password && <p className="signUpError">{error.password}</p>}
              <button type='submit'>Login</button>
            </form>
          </div>
          <p className='OR'>OR</p>
          <div className='alreadyAccount'>
            <p>Don't have an Account?</p>
            <button onClick={() => navigate("/sign-up")}>Sign Up</button>
          </div>
        </div>
      </section>
    </>
  )
}
export default Login;
