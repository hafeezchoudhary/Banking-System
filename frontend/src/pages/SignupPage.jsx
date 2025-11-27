import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const nav = useNavigate();
  const refName = useRef(null);

  useEffect(() => {
    refName.current?.focus();
  }, []);

  const validate = () => {
    if (!fullName.trim()) return "Please enter your full name";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Enter a valid email address";
    if (!pw || pw.length < 4)
      return "Password must be at least 4 characters";
    if (pw !== confirm) return "Passwords do not match";
    return "";
  };

  const doRegister = async (e) => {
    e?.preventDefault();
    setErr("");
    setOk("");
    const v = validate();
    if (v) return setErr(v);

    try {
      setBusy(true);
      await API.post("/auth/register", {
        name: fullName.trim(),
        email: email.trim(),
        password: pw,
      });

      setOk("🎉 Registered successfully! Redirecting to login...");
      setTimeout(() => nav("/"), 1200);
    } catch (e) {
      console.error("register error:", e);
      setErr(
        e?.response?.data?.message ||
        e?.message ||
        "Error during signup"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb] px-4">

      {/* Top Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#2447c1] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.7}
              d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold mt-4 text-[#0b1c3f]">SecureBank</h1>
        <p className="text-[#495579] text-sm mt-1">Create your account</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl p-8">

        <h2 className="text-xl font-semibold text-[#0b1c3f] mb-1">
          Customer Registration
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Join SecureBank and start your journey
        </p>

        <form onSubmit={doRegister} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              ref={refName}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full border rounded-lg px-4 py-2.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-lg px-4 py-2.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Create a password"
                className="w-full border rounded-lg px-4 py-2.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="w-full border rounded-lg px-4 py-2.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Error */}
          {err && (
            <div className="text-sm bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100">
              ⚠️ {err}
            </div>
          )}

          {/* Success */}
          {ok && (
            <div className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-100">
              ✅ {ok}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-lg bg-[#1e3a8a] hover:bg-[#163074] text-white text-sm font-medium transition flex items-center justify-center gap-2"
          >
            {busy && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            <span>{busy ? "Creating account..." : "Sign Up"}</span>
          </button>

          {/* Switch to login */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => nav("/")}
              className="text-blue-700 font-medium"
            >
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
