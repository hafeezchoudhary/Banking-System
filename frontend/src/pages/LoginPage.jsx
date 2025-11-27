import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const nav = useNavigate();
  const refEmail = useRef(null);

  useEffect(() => { refEmail.current?.focus(); }, []);

  const validate = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    if (!pass || pass.length < 4) return "Password must be at least 4 characters";
    return "";
  };

  const doLogin = async (e) => {
    e?.preventDefault();
    setErr("");
    const v = validate();
    if (v) return setErr(v);

    try {
      setBusy(true);
      const res = await API.post("/auth/login", { email, password: pass });
      if (!res?.data?.token || !res?.data?.user) throw new Error("Unexpected server response");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "customer") nav("/customer");
      else nav("/banker");
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb] px-4">
      
      {/* Top Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#2447c1] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold mt-4 text-[#0b1c3f]">SecureBank</h1>
        <p className="text-[#495579] text-sm mt-1">Customer Portal</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl p-8">

        {/* Heading */}
        <h2 className="text-xl font-semibold text-[#0b1c3f] mb-1">Staff Access</h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to access customer accounts</p>

        <form onSubmit={doLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Email</label>
            <input
              id="email"
              ref={refEmail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="banker@bank.com"
              className="w-full border rounded-lg px-4 py-2.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-2.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 cursor-pointer"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Remember me
            </label>
          </div>

          {/* Error */}
          {err && (
            <div className="text-sm bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100">
              ⚠️ {err}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-lg bg-[#1e3a8a] hover:bg-[#163074] text-white text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {busy && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            <span>{busy ? "Signing in..." : "Sign In"}</span>
          </button>

          {/* Switch to customer */}
          <p className="text-center text-sm text-gray-600">
            New User?{" "}
            <button type="button" onClick={() => nav("/signup")} className="text-blue-700 font-medium cursor-pointer">
              Create an account
            </button>
          </p>

          <p className="text-center text-sm text-slate-500">Admin Login <button type="button" onClick={() => nav("/admin-login")} className="text-indigo-600 font-medium cursor-pointer">Admin Login</button></p>

        </form>
      </div>
    </div>
  );
}
