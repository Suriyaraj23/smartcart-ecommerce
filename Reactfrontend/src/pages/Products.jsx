import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import productService from "../services/productService";
import categoryService from "../services/categoryService";
import { addToCart } from "../services/cartService";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response =
        await productService.getAllProducts();

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response =
        await categoryService.getAllCategories();

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );

      setCategories([]);
    }
  };

  const handleAddToCart = async (product) => {
    const token =
      localStorage.getItem("token");

    const userId =
      localStorage.getItem("userId");

    if (!token || !userId) {
      alert(
        "Please login before adding products to cart"
      );

      navigate("/login");
      return;
    }

    if (
      product.stock !== undefined &&
      Number(product.stock) <= 0
    ) {
      alert("This product is out of stock");
      return;
    }

    try {
      setAddingProductId(product.id);

      await addToCart(
        Number(userId),
        Number(product.id),
        1
      );

      alert(
        `${product.name} added to cart successfully`
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to add product to cart";

      alert(
        typeof message === "string"
          ? message
          : "Unable to add product to cart"
      );
    } finally {
      setAddingProductId(null);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
    )
    .filter((product) => {
      if (!selectedCategory) {
        return true;
      }

      return (
        String(product.category?.id) ===
        String(selectedCategory)
      );
    })
    .sort(
      (firstProduct, secondProduct) => {
        if (
          sortOption === "priceLowHigh"
        ) {
          return (
            Number(firstProduct.price) -
            Number(secondProduct.price)
          );
        }

        if (
          sortOption === "priceHighLow"
        ) {
          return (
            Number(secondProduct.price) -
            Number(firstProduct.price)
          );
        }

        if (sortOption === "nameAZ") {
          return (
            firstProduct.name?.localeCompare(
              secondProduct.name
            ) || 0
          );
        }

        return 0;
      }
    );

  const formatPrice = (price) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(Number(price) || 0);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
<h2
  className="text-center mb-4"
  style={{
    color: "#212529",
    fontWeight: "700",
  }}
>
  Products
</h2>

      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search products"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
              )
            }
          >
            <option value="">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target.value
              )
            }
          >
            <option value="">
              Sort By
            </option>

            <option value="priceLowHigh">
              Price: Low to High
            </option>

            <option value="priceHighLow">
              Price: High to Low
            </option>

            <option value="nameAZ">
              Name: A to Z
            </option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center">
          <h4>No products found</h4>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map(
            (product) => {
              const isAdding =
                addingProductId ===
                product.id;

              const outOfStock =
                product.stock !==
                  undefined &&
                Number(product.stock) <=
                  0;

              return (
                <div
                  className="col-md-4"
                  key={product.id}
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/300"
                      }
                      className="card-img-top"
                      alt={product.name}
                      style={{
                        height: "250px",
                        objectFit:
                          "contain",
                      }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        {product.name}
                      </h5>

                      <p className="card-text fw-semibold">
                        {formatPrice(
                          product.price
                        )}
                      </p>

                      <p className="card-text">
                        Category:{" "}
                        {product.category
                          ?.name ||
                          "No Category"}
                      </p>

                      <p className="card-text">
                        Stock:{" "}
                        {product.stock ??
                          "Not available"}
                      </p>

                      <div className="mt-auto d-grid gap-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            navigate(
                              `/products/${product.id}`
                            )
                          }
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          className="btn btn-success"
                          disabled={
                            isAdding ||
                            outOfStock
                          }
                          onClick={() =>
                            handleAddToCart(
                              product
                            )
                          }
                        >
                          {isAdding
                            ? "Adding..."
                            : outOfStock
                              ? "Out of Stock"
                              : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default Products;