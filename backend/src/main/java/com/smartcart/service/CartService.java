package com.smartcart.service;

import com.smartcart.dto.CartRequest;
import com.smartcart.entity.Cart;
import com.smartcart.entity.Product;
import com.smartcart.entity.User;
import com.smartcart.repository.CartRepository;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Cart addToCart(CartRequest request) {

        if (request.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (request.getProductId() == null) {
            throw new RuntimeException("Product ID is required");
        }

        User user = userRepository.findById(
                request.getUserId()
        ).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        Product product = productRepository.findById(
                request.getProductId()
        ).orElseThrow(
                () -> new RuntimeException("Product not found")
        );

        int requestedQuantity =
                request.getQuantity() == null ||
                        request.getQuantity() < 1
                        ? 1
                        : request.getQuantity();

        Optional<Cart> existingCartItem =
                cartRepository.findByUserIdAndProductId(
                        request.getUserId(),
                        request.getProductId()
                );

        if (existingCartItem.isPresent()) {

            Cart cart = existingCartItem.get();

            int currentQuantity =
                    cart.getQuantity() == null
                            ? 0
                            : cart.getQuantity();

            int newQuantity =
                    currentQuantity + requestedQuantity;

            if (newQuantity > product.getStock()) {
                throw new RuntimeException(
                        "Only " +
                                product.getStock() +
                                " items are available in stock"
                );
            }

            cart.setQuantity(newQuantity);

            return cartRepository.save(cart);
        }

        if (requestedQuantity > product.getStock()) {
            throw new RuntimeException(
                    "Only " +
                            product.getStock() +
                            " items are available in stock"
            );
        }

        Cart cart = new Cart();

        cart.setUser(user);
        cart.setProduct(product);
        cart.setQuantity(requestedQuantity);

        return cartRepository.save(cart);
    }

    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    public List<Cart> getCartItemsByUserId(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        return cartRepository.findByUserId(userId);
    }

    public Optional<Cart> getCartItemById(Long id) {
        return cartRepository.findById(id);
    }

    public Cart updateCartQuantity(
            Long cartId,
            Integer quantity
    ) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Cart item not found"
                        )
                );

        if (quantity == null || quantity < 1) {
            throw new RuntimeException(
                    "Quantity must be at least 1"
            );
        }

        Product product = cart.getProduct();

        if (quantity > product.getStock()) {
            throw new RuntimeException(
                    "Only " +
                            product.getStock() +
                            " items are available in stock"
            );
        }

        cart.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    public void deleteCartItem(Long id) {

        if (!cartRepository.existsById(id)) {
            throw new RuntimeException(
                    "Cart item not found"
            );
        }

        cartRepository.deleteById(id);
    }

    public void clearUserCart(Long userId) {

        List<Cart> cartItems =
                cartRepository.findByUserId(userId);

        cartRepository.deleteAll(cartItems);
    }
}