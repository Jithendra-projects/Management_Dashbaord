import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="brand">
        <div className="logo" />
        <div>
          <div style={{ fontSize: 16 }}>SubManager</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Subscription Dashboard
          </div>
        </div>
      </div>

      <div className="nav-left">
        <Link className="nav-link" to="/plans">
          Plans
        </Link>
        <Link className="nav-link" to="/dashboard">
          Dashboard
        </Link>
        {auth?.user?.role === "admin" && (
          <Link className="nav-link" to="/admin/subscriptions">
            Admin
          </Link>
        )}
      </div>

      <div className="nav-right">
        {!auth?.accessToken ? (
          <>
            <Link className="nav-link" to="/login">
              Login
            </Link>
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </>
        ) : (
          <div className="user-menu">
            <div style={{ textAlign: "right", marginRight: 8 }}>
              <div style={{ fontWeight: 700 }}>{auth.user?.name || "User"}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {auth.user?.email}
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
