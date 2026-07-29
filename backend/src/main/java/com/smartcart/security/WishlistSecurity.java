package com.smartcart.security;
import com.smartcart.entity.Wishlist;
import com.smartcart.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistSecurity {
    @Autowired
    private WishlistRepository wishlistRepository;

    public Wishlist saveWishlist(Wishlist wishlist) {
        return wishlistRepository.save(wishlist);
    }

    public List<Wishlist> getAllWishlistItems() {
        return wishlistRepository.findAll();
    }

    public Optional<Wishlist> getWishlistItemById(Long id) {
        return wishlistRepository.findById(id);
    }

    public void deleteWishlistItem(Long id) {
        wishlistRepository.deleteById(id);
    }

}
