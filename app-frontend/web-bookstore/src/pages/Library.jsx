import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLibrary = async () => {
    try {
      const res = await api.get("/rentals/my-library");
      setBooks(res.data.rentalsData || []);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to fetch library data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  if (loading) return <p className="p-6">Loading library...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (books.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Your library is still empty
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Library</h1>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((item) => (
          <div
            key={item.rental_id}
            className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Book Cover */}
            <img
              src={
                item.cover_path ||
                "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg"
              }
              alt=""
            />

            {/* Book Title */}
            <h3 className="font-semibold text-lg text-gray-800">
              {item.title}
            </h3>

            {/* Author */}
            <p className="text-sm text-gray-500 mt-1">{item.author}</p>

            {/* Divider */}
            <hr className="my-3" />

            {/* Due Date */}
            <p className="text-xs text-gray-600">
              Due date:
              <span className="ml-1 font-medium text-gray-800">
                {new Date(item.due_date).toLocaleDateString()}
              </span>
            </p>

            {/* Action */}
            <Link
              to={`/books/${item.book_id}/read`}
              className="inline-flex items-center justify-center mt-4 w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition"
            >
              Read Book
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
