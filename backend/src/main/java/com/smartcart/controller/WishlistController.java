package com.smartcart.controller;

import com.smartcart.entity.Wishlist;
import com.smartcart.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping
    public Wishlist saveWishlist(@RequestBody Wishlist wishlist) {
        return wishlistService.saveWishlist(wishlist);
    }

    @GetMapping
    public List<Wishlist> getAllWishlistItems() {
        return wishlistService.getAllWishlistItems();
    }

    @GetMapping("/{id}")
    public Optional<Wishlist> getWishlistItemById(@PathVariable Long id) {
        return wishlistService.getWishlistItemById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteWishlistItem(@PathVariable Long id) {
        wishlistService.deleteWishlistItem(id);
        return "Wishlist item deleted successfully";
    }
}