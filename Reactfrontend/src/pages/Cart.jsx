import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCartByUser,
  removeFromCart,
  updateCartQuantity,
} from "../services/cartService";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    loadCart();
  }, [navigate, token, userId]);

  const loadCart = async () => {
    try {
      setLoading(true);

      const response = await getCartByUser(userId);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setCartItems(data);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = (item) => {
    return item.product || {};
  };

  const getProductName = (item) => {
    const product = getProduct(item);

    return (
      product.name ||
      item.productName ||
      "Product"
    );
  };

  const getProductImage = (item) => {
    const product = getProduct(item);

    return (
      product.imageUrl ||
      item.imageUrl ||
      "https://via.placeholder.com/90"
    );
  };

  const getPrice = (item) => {
    const product = getProduct(item);

    return Number(
      product.price ??
        item.price ??
        0
    );
  };

  const getQuantity = (item) => {
    return Number(item.quantity) || 1;
  };

  const getSubtotal = (item) => {
    return (
      getPrice(item) *
      getQuantity(item)
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + getSubtotal(item),
      0
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleQuantityChange = async (
    item,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingId(item.id);

      await updateCartQuantity(
        item.id,
        newQuantity
      );

      await loadCart();
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to update quantity";

      alert(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleIncrease = async (item) => {
    const currentQuantity =
      getQuantity(item);

    await handleQuantityChange(
      item,
      currentQuantity + 1
    );
  };

  const handleDecrease = async (item) => {
    const currentQuantity =
      getQuantity(item);

    if (currentQuantity <= 1) {
      return;
    }

    await handleQuantityChange(
      item,
      currentQuantity - 1
    );
  };

  const handleRemove = async (cartId) => {
    const confirmed = window.confirm(
      "Remove this product from cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeFromCart(cartId);

      setCartItems((previousItems) =>
        previousItems.filter(
          (item) => item.id !== cartId
        )
      );
    } catch (error) {
      console.error(
        "Error removing cart item:",
        error
      );

      alert(
        "Unable to remove product from cart"
      );
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading cart...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-5">
      <h2 className="text-center mb-4">
        Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="mb-4">
            Your cart is empty
          </h4>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => {
                  const quantity =
                    getQuantity(item);

                  const isUpdating =
                    updatingId === item.id;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3 text-start">
                          <img
                            src={getProductImage(item)}
                            alt={getProductName(item)}
                            className="rounded"
                            style={{
                              width: "100px",
                              height: "90px",
                              objectFit: "cover",
                            }}
                          />

                          <span className="fw-semibold">
                            {getProductName(item)}
                          </span>
                        </div>
                      </td>

                      <td>
                        {formatCurrency(
                          getPrice(item)
                        )}
                      </td>

                      <td>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleDecrease(item)
                            }
                            disabled={
                              quantity <= 1 ||
                              isUpdating
                            }
                          >
                            −
                          </button>

                          <span
                            className="border rounded px-3 py-1 fw-bold"
                            style={{
                              minWidth: "50px",
                            }}
                          >
                            {isUpdating
                              ? "..."
                              : quantity}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleIncrease(item)
                            }
                            disabled={isUpdating}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="fw-semibold">
                        {formatCurrency(
                          getSubtotal(item)
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            handleRemove(item.id)
                          }
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mt-5">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>

            <div className="text-md-end">
              <h3 className="mb-3">
                Total:{" "}
                {formatCurrency(
                  calculateTotal()
                )}
              </h3>

              <button
                type="button"
                className="btn btn-success btn-lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;