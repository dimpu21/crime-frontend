import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import logo from "./assets/logo.png";

import { ref, set } from "firebase/database";

import { db } from "./firebase";

function Login() {

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    emergency1: "",
    emergency2: "",
    emergency3: ""
  });

  // 🔥 Handle input changes
  const handleChange = (e) => {

    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Handle form submit
  const handleSubmit = (e) => {

    e.preventDefault();

    // 🔥 Save to Firebase
    set(
      ref(db, "users/" + userData.phone),
      {
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        emergency1: userData.emergency1,
        emergency2: userData.emergency2,
        emergency3: userData.emergency3
      }
    )

    .then(() => {

      console.log("User saved");

    })

    .catch((error) => {

      console.log(error);

    });

    // 🔥 Save locally
    localStorage.setItem(
      "crimeUser",
      JSON.stringify({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        emergency1: userData.emergency1,
        emergency2: userData.emergency2,
        emergency3: userData.emergency3
      })
    );

    // 🔥 Navigate to dashboard
    navigate("/dashboard");
  };

  return (

    <div className="login-container">

      <div className="login-box">

        {/* 🔥 LOGO */}
        <img
          src={logo}
          alt="logo"
          className="logo"
        />

        {/* 🔥 TITLE */}
        <h1>VDC ALERTNET</h1>

        {/* 🔥 SUBTITLE */}
        <p>
          Smart Crime Hotspot Detection
          & Emergency Alert System
        </p>

        {/* 🔥 FORM */}
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            required
            value={userData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            required
            value={userData.phone}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            required
            value={userData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="emergency1"
            placeholder="Emergency Contact 1"
            required
            value={userData.emergency1}
            onChange={handleChange}
          />

          <input
            type="text"
            name="emergency2"
            placeholder="Emergency Contact 2"
            value={userData.emergency2}
            onChange={handleChange}
          />

          <input
            type="text"
            name="emergency3"
            placeholder="Emergency Contact 3"
            value={userData.emergency3}
            onChange={handleChange}
          />

          <button type="submit">
            Login / Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;