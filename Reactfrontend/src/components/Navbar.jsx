import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const normalizedRole = role?.toUpperCase();

  const isAdmin =
    normalizedRole === "ADMIN" ||
    normalizedRole === "ROLE_ADMIN";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link
          className="navbar-brand fw-bold fs-3"
          to="/"
        >
          🛒 SmartCart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/products"
              >
                Products
              </Link>
            </li>

            {token && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/cart"
                  >
                    <i className="bi bi-cart3" /> Cart
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/wishlist"
                  >
                    <i className="bi bi-heart" /> Wishlist
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/orders"
                  >
                    Orders
                  </Link>
                </li>
              </>
            )}

            {token && isAdmin && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-info fw-bold"
                    to="/admin/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link text-warning fw-bold"
                    to="/admin/orders"
                  >
                    Admin Orders
                  </Link>
                </li>
              </>
            )}

            {token ? (
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="btn btn-warning ms-2"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;