import api from "../services/api";

export default function UserCard({ user }, editFunction) {
  const handleDelete = async (e) => {
    e.preventDefault();
    const id = e.currentTarget.dataset.userId;

    try {
      await api.delete(`/users/${id}`);
    //   setLoading(true);
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    } finally {
    //   setLoading(false);
      window.location.reload();
      alert("User Deleted Succesfully");
    }

    // alert("ini tombol delete");
  };
  return (
    <>
      <div className="flex flex-col justify-between border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition duration-200 gap-1">
        <h3 className="text-lg font-bold">{user.name}</h3>
        <p>
          <span className="font-semibold">Email: </span>
          <span>{user.email}</span>
        </p>
        <p>
          <span className="font-semibold">Role: </span>
          <span>{user.role === "admin" ? <>Admin</> : <>User</>}</span>
        </p>

        <div className="flex gap-2">
          <button
            className="btn-primary w-full"
            data-user-id={user.id}
            onClick={editFunction}
          >
            Edit
          </button>
          <button
            className="btn-danger w-full"
            data-user-id={user.id}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
