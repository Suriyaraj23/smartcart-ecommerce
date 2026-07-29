import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { getOrderItemsByOrderId } from "../services/orderItemService";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setErrorMessage("Invalid order ID");
      setLoading(false);
      return;
    }

    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [orderResponse, itemsResponse] =
        await Promise.all([
          getOrderById(id),
          getOrderItemsByOrderId(id),
        ]);

      setOrder(orderResponse.data);

      setOrderItems(
        Array.isArray(itemsResponse.data)
          ? itemsResponse.data
          : []
      );
    } catch (error) {
      console.error("Failed to load order details:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Request URL:", error.config?.url);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to load order details"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading order details...</h3>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          {String(errorMessage)}
        </div>

        <Link to="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">
          Order not found.
        </div>

        <Link to="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">Order Details</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            Order ID: {order.id}
          </h5>

          <p>
            <strong>Status:</strong>{" "}
            <span className="badge bg-warning text-dark">
              {order.status || "PLACED"}
            </span>
          </p>

          <p>
            <strong>Customer:</strong>{" "}
            {order.user?.name || "Not available"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {order.user?.email || "Not available"}
          </p>

          <p>
            <strong>Total Amount:</strong>{" "}
            ₹{formatAmount(order.totalAmount)}
          </p>
        </div>
      </div>

      <h4 className="mb-3">Ordered Products</h4>

      {orderItems.length === 0 ? (
        <div className="alert alert-info">
          No products found for this order.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {orderItems.map((item) => {
                const price =
                  item.price ??
                  item.product?.price ??
                  0;

                const quantity =
                  item.quantity ?? 1;

                const subtotal =
                  price * quantity;

                return (
                  <tr key={item.id}>
                    <td>
                      {item.product?.name ||
                        "Product unavailable"}
                    </td>

                    <td>
                      ₹{formatAmount(price)}
                    </td>

                    <td>{quantity}</td>

                    <td>
                      ₹{formatAmount(subtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr>
                <th colSpan="3" className="text-end">
                  Order Total
                </th>

                <th>
                  ₹{formatAmount(order.totalAmount)}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <Link
        to="/orders"
        className="btn btn-secondary mt-3"
      >
        Back to Orders
      </Link>
    </div>
  );
}

export default OrderDetails;