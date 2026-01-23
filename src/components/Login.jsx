import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../Config";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

     try {
      const response = await fetch(`${API.BASE_URL}${API.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: password,
        }),
      });

      const data = await response.json();

      // login failed
      if (!response.ok) {
        alert(data.message || "Invalid username or password");
        return;
      }

      // login succeeded
      localStorage.setItem("token", data.result.token);
      localStorage.setItem("role", data.result.role);

      // Only navigate to /admin if the user is ADMIN
      if (data.result.role === "ADMIN") {
        navigate("/admin");
      } else {
        // login succeeds but role is not admin
        alert("Access denied. You do not have admin privileges.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to login. Please try again.");
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

        <p className="mt-4 text-sm text-gray-600">
          Don't have an account yet?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-primary font-bold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
