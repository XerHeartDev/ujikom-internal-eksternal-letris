import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [book, setBook] = useState(null);
  const [duration, setDuration] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({});
  // const [fileUploadVisible, setFileUploadVisible] = useState(false);
  // const [pdfFile, setPDFFile] = useState();
  // const [imgFile, setIMGFile] = useState();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data.bookData);
        setUpdatedBook(res.data.bookData); // set initial value untuk update
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to retrieve book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      alert("Please Login to Continue Transaction");
      navigate("/login");
      return;
    }

    try {
      const res = await api.post("/payments", {
        book_id: id,
        duration,
      });

      window.snap.pay(res.data.snapToken, {
        onSuccess: () => {
          alert("Payment success!");
          navigate("/library");
        },
        onPending: () => alert("Waiting for payment"),
        onError: () => alert("Payment failed"),
      });
    } catch (err) {
      alert(err.res.data?.message);
    }
  };

  const handleBookChange = (e) => {
    setUpdatedBook({ ...updatedBook, [e.target.name]: e.target.value });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/books/${id}`, updatedBook);
      setBook(res.data);
      setEditMode(false);
      alert(res.data?.message);
      window.location.reload();
    } catch (err) {
      alert(err.res.data?.message);
    }
  };

  // const handlePDFChange = (e) => {
  //   setPDFFile(e.target.files[0]);
  // };
  // const handleIMGChange = (e) => {
  //   setIMGFile(e.target.files[0]);
  // };

  // const handleUploadFiles = async (e) => {
  //   e.preventDefault();

  //   const pdfFormData = new FormData();
  //   pdfFormData.append("file", pdfFile);
  //   const imgFormData = new FormData();
  //   imgFormData.append("file", imgFile);
  //   console.log(pdfFormData);
  //   console.log(imgFormData);

  //   try {
  //     await api.post(`/books/${id}/upload`, pdfFormData, {
  //       headers: { "content-type": "multipart/formData" },
  //     });
  //     await api.post(`/books/${id}/upload-cover`, imgFormData, {
  //       headers: { "content-type": "multipart/formData" },
  //     });
  //     alert("Files uploaded successfully!");
  //     setFileUploadVisible(false);
  //     // eslint-disable-next-line no-unused-vars
  //   } catch (err) {
  //     alert("Failed to upload files");
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading book...</p>
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
  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Book not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Book Detail */}
        <div className="lg:col-span-2 bg-white border rounded-lg p-6">
          {editMode ? (
            <form onSubmit={handleUpdateBook} className="space-y-4">
              <div>
                <label className="block text-gray-700">Image Cover URL</label>
                <input
                  type="text"
                  name="cover_path"
                  value={updatedBook.cover_path || ""}
                  onChange={handleBookChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={updatedBook.title || ""}
                  onChange={handleBookChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={updatedBook.author || ""}
                  onChange={handleBookChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={updatedBook.publisher || ""}
                    onChange={handleBookChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={updatedBook.isbn || ""}
                    onChange={handleBookChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700">Total Pages</label>
                  <input
                    type="number"
                    name="total_pages"
                    value={updatedBook.total_pages || ""}
                    onChange={handleBookChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Publish Year</label>
                  <input
                    type="number"
                    name="publish_year"
                    value={updatedBook.publish_year || ""}
                    onChange={handleBookChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Digitized Year</label>
                  <input
                    type="number"
                    name="digitized_year"
                    value={updatedBook.digitized_year || ""}
                    onChange={handleBookChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
              </div>

              <div className="float-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex gap-3">
                <img
                  src={
                    book.cover_path ||
                    "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg"
                  }
                  alt=""
                  className="w-2/5 p-2"
                />

                <div className="">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {book.title}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    by <span className="font-medium">{book.author}</span>
                  </p>

                  <p className="mt-4 text-sm">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        book.status === "available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {book.status}
                    </span>
                  </p>

                  <hr className="my-5" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Publisher</p>
                      <p className="font-medium text-gray-800">
                        {book.publisher || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">ISBN</p>
                      <p className="font-medium text-gray-800">
                        {book.isbn || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Pages</p>
                      <p className="font-medium text-gray-800">
                        {book.total_pages || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Publish Year</p>
                      <p className="font-medium text-gray-800">
                        {book.publish_year || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Digitized Year</p>
                      <p className="font-medium text-gray-800">
                        {book.digitized_year || "-"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-gray-600 leading-relaxed">
                    This digital book is available for rent and can be read
                    directly through your device after a successful transaction.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Section Rent */}
        <div className="bg-white border rounded-lg p-6 h-fit">
          <h2 className="text-lg font-semibold mb-3">Rent This Book</h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Rent Duration (Days)
            </label>
            <select
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>
          <button
            onClick={handleOrder}
            disabled={book.status !== "available"}
            className="
              w-full
              bg-blue-600
              text-white
              py-2
              rounded
              hover:bg-blue-700
              transition
              disabled:bg-gray-400
              disabled:cursor-not-allowed
            "
          >
            Order Rental
          </button>

          {/* Buttons Update Book & Upload File */}
          {isAuthenticated && user.role === "admin" && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Update Book
              </button>
              {/* <button
                onClick={() => setFileUploadVisible(!fileUploadVisible)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
              >
                Upload File
              </button> */}
            </div>
          )}
        </div>
      </div>

      {/* Section Upload File */}
      {/* {fileUploadVisible && (
        <div className="bg-white border rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
          <form onSubmit={handleUploadFiles} className="space-y-4">
            <div>
              <label className="block text-gray-700">Book PDF</label>
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                onChange={handlePDFChange}
                className="w-full mt-1 border border-black rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Cover Image</label>
              <input
                type="file"
                name="cover"
                accept="image/*"
                onChange={handleIMGChange}
                className="w-full mt-1 border border-black rounded px-4 py-2"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload
            </button>
          </form>
        </div>
      )} */}
    </div>
  );
}
