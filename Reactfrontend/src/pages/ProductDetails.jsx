import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      console.error("Failed to load product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!token || !userId) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!product) {
      return;
    }

    if (Number(product.stock) <= 0) {
      alert("This product is out of stock.");
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(
        Number(userId),
        Number(product.id),
        1
      );

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error);
      console.error(
        "Backend response:",
        error.response?.data
      );

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            "Failed to add product to cart";

      alert(message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!product) {
      return;
    }

    try {
      setAddingToWishlist(true);

      await addToWishlist(
        Number(userId),
        Number(product.id)
      );

      alert("Product added to wishlist successfully.");

      navigate("/wishlist");
    } catch (error) {
      console.error(
        "Add to wishlist failed:",
        error
      );

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            "Unable to add product to wishlist.";

      alert(message);
    } finally {
      setAddingToWishlist(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading product...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-danger">
          Product not found
        </h3>

        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const outOfStock = Number(product.stock) <= 0;

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-5 align-items-start">
        <div className="col-lg-5">
          <div
            className="border rounded shadow-sm p-4 bg-white"
            style={{
              minHeight: "460px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={
                product.imageUrl ||
                "https://via.placeholder.com/500"
              }
              alt={product.name}
              className="img-fluid"
              style={{
                width: "100%",
                maxHeight: "420px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <div className="col-lg-7">
          <h2 className="fw-bold text-dark mb-3">
            {product.name}
          </h2>

          <h3 className="text-success fw-bold mb-4">
            {formatPrice(product.price)}
          </h3>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-2">
                Product Description
              </h5>

              <p className="mb-0">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>
          </div>

          <div className="mb-3">
            <strong>Category:</strong>{" "}

            <span className="badge bg-primary">
              {product.category?.name ||
                "No Category"}
            </span>
          </div>

          <div className="mb-4">
            <strong>Availability:</strong>{" "}

            {outOfStock ? (
              <span className="badge bg-danger">
                Out of Stock
              </span>
            ) : (
              <span className="badge bg-success">
                In Stock ({product.stock})
              </span>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary px-4"
              onClick={handleAddToCart}
              disabled={
                addingToCart || outOfStock
              }
            >
              {addingToCart
                ? "Adding..."
                : outOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
            </button>

            <button
              type="button"
              className="btn btn-danger px-4"
              onClick={handleAddToWishlist}
              disabled={addingToWishlist}
            >
              {addingToWishlist
                ? "Adding..."
                : "Add to Wishlist"}
            </button>

            <button
              type="button"
              className="btn btn-secondary px-4"
              onClick={() =>
                navigate("/products")
              }
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;