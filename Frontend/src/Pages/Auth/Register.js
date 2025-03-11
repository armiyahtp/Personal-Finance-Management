import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import "./auth.css";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Register = () => {
  const { setAuthState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem("user")) navigate("/");
  }, [navigate]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = values;
  
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
  
    setLoading(true);
    try {
      const { data } = await axios.post(registerAPI, { name, email, password });
      console.log("Registration Response:", data);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setAuthState({ isAuthenticated: true, user: data.user });
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={loadFull}
        options={{
          background: { color: "#fff" },
          fpsLimit: 60,
          particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: "#40593f" },
            shape: { type: "circle" },
            opacity: { value: 0.3, random: true },
            size: { value: 20, random: { enable: true, minimumValue: 1 } },
            links: { enable: false },
            move: { enable: true, speed: 2 },
            life: { duration: { sync: false, value: 3 }, count: 0, delay: { random: { enable: true, minimumValue: 0.5 }, value: 1 } },
          },
          detectRetina: true,
        }}
        style={{ position: "absolute", zIndex: -1, top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Container className="mt-5" style={{ position: "relative", zIndex: 2, color: "white" }}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Row className="text-center">
              <h1><AccountBalanceWalletIcon sx={{ fontSize: 40, color: "black" }} /></h1>
              <h1 className="text-black mt-4 mb-4 fw-bold">Welcome to Expense Management System</h1>
            </Row>
            <Row className="bg-white p-4 rounded mb-5 shadow-lg mt-4 mx-auto" style={{ maxWidth: "800px", width: "auto" }}>
              <Col md={6} className="d-flex align-items-center justify-content-center mb-4 mb-md-0">
                <div className="text-center">
                  <img
                    src="https://www.finetuneus.com/wp-content/uploads/2023/09/Untitled-962-%C3%97-481-px-695-%C3%97-461-px.png"
                    alt="Expense Illustration"
                    className="img-fluid"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="ms-md-4 mb-5 mt-5 rounded-5" style={{ backgroundColor: "#e6e6e6", width: "201px", height: "47px" }}>
                  <div className="btn-group" role="group" aria-label="Register and Sign In">
                    <Button
                      id="logInBtn"
                      onClick={() => navigate("/login")}
                      className="toggle-btn mt-1 ms-1 me-1 rounded-5 text-black bg-transparent border-0"
                      style={{ width: "95px", height: "38px" }}
                    >
                      Login
                    </Button>
                    <Button
                      id="signInBtn"
                      variant="success"
                      className="toggle-btn mt-1 rounded-5"
                      style={{ width: "95px", height: "38px" }}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicName" className="mb-3">
                    <Form.Control type="text" name="name" placeholder="Name" value={values.name} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Control type="email" name="email" placeholder="Email" value={values.email} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Control type="password" name="password" placeholder="Password" value={values.password} onChange={handleChange} required />
                  </Form.Group>
                  <Button type="submit" className="w-100 btn btn-success" disabled={loading}>
                    Register Now
                  </Button>
                  <div className="mt-3 text-center">
                    <p className="mt-3 text-start ms-3" style={{ color: "#9d9494" }}>
                      Already have an account?{" "}
                      <span style={{ color: "#40593f", cursor: "pointer" }} onClick={() => navigate("/login")}>
                        Login
                      </span>
                    </p>
                  </div>
                </Form>
              </Col>
            </Row>
          </>
        )}
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Register;