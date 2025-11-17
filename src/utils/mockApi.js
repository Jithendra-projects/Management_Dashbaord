/**
 * Mock API for demo */

import dayjs from "dayjs";

function createFakeJwt(payload = {}, expiresInSeconds = 60 * 15) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const full = { ...payload, exp };
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(full));
  return `${header}.${body}.signature`;
}

export function decodeFakeJwt(token) {
  try {
    const parts = token.split(".");
    const body = parts[1];
    return JSON.parse(atob(body));
  } catch {
    return null;
  }
}

const plans = [
  {
    id: 1,
    name: "Basic",
    price: 9,
    duration: 30,
    features: ["10 projects", "Basic support", "Single user"],
  },
  {
    id: 2,
    name: "Pro",
    price: 29,
    duration: 90,
    features: ["Unlimited projects", "Priority support", "Team access"],
  },
  {
    id: 3,
    name: "Enterprise",
    price: 99,
    duration: 365,
    features: ["SLA support", "Dedicated manager", "Custom integrations"],
  },
];

let subscriptions = [
  {
    id: 1,
    user: { id: 2, name: "Jithendra", email: "jithendra@example.com" },
    plan: plans[0],
    start_date: "2025-01-12",
    end_date: "2025-02-12",
    status: "Expired",
  },
];

let users = [
  { id: 1, name: "Admin", email: "admin@example.com", role: "admin" },
  { id: 2, name: "Jithendra", email: "jithendra@example.com", role: "user" },
];

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export async function login(email, password) {
  await delay(500);

  const user = users.find((u) => u.email === email) || {
    id: 99,
    name: "Demo User",
    email,
    role: email === "admin@example.com" ? "admin" : "user",
  };

  const accessToken = createFakeJwt(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    120
  );
  const refreshToken = createFakeJwt({ id: user.id }, 60 * 60 * 24);

  return { accessToken, refreshToken, user };
}

export async function register(data) {
  await delay(400);
  const id = Math.floor(Math.random() * 10000) + 100;
  const newUser = { id, name: data.name, email: data.email, role: "user" };
  users.push(newUser);
  return { ok: true, user: newUser };
}

export async function getPlans() {
  await delay(300);
  return plans;
}

export async function subscribe(planId, accessToken) {
  await delay(400);
  const payload = decodeFakeJwt(accessToken);
  if (!payload) throw new Error("Unauthorized");
  const user = users.find((u) => u.id === payload.id) || {
    id: payload.id,
    name: payload.name,
    email: payload.email,
  };

  const plan = plans.find((p) => p.id === Number(planId));
  if (!plan) throw new Error("Plan not found");

  const start = dayjs().format("YYYY-MM-DD");
  const end = dayjs().add(plan.duration, "day").format("YYYY-MM-DD");

  const sub = {
    id: subscriptions.length + 1,
    user,
    plan,
    start_date: start,
    end_date: end,
    status: "Active",
  };
  subscriptions.push(sub);
  return sub;
}

export async function mySubscription(accessToken) {
  await delay(300);
  const payload = decodeFakeJwt(accessToken);
  if (!payload) throw new Error("Unauthorized");
  const userId = payload.id;
  const sub = subscriptions.find(
    (s) => s.user.id === userId && s.status === "Active"
  );
  if (!sub) return null;
  return sub;
}

export async function adminSubscriptions(accessToken) {
  await delay(300);
  const payload = decodeFakeJwt(accessToken);
  if (!payload) throw new Error("Unauthorized");
  if (payload.role !== "admin") throw new Error("Forbidden");
  return subscriptions;
}

export async function refreshToken(refreshToken) {
  await delay(500);
  const payload = decodeFakeJwt(refreshToken);
  if (!payload) throw new Error("Invalid refresh token");

  const user = users.find((u) => u.id === payload.id) || {
    id: payload.id,
    name: "Demo",
    email: "demo@example.com",
    role: "user",
  };
  const newAccess = createFakeJwt(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    120
  );
  const newRefresh = createFakeJwt({ id: user.id }, 60 * 60 * 24);
  return { accessToken: newAccess, refreshToken: newRefresh };
}
