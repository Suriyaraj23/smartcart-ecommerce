package com.smartcart.controller;

import com.smartcart.dto.OrderRequest;
import com.smartcart.entity.CustomerOrder;
import com.smartcart.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public CustomerOrder placeOrder(@RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }
}