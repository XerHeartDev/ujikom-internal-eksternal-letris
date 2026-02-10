import { useEffect, useState } from "react";
import api from "../services/api";
import UserCard from "../components/UserCard";

export default function HomeAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [nameCreate, setNameCreate] = useState("");
  const [emailCreate, setEmailCreate] = useState("");
  const [roleCreate, setRoleCreate] = useState("");
  const [passwordCreate, setPasswordCreate] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.usersData);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to Load Users Data");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await api.post("/users", {
        name: nameCreate,
        email: emailCreate,
        password: passwordCreate,
        role: roleCreate,
      });
      setShowCreateModal(false);
      setLoading(true);
    } catch (error) {
      alert(error.response?.data?.message || "Create Failed");
    } finally {
      setLoading(false);
      window.location.reload();
      alert("User Created Succesfully");
    }
  };

  // const handleEdit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* Hero Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            User List
          </h1>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Add User/Admin
        </button>
      </div>

      {/* Users List Section */}
      {users.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-gray-500 text-lg">There's no any User</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Users Mapping */}
          {users.map((users) => (
            <UserCard
              key={users.id}
              user={users}
              editFunction={() => setShowEditModal(true)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="bg-white p-6 border-2 border-black rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Account</h2>

            <form
              onSubmit={handleCreate}
              className="space-y-4 gap-4 items-center"
            >
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

              <div>
                <label className="block text-gray-700" for="nameCreate">
                  Name
                </label>
                <input
                  type="text"
                  id="nameCreate"
                  name="nameCreate"
                  onChange={(e) => setNameCreate(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700" for="emailCreate">
                  Email
                </label>
                <input
                  type="email"
                  id="emailCreate"
                  name="emailCreate"
                  onChange={(e) => setEmailCreate(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700" for="passwordCreate">
                  Password
                </label>
                <input
                  type="password"
                  id="passwordCreate"
                  name="passwordCreate"
                  onChange={(e) => setPasswordCreate(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700" for="roleCreate">
                  Role
                </label>
                <select
                  id="roleCreate"
                  name="roleCreate"
                  className="w-full border rounded px-3 py-2 mt-1"
                  onChange={(e) => setRoleCreate(e.target.value)}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 h-11 mt-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded border w-100"
                  onClick={() => {
                    setShowCreateModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded w-100 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
