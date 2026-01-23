import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../Config";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API.BASE_URL}${API.SIGNUP}`,
        {
          username: userName,
          email,
          fullName,
          password,
          role: isAdmin ? "ADMIN" : "USER",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert(data.message || "Account created successfully");

      // Redirect to login after successful signup
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);

      // Axios error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(error.response.data.message || "Signup failed");
      } else if (error.request) {
        // Request was made but no response received
        alert("No response from server. Please try again.");
      } else {
        // Something else happened
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">Create Account</h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-md p-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@email.com"
              className="w-full border border-gray-300 rounded-md p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-md p-2"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Admin Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="admin" className="text-sm font-medium">
              Register as Admin
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white font-bold py-2 rounded-md ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-bold hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
