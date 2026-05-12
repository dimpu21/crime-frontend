from flask import Flask, request, jsonify
import pandas as pd
import time
import math
import requests
from telegram import Bot
from flask_cors import CORS

import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

# 🔥 Firebase Initialization
if not firebase_admin._apps:

    cred = credentials.Certificate(
        "firebase-key.json"
    )

    firebase_admin.initialize_app(
        cred,
        {
            "databaseURL":
            "https://crime-55c96-default-rtdb.asia-southeast1.firebasedatabase.app/"
        }
    )

# 🔥 Load dataset
data = pd.read_csv("processed_crime_data.csv")

LAT_COL = "LATITUDE"
LNG_COL = "LONGITUDE"

# 🔥 Telegram setup
CHAT_IDS = [
    "8588859383",
    "7448570124"
]

bot = Bot(
    token="8652883076:AAGGE9Bp-4YKS8qFGARkx7ihZAF9S-eDqI8"
)

last_alert_time = 0

# ---------------- SEND SMS FUNCTION ---------------- #

def send_sms(phone, message):

    url = "https://www.fast2sms.com/dev/bulkV2"

    payload = {
        "route": "q",
        "message": message,
        "language": "english",
        "flash": 0,
        "numbers": phone
    }

    headers = {
        "authorization": "QKNsozPuuTcfOjoCNUhIu9KDt9ARzN1p5mzxiXzXlysIty5g9n6aradiaipa",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(
        url,
        data=payload,
        headers=headers
    )

    print("SMS RESPONSE:", response.text)

# ---------------- HEATMAP API ---------------- #

@app.route('/heatmap')
def heatmap():

    points = data[[LAT_COL, LNG_COL]].dropna().values.tolist()

    heat_data = [
        {
            "lat": lat,
            "lng": lng,
            "intensity": 1
        }
        for lat, lng in points
    ]

    return jsonify(heat_data)

# ---------------- CHECK RISK ---------------- #

@app.route('/check-risk', methods=['POST'])
def check_risk():

    global last_alert_time

    req = request.get_json()

    user_lat = req['lat']
    user_lng = req['lng']

    print("CHECK RISK API CALLED")
    print("Latitude:", user_lat)
    print("Longitude:", user_lng)

    # 🔥 FORCE TEST MODE
    risk = "High"

    print("Risk:", risk)

    current_time = time.time()

    # 🔥 SEND ALERTS
    if risk == "High" and current_time - last_alert_time > 20:

        print("HIGH RISK DETECTED")

        try:

            from datetime import datetime

            current_time_str = datetime.now().strftime(
                "%d-%m-%Y %I:%M %p"
            )

            maps_link = (
                f"https://maps.google.com/?q="
                f"{user_lat},{user_lng}"
            )

            telegram_message = f"""
🚨🚨🚨 EXTREME DANGER ALERT 🚨🚨🚨

YOU HAVE ENTERED A HIGH RISK CRIME ZONE

⚠ MOVE AWAY IMMEDIATELY

🕒 Time:
{current_time_str}

📍 Live Location:
{maps_link}
"""

            print("SENDING TELEGRAM ALERT")

            # 🔥 Telegram Alerts
            for chat_id in CHAT_IDS:

                try:

                    bot.send_message(
                        chat_id=chat_id,
                        text=telegram_message
                    )

                    print(
                        f"Message sent to {chat_id}"
                    )

                except Exception as e:

                    print(
                        f"Telegram error for "
                        f"{chat_id}: {e}"
                    )

            print("TELEGRAM ALERT SENT")

            # 🔥 SMS ALERT TO ALL EMERGENCY CONTACTS
            try:

                users_ref = db.reference("users")

                users = users_ref.get()

                sms_message = f"""
EMERGENCY ALERT!

High risk crime zone detected.

Live Location:
{maps_link}
"""

                # 🔥 Send SMS to all contacts
                for user_id, user_data in users.items():

                    numbers = [

                        user_data.get("emergency1"),

                        user_data.get("emergency2"),

                        user_data.get("emergency3")

                    ]

                    for number in numbers:

                        if number:

                            send_sms(number, sms_message)

                            print(f"SMS SENT TO {number}")

            except Exception as e:

                print("SMS ERROR:", e)

            last_alert_time = current_time

        except Exception as e:

            print("ALERT ERROR:", e)

    return jsonify({
        "risk": risk,
        "zone":
        "Danger Zone"
        if risk == "High"
        else "Safe Zone"
    })

# ---------------- SAFE ROUTE API ---------------- #

def distance(lat1, lng1, lat2, lng2):

    return math.sqrt(
        (lat1 - lat2) ** 2 +
        (lng1 - lng2) ** 2
    )

@app.route('/safe-route', methods=['POST'])
def safe_route():

    try:

        req = request.get_json()

        start_lat = req['start_lat']
        start_lng = req['start_lng']

        end_lat = req['end_lat']
        end_lng = req['end_lng']

        url = (
            "http://router.project-osrm.org/"
            f"route/v1/driving/"
            f"{start_lng},{start_lat};"
            f"{end_lng},{end_lat}"
            "?overview=full&geometries=geojson"
        )

        response = requests.get(url)

        data_json = response.json()

        routes = data_json.get("routes")

        if not routes:

            return jsonify({
                "safe_route": [],
                "risky_route": [],
                "message": "No route found"
            })

        coordinates = routes[0][
            "geometry"
        ]["coordinates"]

        route_points = []

        for lng, lat in coordinates:

            route_points.append([lat, lng])

        return jsonify({
            "safe_route": route_points,
            "risky_route": [],
            "message": "Safe route generated"
        })

    except Exception as e:

        print("SAFE ROUTE ERROR:", e)

        return jsonify({
            "safe_route": [],
            "risky_route": [],
            "message": str(e)
        })

# ---------------- RUN ---------------- #

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )