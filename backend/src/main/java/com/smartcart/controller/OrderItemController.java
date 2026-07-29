package com.smartcart.controller;

import com.smartcart.entity.OrderItem;
import com.smartcart.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    @PostMapping
    public OrderItem addOrderItem(
            @RequestBody OrderItem orderItem) {

        return orderItemService.saveOrderItem(orderItem);
    }

    @GetMapping
    public List<OrderItem> getAllOrderItems() {
        return orderItemService.getAllOrderItems();
    }

    @GetMapping("/{id}")
    public Optional<OrderItem> getOrderItemById(
            @PathVariable Long id) {

        return orderItemService.getOrderItemById(id);
    }

    @GetMapping("/order/{orderId}")
    public List<OrderItem> getOrderItemsByOrderId(
            @PathVariable Long orderId) {

        return orderItemService
                .getOrderItemsByOrderId(orderId);
    }

    @DeleteMapping("/{id}")
    public String deleteOrderItem(
            @PathVariable Long id) {

        orderItemService.deleteOrderItem(id);

        return "Order item deleted successfully";
    }
}