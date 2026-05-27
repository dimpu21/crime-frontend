import React, { useState } from "react";
import { getDatabase, ref, update } from "firebase/database";

const Emergency = () => {

const [emergency1, setEmergency1] = useState("");
const [emergency2, setEmergency2] = useState("");
const [emergency3, setEmergency3] = useState("");

const saveContacts = () => {

try {

const db = getDatabase();

update(
ref(db, "users/8861717294"), // Replace later with logged in user
{
emergency1,
emergency2,
emergency3
}
);

alert("✅ Emergency contacts saved");

} catch (error) {

console.log(error);

alert("❌ Failed to save");

}

};

return (

<div className="emergency-page">

<div className="emergency-card">

<h1>🚨 Emergency SOS</h1>

<p className="emergency-subtext">
Immediate emergency assistance and live safety actions
</p>

{/* Emergency Inputs */}

<input
type="text"
placeholder="Emergency Contact 1"
value={emergency1}
onChange={(e)=>setEmergency1(e.target.value)}
/>

<br /><br />

<input
type="text"
placeholder="Emergency Contact 2"
value={emergency2}
onChange={(e)=>setEmergency2(e.target.value)}
/>

<br /><br />

<input
type="text"
placeholder="Emergency Contact 3"
value={emergency3}
onChange={(e)=>setEmergency3(e.target.value)}
/>

<br /><br />

<button
onClick={saveContacts}
>
💾 Save Contacts
</button>

<br /><br />

{/* Call Police */}

<button
className="police-btn"
onClick={() => {

window.location.href = "tel:100";

alert("📞 Calling Police...");

}}
>
🚓 Call Police
</button>

<br /><br />

{/* SOS */}

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

window.open(
whatsappURL,
"_blank"
);

},

() => {

alert("Location access denied");

}

);

}}
>
🚨 Send SOS
</button>

<br /><br />

{/* Share Location */}

<button
className="location-btn"
onClick={() => {

navigator.geolocation.getCurrentPosition(

(position)=>{

const lat =
position.coords.latitude;

const lng =
position.coords.longitude;

const mapsLink =
`https://maps.google.com/?q=${lat},${lng}`;

const message =
`📍 My Live Location:\n${mapsLink}`;

window.open(
`https://wa.me/?text=${encodeURIComponent(message)}`,
"_blank"
);

},

()=>{

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