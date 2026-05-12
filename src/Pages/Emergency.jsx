import React from "react";

const Emergency = () => {

  return (

    <div className="emergency-page">

      <div className="emergency-card">

        <h1>🚨 Emergency SOS</h1>

        <p className="emergency-subtext">
          Immediate emergency assistance and live safety actions
        </p>

        <button
  className="police-btn"
  onClick={() => {

    window.location.href = "tel:100";

    alert("📞 Calling Police...");
  }}
>
  🚓 Call Police
</button>

        <button
  className="sos-btn"
  onClick={() => {

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const mapsLink =
          `https://maps.google.com/?q=${lat},${lng}`;

        const message =
          `🚨 EMERGENCY SOS!\n\nI need help.\nMy live location:\n${mapsLink}`;

        const whatsappURL =
          `https://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");
      },

      () => {
        alert("Location access denied");
      }
    );
  }}
>
  🚨 Send SOS
</button>

        <button
  className="location-btn"
  onClick={() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const mapsLink =
          `https://maps.google.com/?q=${lat},${lng}`;

        const message =
          `📍 My Live Location:\n${mapsLink}`;

        const whatsappURL =
          `https://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");
      },

      () => {
        alert("Location access denied");
      }
    );
  }}
>
  📍 Share Live Location
</button>

        <div className="emergency-footer">

          <div className="footer-box">
            🚑 Ambulance : 108
          </div>

          <div className="footer-box">
            👩 Women Safety : 1091
          </div>

          <div className="footer-box">
            🚓 Police : 100
          </div>

        </div>

      </div>

    </div>
  );
};

export default Emergency;