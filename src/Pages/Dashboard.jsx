import App from "./App";
import "./Dashboard.css";
import { useState } from "react";
import logo from "./assets/logo.png";
import {
  FaHome,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaChartBar
} from "react-icons/fa";
import Reports from "./Pages/Reports";

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

<button onClick={() => setActivePage("live")}>
  <i className="fa-solid fa-location-dot"></i>
  Live Tracking
</button>

<button onClick={() => setActivePage("emergency")}>
  <i className="fa-solid fa-triangle-exclamation"></i>
  Emergency
</button>

<button onClick={() => setActivePage("reports")}>
  <i className="fa-solid fa-chart-column"></i>
  <FaChartBar /> Reports
</button>
<div className="user-navbar">

  <i className="fa-solid fa-user"></i>

  <span>{user?.name}</span>

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
                <hr />

<h3>Nearby Police Stations</h3>

<p>📍 RR Nagar Police Station</p>

<p>📍 Kengeri Police Station</p>

<p>📍 Rajarajeshwari Nagar Station</p>

                {/* RISK HISTORY */}

                <div className="history-box">

                  <h3>Risk History</h3>

                  <table>

                    <tbody>

                      <tr>
                        <th>Area</th>
                        <th>Risk</th>
                      </tr>

                      <tr>
                        <td>RR Nagar</td>
                        <td style={{color:"orange"}}>
                          Medium
                        </td>
                      </tr>

                      <tr>
                        <td>Nagasandra</td>
                        <td style={{color:"red"}}>
                          High
                        </td>
                      </tr>

                      <tr>
                        <td>Majestic</td>
                        <td style={{color:"yellow"}}>
                          Medium
                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )
        }

        {/* MAP SECTION */}

       <div className="map-section">

  {
    activePage === "live" && <App />
  }

  {
    activePage === "reports" && <Reports />
  }

  {
    activePage === "emergency" && (
      <div className="emergency-page">

        <h1>🚨 Emergency SOS</h1>

        <button>Call Police</button>

        <button>Send SOS</button>

        <button>Share Live Location</button>

      </div>
    )
  }

</div>

</div>

    </>
  );
}

export default Dashboard;