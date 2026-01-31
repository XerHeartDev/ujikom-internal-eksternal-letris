import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="
        group
        flex
        flex-col
        justify-between
        border
        rounded-lg
        p-4
        bg-white
        shadow-sm
        hover:shadow-lg
        transition
        duration-200
      "
    >
      <div>
        <img
          src={
            book.cover_path ||
            "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg"
          }
          alt=""
          className="p-2"
        />

        <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500">{book.author}</p>

        <p className="text-xs mt-2">
          Status:{" "}
          <span
            className={`font-medium ${
              book.status === "available" ? "text-green-600" : "text-red-600"
            }`}
          >
            {book.status}
          </span>
        </p>
      </div>

      <div className="mt-4">
        <span
          className="
            text-sm
            text-blue-600
            font-medium
          "
        >
          See Details →
        </span>
      </div>
    </Link>
  );
}
