import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user, logout, updateUser } = useAuth();

  const [mode, setMode] = useState("view");

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdateInfo = async () => {
    setError("");
    setMessage("");

    try {
      const data = {
        name: name,
        email: email,
      };
      const res = await api.put(`/users/${user.id}`, data);

      updateUser(res.data.userData);
      setMessage(res.data?.message);
    } catch (err) {
      setError(err.res.data?.message);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setMessage("");
    
    try {
      const data = {
        old_password: oldPassword,
        new_password: newPassword,
      };
      const res = await api.put(`/users/${user.id}/password`, data);

      setMessage(res.data?.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response.data?.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Yakin ingin menghapus akun?")) return;

    try {
      await api.delete(`/users/${user.id}`);
      logout();
    } catch {
      alert("Gagal menghapus akun");
    }
  };

  return (
    <div className="flex p-6">
      {/* Container */}
      <div className="bg-white border rounded-xl shadow-sm p-6 w-full">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Account Settings
        </h1>

        {/* Alerts */}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* ================= VIEW MODE ================= */}
        {mode === "view" && (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setMode("edit")}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Change Account Information
              </button>

              <button
                onClick={() => setMode("password")}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Change Password
              </button>

              <button
                onClick={logout}
                className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
              >
                Logout
              </button>

              <button
                onClick={handleDeleteAccount}
                className="w-full border-2 border-red-500 text-red-600 py-2 rounded hover:bg-red-50 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* ================= EDIT INFO ================= */}
        {mode === "edit" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleUpdateInfo}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>

              <button
                onClick={() => setMode("view")}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ================= CHANGE PASSWORD ================= */}
        {mode === "password" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Old Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old Password"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Change Password
              </button>

              <button
                onClick={() => setMode("view")}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
