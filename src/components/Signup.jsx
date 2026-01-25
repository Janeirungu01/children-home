import { useState } from "react";
import axios from "axios";
import { API } from "../Config";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e) => {
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
          role,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(data.message || "User created successfully");

      // reset form
      setFullName("");
      setEmail("");
      setUserName("");
      setPassword("");
      setRole("ADMIN");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold text-secondary mb-4">
        Create User
      </h2>

      <form
        onSubmit={handleCreateUser}
        className=" space-y-3"
      >
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Temporary Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="border p-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Creating User..." : "Create User"}
        </button>
      </form>
    </div>
    </div>
  );
}
