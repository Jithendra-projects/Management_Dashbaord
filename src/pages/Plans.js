import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { getPlans, subscribe as mockSubscribe } from "../utils/mockApi";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await getPlans();
        setPlans(p);
      } catch (err) {
        setMessage("Failed to load plans.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubscribe(planId) {
    setSubscribing(planId);
    setMessage(null);
    try {
      const accessToken = window.__demoAccessToken || null;
      const res = await mockSubscribe(planId, accessToken);
      setMessage(`Subscribed to ${res.plan.name} successfully.`);
    } catch (err) {
      setMessage("Subscription failed.");
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Available Plans</h2>
      </div>

      {loading ? (
        <div className="card">Loading plans…</div>
      ) : (
        <>
          <div className="plans-grid">
            {plans.map((p) => (
              <div className="plan-card" key={p.id}>
                <div className="plan-title">{p.name}</div>
                <div className="plan-price">${p.price}</div>
                <div className="plan-features">
                  <ul>
                    {p.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn"
                    onClick={() => handleSubscribe(p.id)}
                    disabled={subscribing === p.id}
                  >
                    {subscribing === p.id ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {message && (
            <div style={{ marginTop: 18 }} className="small">
              {message}
            </div>
          )}
        </>
      )}
    </div>
  );
}
