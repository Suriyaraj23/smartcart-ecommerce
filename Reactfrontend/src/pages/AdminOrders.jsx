import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllOrders,
  updateOrderStatus,
} from "../services/orderService";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] =
    useState({});
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const statusOptions = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders();

      const orderList = Array.isArray(response.data)
        ? response.data
        : [];

      setOrders(orderList);

      const initialStatuses = {};

      orderList.forEach((order) => {
        initialStatuses[order.id] =
          order.status || "PLACED";
      });

      setSelectedStatuses(initialStatuses);
    } catch (error) {
      console.error("Failed to load orders:", error);
      console.error(
        "Backend response:",
        error.response?.data
      );

      setOrders([]);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (
    orderId,
    newStatus
  ) => {
    setSelectedStatuses((previousStatuses) => ({
      ...previousStatuses,
      [orderId]: newStatus,
    }));
  };

  const handleUpdateStatus = async (orderId) => {
    const newStatus = selectedStatuses[orderId];

    try {
      setUpdatingOrderId(orderId);
      setError("");
      setMessage("");

      await updateOrderStatus(
        orderId,
        newStatus
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      setMessage(
        `Order ${orderId} status updated to ${newStatus}.`
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "Not available";
    }

    return `₹${Number(amount).toLocaleString(
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

  const getStatusBadgeClass = (status) => {
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
        <h2 className="mb-3">
          Admin Order Management
        </h2>

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
        <h3>Loading all orders...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          Admin Order Management
        </h2>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadOrders}
        >
          Refresh
        </button>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center">
          <h4>No orders are available.</h4>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>Current Status</th>
                <th>Change Status</th>
                <th>Update</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
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
                    {formatDate(order.orderDate)}
                  </td>

                  <td>
                    {formatAmount(
                      order.totalAmount
                    )}
                  </td>

                  <td>
                    <span
                      className={`badge ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status || "PLACED"}
                    </span>
                  </td>

                  <td>
                    <select
                      className="form-select"
                      value={
                        selectedStatuses[
                          order.id
                        ] || "PLACED"
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                    >
                      {statusOptions.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      disabled={
                        updatingOrderId === order.id
                      }
                      onClick={() =>
                        handleUpdateStatus(
                          order.id
                        )
                      }
                    >
                      {updatingOrderId === order.id
                        ? "Updating..."
                        : "Update"}
                    </button>
                  </td>

                  <td>
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn btn-primary btn-sm"
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
  );
}

export default AdminOrders;