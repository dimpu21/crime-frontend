import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  Polyline,
  Popup
} from "react-leaflet";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import "./App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔁 Smooth map movement
function RecenterMap({ position }) {

  const map = useMap();

  useEffect(() => {

    map.flyTo(position, 15);

  }, [position]);

  return null;
}

// 🔥 Heatmap
function HeatmapLayer({ hotspots }) {

  const map = useMap();

  useEffect(() => {

    if (!hotspots.length) return;

    const points = hotspots.map((p) => [
      p.lat,
      p.lng,
      p.intensity / 3
    ]);

    const heat = L.heatLayer(points, {
      radius: 50,
      blur: 35,
      maxZoom: 17,
      minOpacity: 0.4,
      gradient: {
        0.1: "#00ff00",
        0.3: "#ffff00",
        0.5: "#ff9900",
        0.7: "#ff3300",
        1.0: "#ff0000"
      }
    });

    heat.addTo(map);

    return () => map.removeLayer(heat);

  }, [hotspots, map]
);

  return null;
}

function App() {

  const [position, setPosition] = useState([12.9716, 77.5946]);

  const [risk, setRisk] = useState("Low");

  const [tracking, setTracking] = useState(false);

  const [showDanger, setShowDanger] = useState(false);

  const [fullscreenAlert, setFullscreenAlert] = useState(false);

  const [hotspots, setHotspots] = useState([]);

  const [loading, setLoading] = useState(true);

  const [riskyPoints, setRiskyPoints] = useState([]);
  const [riskLevel, setRiskLevel] = useState("Low");

  // ✅ Safe route
  const [route, setRoute] = useState([]);

  const watchRef = useRef(null);

  // 🔥 SIREN AUDIO
  const audioRef = useRef(new Audio("/alert.mp3.wav"));
  

  // 🔥 Configure siren
  useEffect(() => {

    audioRef.current.loop = true;
    audioRef.current.volume = 1.0;

  }, []);

  // 🔥 Load heatmap
  // 🔥 Load heatmap
useEffect(() => {

  // fetch("http://10.222.223.215:5000/heatmap")
  //   .then(res => res.json())
  //   .then(data => {
  //     setHotspots(data);
  //     setLoading(false);
  //   })
  //   .catch(err => console.log(err));

}, []);

  // 🔥 Enable sound manually once
  const enableSound = () => {

    audioRef.current.play()
      .then(() => {

        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        toast.success("Alert sound enabled");

      })
      .catch(err => console.log(err));
  };

  // 🔥 Start tracking
  const startTracking = () => {

  watchRef.current = navigator.geolocation.watchPosition(

    (pos) => {

      if (!pos || !pos.coords) {
        console.log("GPS unavailable");
        return;
      }

      console.log("Tracking started");

      console.log("Latitude:", pos.coords.latitude);
      console.log("Longitude:", pos.coords.longitude);

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      console.log("LIVE LOCATION:", lat, lng);

      setPosition([lat, lng]);

      const dangerZones = [
        {
          lat: 12.9716,
          lng: 77.5946,
          radius: 0.05
        },
        {
          lat: 12.9352,
          lng: 77.6245,
          radius: 0.05
        },
        {
  lat: 13.0117,
  lng: 77.5690,
  radius: 0.05
}
      ];

      let isDanger = false;

      dangerZones.forEach((zone) => {

        const distance = Math.sqrt(
          Math.pow(lat - zone.lat, 2) +
          Math.pow(lng - zone.lng, 2)
        );

        if (distance < zone.radius) {

          isDanger = true;

          setRisk("High");

          setShowDanger(true);

          setFullscreenAlert(true);

          audioRef.current.play();

          toast.error("🚨 HIGH RISK AREA DETECTED");

          if (navigator.vibrate) {
            navigator.vibrate([
              1000,
              500,
              1000
            ]);
          }

          setTimeout(() => {
            setShowDanger(false);
          }, 3000);
        }
      });

      if (!isDanger) {
        setRisk("Low");
      }

    },

    (err) => {
      console.log(err);
    },

    {
      enableHighAccuracy: true
    }

  );

  setTracking(true);
};

  // 🔥 Stop tracking
  const stopTracking = () => {

    navigator.geolocation.clearWatch(watchRef.current);

    setTracking(false);

    audioRef.current.pause();

    audioRef.current.currentTime = 0;
  };

  // 🔥 Safe Route
  const getSafeRoute = async () => {

    const destination = [
      position[0] + 0.02,
      position[1] + 0.02
    ];

    try {

      const res = await fetch(
        //"http://10.222.223.215:5000/safe-route",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            start_lat: position[0],
            start_lng: position[1],
            end_lat: destination[0],
            end_lng: destination[1]
          })
        }
      );

      const data = await res.json();

      setRoute(data.safe_route || []);

      setRiskyPoints(data.risky_points || []);

      toast.warning(data.message || "Route loaded");

    } catch (err) {

      console.error(err);

      toast.error("Route failed");
    }
  };

  // 🔥 Stop Emergency Alert
  const stopEmergencyAlert = () => {

    setFullscreenAlert(false);

    audioRef.current.pause();

    audioRef.current.currentTime = 0;
  };

  return (
    <>

      {/* 🔥 Fullscreen Emergency Alert */}
      {fullscreenAlert && (

        <div className="emergency-overlay">

          <div className="emergency-box">

            <h1>🚨 DANGER ZONE 🚨</h1>

            <p>High Risk Area Detected</p>

            <p>Move Away Immediately!</p>

            <button onClick={stopEmergencyAlert}>
              STOP ALERT
            </button>

          </div>

        </div>
      )}

      <div className="container">

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
        />

        {/* 🔥 Danger Banner */}
        {showDanger && (

          <div className="danger-banner">
            🚨 DANGER ZONE DETECTED!
          </div>

        )}

        {/* 🔥 MAP */}
        <div className="map">

          <MapContainer
            center={position}
            zoom={15}
            style={{
              height: "100%",
              width: "100%"
            }}
          >

            <TileLayer
url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"            />

            <RecenterMap position={position} />

            <HeatmapLayer hotspots={hotspots} />

            {/* 🔥 User Marker */}
            <Marker position={position}>
  <Popup>
    📍 Your Live Location
  </Popup>
</Marker>
          {/* 📍 Live User Marker */}   
{/* 🟢 / 🔴 Live Risk Circle */}
<Circle
  center={position}
  radius={220}
  pathOptions={{
    color: risk === "High" ? "#d32f2f" : "#2e7d32",
    fillColor: risk === "High" ? "#ef5350" : "#66bb6a",
    fillOpacity: 0.12,
    weight: 2
  }}
/>
          {/* 🔥 SAFE ROUTE */}
{route.length > 0 && (
  <>

    {/* White outer route */}
    <Polyline
      positions={route}
      pathOptions={{
        color: "white",
        weight: 14,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round"
      }}
    />

    {/* Blue navigation route */}
    <Polyline
      positions={route}
      pathOptions={{
        color: "#1a73e8",
        weight: 8,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round"
      }}
    />

    {/* Start Point */}
    <Circle
      center={route[0]}
      radius={25}
      pathOptions={{
        color: "#1a73e8",
        fillColor: "#1a73e8",
        fillOpacity: 1
      }}
    />

    {/* Destination Point */}
    <Circle
      center={route[route.length - 1]}
      radius={25}
      pathOptions={{
        color: "red",
        fillColor: "red",
        fillOpacity: 1
      }}
    />

    {/* 🟢 Safe Zone */}
    <Circle
      center={route[route.length - 1]}
      radius={120}
      pathOptions={{
        color: "#00ff88",
        fillColor: "#00ff88",
        fillOpacity: 0.25,
        weight: 3
      }}
    />

    {/* 🔴 Danger Zone */}
    <Circle
      center={position}
      radius={500}
      pathOptions={{
        color: "red",
        fillColor: "red",
        fillOpacity: 0.15,
        weight: 2
      }}
    />

  </>
)}
  
          </MapContainer>

        </div>

        {/* 🔥 PANEL */}
        <div className="panel">

          <h1 className="title">
            🚨 Crime Prediction
          </h1>

          <p>
            Status: {tracking ? "Tracking..." : "Stopped"}
          </p>

          {/* 🔥 Enable Sound */}
          <button onClick={enableSound}>
            Enable Alert Sound
          </button>

          {!tracking ? (

            <button
              className="start"
              onClick={startTracking}
            >
              Start Tracking
            </button>

          ) : (

            <button
              className="stop"
              onClick={stopTracking}
            >
              Stop Tracking
            </button>

          )}

          {/* 🔥 Risk */}
          <div className={`risk ${risk.toLowerCase()}`}>
            Risk Level: {risk}
          </div>

          {/* 🔥 Safe Route */}
          <button onClick={getSafeRoute}>
            Get Safe Route
          </button>

          {/* 🔥 Legend */}
          <div className="legend">

            <p>
              <span className="low"></span>
              Low
            </p>

            <p>
              <span className="medium"></span>
              Medium
            </p>

            <p>
              <span className="high"></span>
              High
            </p>

          </div>

          <p className="stats">
            Nearby Risk Zones: {hotspots.length}
          </p>

          {loading && (
            <p>Loading crime data...</p>
          )}

          <p className="message">

            {risk === "High"
              ? "🚨 Move away immediately!"
              : risk === "Medium"
              ? "⚠ Stay alert"
              : "✅ You are safe"}

          </p>
          {/* 🔥 Risk History */}

<div
  style={{
    marginTop: "25px",
    background: "#0f2633",
    padding: "18px",
    borderRadius: "18px",
    color: "white",
    boxShadow: "0 0 10px rgba(0,255,255,0.15)"
  }}
>

  <h3
    style={{
      color: "#ff4d4d",
      textAlign: "center",
      marginBottom: "18px",
      fontSize: "24px"
    }}
  >
    Risk History
  </h3>

  <table
  style={{
    width: "100%",
    textAlign: "center",
    borderSpacing: "0 12px"
  }}
>

    <thead>

      <tr>

        <th style={{ color: "#00ff99" }}>
          Area
        </th>

        <th style={{ color: "#00ff99" }}>
          Risk
        </th>

      </tr>

    </thead>

    <tbody>

      <tr>

        <td>RR Nagar</td>

        <td style={{ color: "orange" }}>
          Medium
        </td>

      </tr>

      <tr>

        <td>Nagasandra</td>

        <td style={{ color: "red" }}>
          High
        </td>

      </tr>

      <tr>

        <td>Majestic</td>

        <td style={{ color: "yellow" }}>
          Medium
        </td>

      </tr>

    </tbody>

  </table>

</div>

        </div>
      </div>
    </>
  );
}


export default App;