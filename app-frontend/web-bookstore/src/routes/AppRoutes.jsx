import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import BookDetail from "../pages/BookDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Library from "../pages/Library";
import ReadBook from "../pages/ReadBook";
import Account from "../pages/Account";
import MainLayout from "../layouts/MainLayout.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id/read"
            element={
              <ProtectedRoute>
                <ReadBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
