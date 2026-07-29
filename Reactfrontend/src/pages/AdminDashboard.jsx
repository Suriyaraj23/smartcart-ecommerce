import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "../services/userService";
import { getAllProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { getAllOrders } from "../services/orderService";

function AdminDashboard() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        loadDashboard();
    }, [token]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                userResponse,
                productResponse,
                categoryResponse,
                orderResponse
            ] = await Promise.all([
                getAllUsers(),
                getAllProducts(),
                getAllCategories(),
                getAllOrders()
            ]);

            setUsers(
                Array.isArray(userResponse.data)
                    ? userResponse.data
                    : []
            );

            setProducts(
                Array.isArray(productResponse.data)
                    ? productResponse.data
                    : []
            );

            setCategories(
                Array.isArray(categoryResponse.data)
                    ? categoryResponse.data
                    : []
            );

            setOrders(
                Array.isArray(orderResponse.data)
                    ? orderResponse.data
                    : []
            );
        } catch (error) {
            console.error("Dashboard loading failed:", error);
            console.error(
                "Backend response:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    const customerCount = users.filter((user) => {
        const userRole =
            user.role?.name ||
            user.role ||
            "";

        return String(userRole).toUpperCase() === "CUSTOMER";
    }).length;

    const revenue = orders
        .filter((order) => order.status !== "CANCELLED")
        .reduce(
            (sum, order) =>
                sum + Number(order.totalAmount || 0),
            0
        );

    const recentOrders = [...orders]
        .sort(
            (firstOrder, secondOrder) =>
                Number(secondOrder.id) -
                Number(firstOrder.id)
        )
        .slice(0, 5);

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toLocaleString(
            "en-IN"
        )}`;
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "Not available";
        }

        return new Date(dateValue).toLocaleString(
            "en-IN"
        );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "DELIVERED":
                return "bg-success";

            case "SHIPPED":
                return "bg-primary";

            case "CONFIRMED":
                return "bg-info text-dark";

            case "CANCELLED":
                return "bg-danger";

            default:
                return "bg-warning text-dark";
        }
    };

    if (!token) {
        return (
            <div className="container mt-5 text-center">
                <h2>Admin Dashboard</h2>

                <p>Please login to continue.</p>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </div>
        );
    }

    if (
        role &&
        role.toUpperCase() !== "ADMIN"
    ) {
        return (
            <div className="container mt-5 text-center">
                <h2>Access Denied</h2>

                <p>
                    Only admin users can access this page.
                </p>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <h3>Loading dashboard...</h3>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    Admin Dashboard
                </h2>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={loadDashboard}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row">

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <div className="card text-center shadow h-100">
                        <div className="card-body">
                            <i className="bi bi-people fs-1 text-primary"></i>

                            <h5 className="mt-2">
                                Total Customers
                            </h5>

                            <h2>{customerCount}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <div className="card text-center shadow h-100">
                        <div className="card-body">
                            <i className="bi bi-box-seam fs-1 text-success"></i>

                            <h5 className="mt-2">
                                Total Products
                            </h5>

                            <h2>{products.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <div className="card text-center shadow h-100">
                        <div className="card-body">
                            <i className="bi bi-tags fs-1 text-warning"></i>

                            <h5 className="mt-2">
                                Total Categories
                            </h5>

                            <h2>{categories.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <div className="card text-center shadow h-100">
                        <div className="card-body">
                            <i className="bi bi-bag-check fs-1 text-danger"></i>

                            <h5 className="mt-2">
                                Total Orders
                            </h5>

                            <h2>{orders.length}</h2>
                        </div>
                    </div>
                </div>

            </div>

            <div className="card shadow mb-4">
                <div className="card-body text-center">
                    <i className="bi bi-currency-rupee fs-1 text-success"></i>

                    <h4>Total Revenue</h4>

                    <h1 className="text-success">
                        {formatAmount(revenue)}
                    </h1>

                    <small className="text-muted">
                        Cancelled orders are excluded
                    </small>
                </div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">
                            Recent Orders
                        </h4>

                        <Link
                            to="/admin/orders"
                            className="btn btn-primary btn-sm"
                        >
                            Manage All Orders
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p className="text-center mb-0">
                            No orders available.
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle text-center">

                                <thead className="table-dark">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>View</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>

                                            <td>{order.id}</td>

                                            <td>
                                                {order.user?.name ||
                                                    "Not available"}
                                            </td>

                                            <td>
                                                {order.user?.email ||
                                                    "Not available"}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    order.orderDate
                                                )}
                                            </td>

                                            <td>
                                                {formatAmount(
                                                    order.totalAmount
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusClass(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status ||
                                                        "PLACED"}
                                                </span>
                                            </td>

                                            <td>
                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    View
                                                </Link>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}

                </div>
            </div>

            <div className="row">

                <div className="col-md-4 mb-3">
                    <Link
                        to="/admin/orders"
                        className="btn btn-dark w-100 py-3"
                    >
                        Manage Orders
                    </Link>
                </div>

                <div className="col-md-4 mb-3">
                    <Link
                        to="/products"
                        className="btn btn-dark w-100 py-3"
                    >
                        View Products
                    </Link>
                </div>

                <div className="col-md-4 mb-3">
                    <Link
                        to="/"
                        className="btn btn-dark w-100 py-3"
                    >
                        Go to Store
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;