import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Cash On Delivery");
  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Please enter your shipping address.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await placeOrder(Number(userId));

      console.log("Order placed:", response.data);

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("Complete order error:", error);
      console.error("Backend response:", error.response?.data);
      console.error("HTTP status:", error.response?.status);

      let message = "Failed to place order";

      if (typeof error.response?.data === "string") {
        message = error.response.data;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      alert(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">Checkout</h2>

      <div
        className="card p-4 shadow mx-auto"
        style={{ maxWidth: "650px" }}
      >
        <div className="mb-3">
          <label className="form-label">
            Shipping Address
          </label>

          <textarea
            className="form-control"
            rows="4"
            value={shippingAddress}
            onChange={(event) =>
              setShippingAddress(event.target.value)
            }
            placeholder="Enter your complete delivery address"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">
            Payment Method
          </label>

          <select
            className="form-select"
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value)
            }
          >
            <option value="Cash On Delivery">
              Cash On Delivery
            </option>

            <option value="UPI">UPI</option>

            <option value="Credit Card">
              Credit Card
            </option>

            <option value="Debit Card">
              Debit Card
            </option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-success w-100"
          onClick={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder
            ? "Placing Order..."
            : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;