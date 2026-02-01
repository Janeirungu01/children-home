import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import apiPublic from "../api/axiosPublic";
import { API } from "../api/endpoints";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiPublic.post(API.LOGIN, {
        username: userName,
        password,
      });

      const token = response?.data?.result?.sessionId;
      if (!token) {
        alert("Login failed: token not found.");
        return;
      }

      // Store token
      localStorage.setItem("token", token);

      // Decode JWT
      const decoded = jwtDecode(token);
      const role = decoded?.role;

      if (!role) {
        alert("Login failed: role not found.");
        return;
      }

      localStorage.setItem("role", role);

      // Role-based navigation
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        alert("Access denied. You do not have admin privileges.");
      }
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error?.response?.data?.message ||
        "Incorrect credentials. Please try again.";

      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="username"
              className="w-full border border-gray-300 rounded-md p-2"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember Me
            </label>
            <button
              type="button"
              className="text-primary font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 rounded-md"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
