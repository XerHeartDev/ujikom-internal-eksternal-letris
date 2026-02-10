import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBarAdmin() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/admin"
            className="text-xl font-bold text-blue-600"
            onClick={closeMenu}
          >
            Admin Panel
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/admin" className="nav-link">
              Home
            </Link>
            <Link to="/" className="btn-danger">
              Exit
            </Link>
          </div>

          {/* HAMBURGER BUTTON (MOBILE) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t text-center">
          <div className="px-4 py-3 space-y-2">
            <Link to="/admin" onClick={closeMenu} className="mobile-link">
              Home
            </Link>

            <Link to="/" className="btn-danger block">
              Exit
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
