import App from "./App";
import Reports from "./Pages/Reports";
import Emergency from "./Pages/Emergency";
import "./Dashboard.css";
import { useState } from "react";
import logo from "./assets/logo.png";

function Dashboard() {

  const [showSidebar, setShowSidebar] = useState(true);
  const [activePage, setActivePage] = useState("live");

  const user = JSON.parse(
    localStorage.getItem("crimeUser")
  );

  return (

    <>
    
      {/* NAVBAR */}

      <div className="top-navbar">

        <div className="nav-logo">

  <img
    src={logo}
    alt="logo"
    className="navbar-logo"
  />

  <span>VDC ALERTNET</span>

</div>

        <div className="nav-links">

  <button
    className={activePage === "live" ? "active-nav" : ""}
    onClick={() => setActivePage("live")}
  >
    📍 Live Tracking
  </button>

  <button
    className={activePage === "emergency" ? "active-nav" : ""}
    onClick={() => setActivePage("emergency")}
  >
    🚨 Emergency
  </button>

  <button
    className={activePage === "reports" ? "active-nav" : ""}
    onClick={() => setActivePage("reports")}
  >
    📊 Reports
  </button>
 <div className="nav-user">

  👤 {user?.name}

  <div className="user-popup">

    <h3>User Profile</h3>

    <p>
      <strong>Name:</strong> {user?.name}
    </p>

    <p>
      <strong>Phone:</strong> {user?.phone}
    </p>

    <p>
      <strong>Email:</strong> {user?.email}
    </p>

  </div>

</div>

</div>

      </div>

      {/* MAIN DASHBOARD */}

      <div className="dashboard-container">

        {/* TOGGLE BUTTON */}

        <button
          className="toggle-btn"
          onClick={() =>
            setShowSidebar(!showSidebar)
          }
        >
          {
            showSidebar
              ? "◀ Hide Panel"
              : "▶ Show Panel"
          }
        </button>

        {/* SIDEBAR */}

        {
          showSidebar && (

            <div className="sidebar">

              <div className="profile-card">

                <h1>VDC ALERTNET</h1>

                <p className="tagline">
                  Smart Crime Hotspot Detection &
                  Emergency Alert System
                </p>

                {/* LIVE CLOCK */}

                <div className="live-clock">

                  {new Date().toLocaleString()}

                </div>

                {/* USER DETAILS */}

                <div className="user-details">

                  <h3>User Details</h3>

                  <p>
                    <strong>Name:</strong>
                    {" "}
                    {user?.name}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    {" "}
                    {user?.phone}
                  </p>

                  <p>
                    <strong>Emergency:</strong>
                    {" "}
                    {user?.emergency}
                  </p>

                </div>

                {/* EMERGENCY NUMBERS */}

                <div className="emergency-box">

                  <h3>Emergency Numbers</h3>

                  <p>🚓 Police : 100</p>

                  <p>🚨 National Emergency : 112</p>

                  <p>🚑 Ambulance : 108</p>

                  <p>👩 Women Safety : 1091</p>

                </div>
                <div className="police-box">

  <h3>Nearby Police Stations</h3>

  <p>📍 RR Nagar Police Station</p>

  <p>📍 Kengeri Police Station</p>

  <p>📍 Rajarajeshwari Nagar Station</p>

</div>

              </div>

            </div>
          )
        }

        {/* MAP SECTION */}

        <div className="map-section">

  {activePage === "live" && <App />}

  {activePage === "reports" && <Reports />}

  {activePage === "emergency" && <Emergency />}

</div>

      </div>

    </>
  );
}

export default Dashboard;