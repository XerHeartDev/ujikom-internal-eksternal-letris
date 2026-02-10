import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600"
            onClick={closeMenu}
          >
            📚 BookStore
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="nav-link">
              Home
            </Link>

            {isAuthenticated && (
              <Link to="/library" className="nav-link">
                My Library
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/account" className="nav-link">
                  Account
                </Link>

                <div className="flex gap-2">
                  {isAuthenticated && user.role === "admin" && (
                    <Link to="/admin" className="btn-primary">
                      Admin Panel
                    </Link>
                  )}

                  <button onClick={logout} className="btn-danger">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
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
            <Link to="/" onClick={closeMenu} className="mobile-link">
              Home
            </Link>

            {isAuthenticated && (
              <Link to="/library" onClick={closeMenu} className="mobile-link">
                My Library
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={closeMenu} className="mobile-link">
                  Account
                </Link>

                <div className="flex flex-col gap-2">
                  {isAuthenticated && user.role === "admin" && (
                    <Link to="/admin" className="btn-primary block">
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="btn-danger"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="btn-primary block"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
