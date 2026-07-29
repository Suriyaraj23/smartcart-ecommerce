package com.smartcart.controller;

import com.smartcart.dto.CartRequest;
import com.smartcart.entity.Cart;
import com.smartcart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestBody CartRequest request
    ) {

        Cart cart =
                cartService.addToCart(request);

        return ResponseEntity.ok(cart);
    }

    @GetMapping
    public ResponseEntity<List<Cart>>
    getAllCartItems() {

        return ResponseEntity.ok(
                cartService.getAllCartItems()
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Cart>>
    getCartItemsByUser(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                cartService.getCartItemsByUserId(userId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartItem(
            @PathVariable Long id
    ) {

        Cart cart = cartService
                .getCartItemById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Cart item not found"
                        )
                );

        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{cartId}/quantity")
    public ResponseEntity<Cart>
    updateCartQuantity(
            @PathVariable Long cartId,
            @RequestParam Integer quantity
    ) {

        Cart updatedCart =
                cartService.updateCartQuantity(
                        cartId,
                        quantity
                );

        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteCartItem(
            @PathVariable Long id
    ) {

        cartService.deleteCartItem(id);

        return ResponseEntity.ok(
                "Cart item deleted successfully"
        );
    }

    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<String>
    clearUserCart(
            @PathVariable Long userId
    ) {

        cartService.clearUserCart(userId);

        return ResponseEntity.ok(
                "Cart cleared successfully"
        );
    }
}