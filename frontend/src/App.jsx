import { useEffect, useState } from "react";
import axios from "axios";

const PRIORITY = {
  Placement: { label: "HIGH", color: "#16a34a" },
  Result: { label: "MEDIUM", color: "#2563eb" },
  Event: { label: "LOW", color: "#ca8a04" }
};

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/notifications").then((res) => {
      setNotifications(res.data.notifications);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "All" ? notifications : notifications.filter((n) => n.Type === filter);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Campus Notifications</h1>
      <p style={{ color: "#6b7280" }}>{notifications.length} notifications loaded</p>

      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        {["All", "Placement", "Result", "Event"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: "8px 16px",
              background: filter === type ? "#4f46e5" : "#e5e7eb",
              color: filter === type ? "white" : "black",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        filtered.map((n) => (
          <div
            key={n.ID}
            style={{
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: n.Type === "Placement" ? "#f0fdf4" : n.Type === "Result" ? "#eff6ff" : "#fefce8"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontWeight: "bold" }}>{n.Type}</span>
                <span style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "99px",
                  background: PRIORITY[n.Type]?.color,
                  color: "white"
                }}>
                  {PRIORITY[n.Type]?.label}
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{n.Timestamp}</span>
            </div>
            <p style={{ margin: "8px 0 0" }}>{n.Message}</p>
          </div>
        ))
      )}
    </div>
  );
}