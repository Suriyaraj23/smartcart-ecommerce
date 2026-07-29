package com.smartcart.controller;

import com.smartcart.entity.CustomerOrder;
import com.smartcart.entity.User;
import com.smartcart.repository.UserRepository;
import com.smartcart.service.CustomerOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerOrderController {

    @Autowired
    private CustomerOrderService customerOrderService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/place/{userId}")
    public ResponseEntity<CustomerOrder> placeOrder(
            @PathVariable Long userId
    ) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        CustomerOrder order =
                customerOrderService.placeOrder(user);

        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<CustomerOrder>>
    getAllOrders() {

        return ResponseEntity.ok(
                customerOrderService.getAllOrders()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerOrder> getOrderById(
            @PathVariable Long id
    ) {

        CustomerOrder order =
                customerOrderService
                        .getOrderById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );

        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomerOrder>>
    getOrdersByUser(
            @PathVariable Long userId
    ) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        return ResponseEntity.ok(
                customerOrderService
                        .getOrdersByUser(user)
        );
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<CustomerOrder>
    updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody CustomerOrder orderRequest
    ) {

        CustomerOrder updatedOrder =
                customerOrderService
                        .updateOrderStatus(
                                orderId,
                                orderRequest.getStatus()
                        );

        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable Long id
    ) {

        customerOrderService.deleteOrder(id);

        return ResponseEntity.ok(
                "Order deleted successfully"
        );
    }
}