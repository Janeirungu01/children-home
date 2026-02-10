import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import apiPublic from "../api/axiosPublic";
import { API } from "../api/endpoints";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // NEW

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

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const role = decoded?.role;

      if (!role) {
        alert("Login failed: role not found.");
        return;
      }

      localStorage.setItem("role", role);

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

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      className="w-full border border-gray-300 rounded-md p-2 pr-10"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
</div>


          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember Me
            </label>
            {/* <button
              type="button"
              className="text-primary font-medium hover:underline"
            >
              Forgot Password?
            </button> */}
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
