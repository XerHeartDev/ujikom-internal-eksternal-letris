import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [total_pages, setTotalPages] = useState("");
  const [publish_year, setPublishYear] = useState("");
  const [digitized_year, setDigitizedYear] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data.booksData);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Gagal memuat data buku");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/books", {
        title,
        author,
        publisher,
        isbn,
        total_pages,
        publish_year,
        digitized_year,
      });
      alert(res.data.message);

      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Create Failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading books...</p>
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Book List
          </h1>
          <p className="text-gray-500 mt-1">
            Find and rent your favorite digital books
          </p>
        </div>

        {isAuthenticated && user.role === "admin" && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            Add Book
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-gray-500 text-lg">Belum ada buku yang tersedia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="bg-white p-6 border-2 border-black rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 grid grid-cols-2 gap-4 items-center"
            >
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Publisher</label>
                <input
                  type="text"
                  name="publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">ISBN</label>
                <input
                  type="number"
                  name="isbn"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Total Pages</label>
                <input
                  type="number"
                  name="total_pages"
                  value={total_pages}
                  onChange={(e) => setTotalPages(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Publish Year</label>
                <input
                  type="number"
                  name="publish_year"
                  value={publish_year}
                  onChange={(e) => setPublishYear(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Digitized Year</label>
                <input
                  type="number"
                  name="digitized_year"
                  value={digitized_year}
                  onChange={(e) => setDigitizedYear(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              <div className="flex gap-2 h-11 mt-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded border w-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded w-100 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
