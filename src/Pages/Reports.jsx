import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

import "../Dashboard.css";

const crimeData = [
  { area: "Majestic", risk: 92 },
  { area: "BTM", risk: 70 },
  { area: "Kengeri", risk: 30 },
  { area: "RR Nagar", risk: 65 },
  { area: "Whitefield", risk: 88 },
  { area: "Electronic City", risk: 76 },
  { area: "Yelahanka", risk: 45 },
  { area: "Hebbal", risk: 58 },
  { area: "Jayanagar", risk: 40 },
  { area: "Indiranagar", risk: 82 },
  { area: "Marathahalli", risk: 72 },
  { area: "Banashankari", risk: 55 },
  { area: "Malleshwaram", risk: 47 },
  { area: "Rajajinagar", risk: 63 },
  { area: "KR Puram", risk: 69 },
];

const pieData = [
  { name: "High", value: 40 },
  { name: "Medium", value: 35 },
  { name: "Low", value: 25 },
];

const trendData = [
  { day: "5 May", crimes: 85 },
  { day: "6 May", crimes: 120 },
  { day: "7 May", crimes: 95 },
  { day: "8 May", crimes: 130 },
  { day: "9 May", crimes: 110 },
  { day: "10 May", crimes: 140 },
  { day: "11 May", crimes: 105 },
];

const COLORS = ["#ff3131", "#ffcc00", "#00ff99"];

const Reports = () => {

  return (

    <div
      style={{
        background: "#021524",
        minHeight: "100vh",
        padding: "18px",
        width: "100%",
        maxWidth: "1350px",
        margin: "0 auto",
        overflowX: "hidden",
        boxSizing: "border-box",
        color: "white",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          marginBottom: "12px",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Crime Analytics Dashboard
      </h1>

      {/* TOP CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
  "repeat(5, 1fr)",
          gap: "18px",
          marginBottom: "12px",
        }}
      >

        {[
          { title: "Total Alerts", value: "248", icon: "🚨" },
          { title: "High Risk Areas", value: "18", icon: "📍" },
          { title: "Police Stations", value: "12", icon: "🚓" },
          { title: "Night Crime Rate", value: "72%", icon: "⚠️" },
          { title: "Emergency Calls", value: "31", icon: "🚑" },
        ].map((item, index) => (

          <div
            key={index}
            style={{
              background: "#08243d",
              border: "2px solid #00e5ff",
              borderRadius: "18px",
              padding: "14px",
              height: "125px",
              textAlign: "center",
              boxShadow: "0 0 18px #00e5ff",
              color: "white",
            }}
          >

            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "8px",
                marginTop: "0px",
              }}
            >
              {item.title}
            </p>

            <h1
              style={{
                fontSize: "24px",
                margin: "5px 0",
              }}
            >
              {item.icon}
            </h1>

            <h2
              style={{
                color: "white",
                fontSize: "22px",
                margin: "5px 0",
                fontWeight: "bold",
              }}
            >
              {item.value}
            </h2>

          </div>

        ))}

      </div>

      {/* MAIN SECTION */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "15px",
          marginBottom: "12px",
        }}
      >

        {/* BAR CHART */}

        <div
          style={{
            background: "#08243d",
            borderRadius: "18px",
            padding: "15px",
            border: "1px solid #2c4d66",
          }}
        >

          <h2
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: "8px",
              fontSize: "24px",
            }}
          >
            Area Risk Levels
          </h2>

          <ResponsiveContainer width="100%" height={220}>

            <BarChart data={crimeData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1b4965"
              />

              <XAxis
                dataKey="area"
                tick={{
                  fill: "white",
                  fontSize: 13
                }}
              />

              <YAxis
                tick={{
                  fill: "white",
                  fontSize: 13
                }}
              />

              <Tooltip />

              <Bar
                dataKey="risk"
                fill="#19c2ff"
                radius={[8, 8, 0, 0]}
              >

                <LabelList
                  dataKey="risk"
                  position="top"
                  fill="white"
                  fontSize={15}
                />

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PIE CHART */}

        <div
          style={{
            background: "#08243d",
            borderRadius: "18px",
            padding: "15px",
            border: "1px solid #2c4d66",
          }}
        >

          <h2
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: "8px",
              fontSize: "20px",
            }}
          >
            Risk Distribution
          </h2>

          <ResponsiveContainer width="100%" height={220}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={65}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >

                {pieData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />

                ))}

              </Pie>

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* LINE CHART */}

      <div
        style={{
          background: "#08243d",
          borderRadius: "18px",
          padding: "15px",
          border: "1px solid #2c4d66",
          width: "100%",
        }}
      >

        <h2
          style={{
            color: "white",
            marginBottom: "8px",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          Crime Trends (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={210}>

          <LineChart data={trendData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1b4965"
            />

            <XAxis
              dataKey="day"
              tick={{ fill: "white" }}
            />

            <YAxis
              tick={{ fill: "white" }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="crimes"
              stroke="#00c3ff"
              strokeWidth={4}
            />

            <LabelList
              dataKey="crimes"
              position="top"
              fill="white"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default Reports;