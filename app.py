from flask import Flask, request, jsonify
import pandas as pd
import time
import math
import requests
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import os
import json
import asyncio
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

# 🔥 Firebase Initialization
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

cred = credentials.Certificate(os.path.join(BASE_DIR, "firebase-key.json"))
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL":
        "https://crime-55c96-default-rtdb.asia-southeast1.firebasedatabase.app/"
    }
)

# 🔥 Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

data = pd.read_csv(
    os.path.join(BASE_DIR, "processed_crime_data.csv")
)
LAT_COL = "LATITUDE"
LNG_COL = "LONGITUDE"

# 🔥 Telegram setup
CHAT_IDS =os.getenv("CHAT_IDS").split(",")
BOT_TOKEN = os.getenv("BOT_TOKEN")
print("Telegram initialized FINAL TEST")

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

@app.route("/heatmap")
def heatmap():

    points = data[[LAT_COL, LNG_COL]].dropna().values.tolist()

    heat_data = [
        {
            "lat": float(lat),
    "lng": float(lng),
    "intensity": 0.3
        }
        for lat, lng in points
    ]
    print("POINTS:", len(points))
    print("SAMPLE:", heat_data[:5])

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

    if risk == "High":

        print("ENTERED HIGH RISK BLOCK")
        print("HIGH RISK DETECTED")
        print("CHAT_IDS:", CHAT_IDS)

        try:

            from datetime import datetime
            from zoneinfo import ZoneInfo

            current_time = datetime.now(
            ZoneInfo("Asia/Kolkata")
            ).strftime("%d-%m-%Y %I:%M:%S %p")

            maps_link = (
                f"https://maps.google.com/?q="
                f"{user_lat},{user_lng}"
            )

            telegram_message = f"""
🚨🚨🚨 EXTREME DANGER ALERT 🚨🚨🚨

YOU HAVE ENTERED A HIGH RISK CRIME ZONE

⚠ MOVE AWAY IMMEDIATELY

🕒 Time:
{current_time}

📍 Live Location:
{maps_link}
"""

            print("SENDING TELEGRAM ALERT")
            print("CHAT IDS:", CHAT_IDS)
            print("MESSAGE:\n", telegram_message)

            # 🔥 TELEGRAM ALERT

            for chat_id in CHAT_IDS:
                try:
                    print("SENDING TO:", chat_id)

                    response = requests.post(
                        f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                        json={
                            "chat_id": str(chat_id).strip(),
                            "text": telegram_message
                        },
                        timeout=10
                    )
                    
                    print("STATUS:", response.status_code)
                    print("BODY:", response.text)
                    print("STATUS:", response.status_code)
                    print("BODY:", response.text)

                    try:
                       telegram_result = response.json()
                    except:
                       telegram_result = {}

                    if response.status_code == 200 and telegram_result.get("ok") == True:
                        print("✅ TELEGRAM SENT SUCCESSFULLY")
                    else:
                        print("❌ TELEGRAM FAILED")
                        print("TELEGRAM RESPONSE:", telegram_result)
                except Exception as e:
                    print("TELEGRAM ERROR:", str(e))

        
            # 🔥 SMS ALERT
            # 🔥 SMS ALERT
            # 🔥 SMS ALERT
            # 🔥 SMS ALERT
            try:

                sms_message = f"""
EMERGENCY ALERT!

High risk crime zone detected.

Live Location:
{maps_link}
"""

                phone = str(
                    request.get_json().get(
                        "phone",
                        ""
                    )
                ).strip()

                if phone:

                    user_ref = db.reference(
                        f"/users/{phone}"
                    )

                    user_data = user_ref.get()

                    if user_data:

                        print(
                            "USER:",
                            phone
                        )

                        numbers = [

                            user_data.get(
                                "emergency1"
                            ),

                            user_data.get(
                                "emergency2"
                            ),

                            user_data.get(
                                "emergency3"
                            )
                        ]

                        for number in numbers:

                            if number:

                                send_sms(

                                    str(number),

                                    sms_message
                                )

                                print(
                                    f"SMS SENT TO {number}"
                                )

                    else:

                        print(
                            "USER NOT FOUND"
                        )

                else:

                    print(
                        "PHONE NOT RECEIVED"
                    )

            except Exception as sms_error:

                print(
                    "SMS ERROR:",
                    str(sms_error)
                )
            last_alert_time = current_time

            last_alert_time = current_time

        except Exception as e:

            print(
                "ALERT ERROR:",
                e
            )

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
        print("REQUEST RECEIVED:", req)

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