import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear auth data (adjust based on your setup)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full py-2 px-4 text-left bg-red-600 hover:bg-red-700 rounded font-medium"
    >
      Sign Out
    </button>
  );
}
