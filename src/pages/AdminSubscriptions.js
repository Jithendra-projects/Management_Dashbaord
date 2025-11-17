import React, { useEffect, useState } from "react";
import { adminSubscriptions as mockAdminSubscriptions } from "../utils/mockApi";
import { useSelector } from "react-redux";

export default function AdminSubscriptions() {
  const auth = useSelector((s) => s.auth);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await mockAdminSubscriptions(auth.accessToken);
        setSubs(res);
      } catch (err) {
        setSubs([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [auth.accessToken]);

  return (
    <div className="container">
      <div className="card">
        <h2>All Subscriptions</h2>

        {loading ? (
          <div className="small">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td>{s.user.name}</td>
                    <td>{s.plan.name}</td>
                    <td>{s.start_date}</td>
                    <td>{s.end_date}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          s.status === "Active"
                            ? "status-active"
                            : s.status === "Expired"
                            ? "status-expired"
                            : "status-none"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
