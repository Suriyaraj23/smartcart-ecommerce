import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrdersByUser } from "../services/orderService";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [token, userId]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await getOrdersByUser(
        Number(userId)
      );

      setOrders(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Failed to load orders:", error);
      console.error(
        "Backend response:",
        error.response?.data
      );

      setOrders([]);
    } finally {
      setLoading(false);
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

  if (!token || !userId) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-3">My Orders</h2>

        <p>Please login to view your orders.</p>

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

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading orders...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center">
          <h4>You have not placed any orders yet.</h4>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  <td>
                    <span
                      className={`badge ${
                        order.status === "DELIVERED"
                          ? "bg-success"
                          : order.status === "SHIPPED"
                            ? "bg-primary"
                            : order.status === "CANCELLED"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                      }`}
                    >
                      {order.status || "PLACED"}
                    </span>
                  </td>

                  <td>
                    {formatAmount(order.totalAmount)}
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

export default Orders;