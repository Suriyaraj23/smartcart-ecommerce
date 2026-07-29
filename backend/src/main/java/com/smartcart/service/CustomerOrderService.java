package com.smartcart.service;

import com.smartcart.entity.Cart;
import com.smartcart.entity.CustomerOrder;
import com.smartcart.entity.OrderItem;
import com.smartcart.entity.Product;
import com.smartcart.entity.User;
import com.smartcart.repository.CartRepository;
import com.smartcart.repository.CustomerOrderRepository;
import com.smartcart.repository.OrderItemRepository;
import com.smartcart.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerOrderService {

    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public CustomerOrder saveOrder(CustomerOrder order) {
        return customerOrderRepository.save(order);
    }

    public List<CustomerOrder> getAllOrders() {
        return customerOrderRepository.findAll();
    }

    public Optional<CustomerOrder> getOrderById(Long id) {
        return customerOrderRepository.findById(id);
    }

    public List<CustomerOrder> getOrdersByUser(User user) {
        return customerOrderRepository.findByUser(user);
    }

    public void deleteOrder(Long id) {

        if (!customerOrderRepository.existsById(id)) {
            throw new RuntimeException("Order not found");
        }

        customerOrderRepository.deleteById(id);
    }

    @Transactional
    public CustomerOrder placeOrder(User user) {

        List<Cart> cartItems =
                cartRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        CustomerOrder order = new CustomerOrder();

        order.setUser(user);
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        double totalAmount = 0;

        order = customerOrderRepository.save(order);

        for (Cart cart : cartItems) {

            Product product = cart.getProduct();

            if (product.getStock() < cart.getQuantity()) {
                throw new RuntimeException(
                        product.getName() +
                                " does not have enough stock"
                );
            }

            OrderItem item = new OrderItem();

            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(cart.getQuantity());
            item.setPrice(product.getPrice());

            orderItemRepository.save(item);

            totalAmount +=
                    product.getPrice() *
                            cart.getQuantity();

            product.setStock(
                    product.getStock() -
                            cart.getQuantity()
            );

            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);

        CustomerOrder savedOrder =
                customerOrderRepository.save(order);

        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public CustomerOrder updateOrderStatus(
            Long orderId,
            String status
    ) {

        CustomerOrder order =
                customerOrderRepository
                        .findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );

        if (status == null || status.isBlank()) {
            throw new RuntimeException(
                    "Order status is required"
            );
        }

        String normalizedStatus =
                status.trim().toUpperCase();

        List<String> validStatuses = List.of(
                "PLACED",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
        );

        if (!validStatuses.contains(normalizedStatus)) {
            throw new RuntimeException(
                    "Invalid order status"
            );
        }

        order.setStatus(normalizedStatus);

        return customerOrderRepository.save(order);
    }
}