import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./style.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
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
      <Navbar className="navbarCSS shadow-lg" collapseOnSelect expand="lg" style={{ position: "relative", zIndex: 2, backgroundColor: "rgb(195 211 198 / 66%)" }}>
        <Navbar.Brand href="/" className="text-black navTitle">Personal Finance Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ backgroundColor: "transparent", borderColor: "transparent" }}>
          <span className="navbar-toggler-icon" style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")` }}></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          {user ? (
            <Nav>
              <Button variant="success" onClick={handleLogout} className="ml-2">Logout</Button>
            </Nav>
          ) : (
            <Nav>
              <Button variant="success" onClick={() => navigate("/login")} className="ml-2">Login</Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;