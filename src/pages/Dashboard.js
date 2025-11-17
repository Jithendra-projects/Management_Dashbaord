import React, { useEffect, useState } from "react";
import { mySubscription as mockMySubscription } from "../utils/mockApi";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const auth = useSelector((s) => s.auth);
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const accessToken = auth.accessToken;
        const res = await mockMySubscription(accessToken);
        setSub(res);
      } catch (err) {
        setSub(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [auth.accessToken]);

  const status = sub ? sub.status : "None";

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <div className="row">
        <div className="col card">
          <h3>Subscription</h3>
          {loading ? (
            <div className="small">Loading...</div>
          ) : sub ? (
            <>
              <p>
                Plan: <strong>{sub.plan.name}</strong>
              </p>
              <p>Start: {sub.start_date}</p>
              <p>End: {sub.end_date}</p>
              <p>
                Status:{" "}
                <span
                  className={`status-pill ${
                    sub.status === "Active"
                      ? "status-active"
                      : sub.status === "Expired"
                      ? "status-expired"
                      : "status-none"
                  }`}
                >
                  {sub.status}
                </span>
              </p>
            </>
          ) : (
            <div className="small">You have no active subscription.</div>
          )}
        </div>

        <div className="col card">
          <h3>Profile</h3>
          <p>
            Name: <strong>{auth.user?.name}</strong>
          </p>
          <p>
            Email: <strong>{auth.user?.email}</strong>
          </p>
          <p>
            Role: <strong>{auth.user?.role}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
