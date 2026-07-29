import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

function Wishlist() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();

      const userId = localStorage.getItem("userId");

      const myWishlist = data.filter(
        (item) => String(item.user.id) === String(userId)
      );

      setItems(myWishlist);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await removeFromWishlist(id);
      loadWishlist();
    } catch (error) {
      console.error(error);
      alert("Unable to remove item.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading Wishlist...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      <h2 className="mb-4 text-center">My Wishlist</h2>

      {items.length === 0 ? (
        <div className="alert alert-info text-center">
          Wishlist is empty.

          <br /><br />

          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <table className="table table-bordered table-striped">

            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {items.map((item) => (

                <tr key={item.id}>

                  <td width="120">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width="80"
                      height="80"
                      style={{ objectFit: "cover" }}
                    />
                  </td>

                  <td>{item.product.name}</td>

                  <td>
                    ₹ {Number(item.product.price).toLocaleString("en-IN")}
                  </td>

                  <td>{item.product.category?.name}</td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="text-center">

            <button
              className="btn btn-success"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>

          </div>

        </>
      )}

    </div>
  );
}

export default Wishlist;