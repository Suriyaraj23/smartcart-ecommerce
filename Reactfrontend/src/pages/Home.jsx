import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="smartcart-home">
      {/* Hero section */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-badge">
            🛍️ Smart shopping starts here
          </span>

          <h1>
  Welcome to
  <span> SmartCart</span>
</h1>

          <p>
            Explore premium mobiles, laptops, electronics and
            accessories at great prices. Enjoy a secure and smooth
            shopping experience with SmartCart.
          </p>

          <div className="hero-buttons">
            <Link
              to="/products"
              className="btn btn-light btn-lg hero-shop-button"
            >
              Shop Now
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>

            <Link
              to="/wishlist"
              className="btn btn-outline-light btn-lg hero-wishlist-button"
            >
              <i className="bi bi-heart me-2"></i>
              My Wishlist
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>40+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Secure Payment</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Shopping Access</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle hero-circle-one"></div>
          <div className="hero-circle hero-circle-two"></div>

          <div className="shopping-card">
            <div className="shopping-icon">🛒</div>

            <h3>SmartCart</h3>

            <p>
              Everything you need, all in one place.
            </p>

            <div className="mini-product-row">
              <div className="mini-product">📱</div>
              <div className="mini-product">💻</div>
              <div className="mini-product">🎧</div>
              <div className="mini-product">⌚</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon delivery-icon">
            <i className="bi bi-truck"></i>
          </div>

          <div>
            <h3>Free Delivery</h3>
            <p>
              Fast and reliable delivery for eligible orders.
            </p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon payment-icon">
            <i className="bi bi-shield-check"></i>
          </div>

          <div>
            <h3>Secure Payment</h3>
            <p>
              Safe checkout with protected customer information.
            </p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon quality-icon">
            <i className="bi bi-stars"></i>
          </div>

          <div>
            <h3>Best Quality</h3>
            <p>
              Carefully selected products at affordable prices.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="category-section">
        <div className="section-heading">
          <div>
            <span>EXPLORE COLLECTIONS</span>
            <h2>Shop by Category</h2>
          </div>

          <Link to="/products">
            View all products
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        <div className="category-grid">
          <Link
            to="/products"
            className="category-card category-mobile"
          >
            <div className="category-emoji">📱</div>
            <div>
              <h3>Mobiles</h3>
              <p>Latest smartphones</p>
            </div>
            <i className="bi bi-arrow-up-right"></i>
          </Link>

          <Link
            to="/products"
            className="category-card category-laptop"
          >
            <div className="category-emoji">💻</div>
            <div>
              <h3>Laptops</h3>
              <p>Powerful performance</p>
            </div>
            <i className="bi bi-arrow-up-right"></i>
          </Link>

          <Link
            to="/products"
            className="category-card category-audio"
          >
            <div className="category-emoji">🎧</div>
            <div>
              <h3>Audio</h3>
              <p>Premium sound devices</p>
            </div>
            <i className="bi bi-arrow-up-right"></i>
          </Link>

          <Link
            to="/products"
            className="category-card category-accessory"
          >
            <div className="category-emoji">⌚</div>
            <div>
              <h3>Accessories</h3>
              <p>Smart everyday essentials</p>
            </div>
            <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
      </section>

      {/* Promotional section */}
      <section className="home-promotion">
        <div>
          <span className="promotion-label">
            SMARTCART SPECIAL
          </span>

          <h2>
            Upgrade your lifestyle with the latest technology
          </h2>

          <p>
            Browse our product collection and add your favourite
            items to the cart or wishlist.
          </p>
        </div>

        <Link
          to="/products"
          className="btn btn-dark btn-lg"
        >
          Explore Products
          <i className="bi bi-bag-check ms-2"></i>
        </Link>
      </section>
    </div>
  );
}

export default Home;