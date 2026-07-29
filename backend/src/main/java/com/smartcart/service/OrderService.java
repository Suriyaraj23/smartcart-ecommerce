package com.smartcart.service;

import com.smartcart.dto.OrderRequest;
import com.smartcart.entity.Cart;
import com.smartcart.entity.CustomerOrder;
import com.smartcart.entity.OrderItem;
import com.smartcart.entity.User;
import com.smartcart.repository.CartRepository;
import com.smartcart.repository.CustomerOrderRepository;
import com.smartcart.repository.OrderItemRepository;
import com.smartcart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    public CustomerOrder placeOrder(OrderRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Cart> cartItems = cartRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0;

        for (Cart cart : cartItems) {
            totalAmount += cart.getProduct().getPrice() * cart.getQuantity();
        }

        CustomerOrder order = new CustomerOrder();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus("PLACED");
        order.setTotalAmount(totalAmount);

        CustomerOrder savedOrder = customerOrderRepository.save(order);

        for (Cart cart : cartItems) {

            OrderItem item = new OrderItem();

            item.setOrder(savedOrder);
            item.setProduct(cart.getProduct());
            item.setQuantity(cart.getQuantity());
            item.setPrice(cart.getProduct().getPrice());

            orderItemRepository.save(item);
        }

        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }
}