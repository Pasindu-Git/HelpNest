package Backend.controller;

import Backend.model.OrderModel;
import Backend.model.OrderItemModel;
import Backend.model.FoodItemModel;
import Backend.repository.OrderRepository;
import Backend.repository.FoodItemRepository;
import Backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/student/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    // Get all orders for a specific student by email
    @GetMapping("/student/{email}")
    public ResponseEntity<?> getOrdersByStudentEmail(@PathVariable String email) {
        try {
            List<OrderModel> orders = orderRepository.findByEmailOrderByOrderDateDesc(email);

            // Enhance orders with additional info
            List<Map<String, Object>> enhancedOrders = new ArrayList<>();
            for (OrderModel order : orders) {
                Map<String, Object> enhancedOrder = new HashMap<>();
                enhancedOrder.put("id", order.getId());
                enhancedOrder.put("studentName", order.getStudentName());
                enhancedOrder.put("studentId", order.getStudentId());
                enhancedOrder.put("email", order.getEmail());
                enhancedOrder.put("phone", order.getPhone());
                enhancedOrder.put("deliveryLocation", order.getDeliveryLocation());
                enhancedOrder.put("total", order.getTotal());
                enhancedOrder.put("status", order.getStatus());
                enhancedOrder.put("orderDate", order.getOrderDate());
                enhancedOrder.put("specialInstructions", order.getSpecialInstructions());

                // Process items
                List<Map<String, Object>> items = new ArrayList<>();
                for (OrderItemModel item : order.getItems()) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("name", item.getName());
                    itemMap.put("quantity", item.getQuantity());
                    itemMap.put("price", item.getPrice());
                    items.add(itemMap);
                }
                enhancedOrder.put("items", items);

                // Process tracking updates
                List<Map<String, Object>> tracking = new ArrayList<>();
                if (order.getTrackingUpdates() != null) {
                    for (var update : order.getTrackingUpdates()) {
                        Map<String, Object> updateMap = new HashMap<>();
                        updateMap.put("time", update.getTime());
                        updateMap.put("message", update.getMessage());
                        tracking.add(updateMap);
                    }
                }
                enhancedOrder.put("trackingUpdates", tracking);

                // Calculate estimated pickup time
                if ("pending".equals(order.getStatus())) {
                    enhancedOrder.put("estimatedPickupTime", "20-30 minutes");
                } else if ("preparing".equals(order.getStatus())) {
                    enhancedOrder.put("estimatedPickupTime", "10-15 minutes");
                } else if ("ready".equals(order.getStatus())) {
                    enhancedOrder.put("estimatedPickupTime", "Ready now");
                } else {
                    enhancedOrder.put("estimatedPickupTime", "Completed");
                }

                enhancedOrders.add(enhancedOrder);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", enhancedOrders);
            response.put("count", enhancedOrders.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch orders");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get order by ID (with ownership validation)
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId, @RequestParam String email) {
        try {
            Optional<OrderModel> orderOpt = orderRepository.findByIdAndEmail(orderId, email);

            if (orderOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Order not found or unauthorized");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            OrderModel order = orderOpt.get();

            Map<String, Object> enhancedOrder = new HashMap<>();
            enhancedOrder.put("id", order.getId());
            enhancedOrder.put("studentName", order.getStudentName());
            enhancedOrder.put("studentId", order.getStudentId());
            enhancedOrder.put("email", order.getEmail());
            enhancedOrder.put("phone", order.getPhone());
            enhancedOrder.put("deliveryLocation", order.getDeliveryLocation());
            enhancedOrder.put("total", order.getTotal());
            enhancedOrder.put("status", order.getStatus());
            enhancedOrder.put("orderDate", order.getOrderDate());
            enhancedOrder.put("specialInstructions", order.getSpecialInstructions());

            // Process items
            List<Map<String, Object>> items = new ArrayList<>();
            for (OrderItemModel item : order.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("name", item.getName());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("price", item.getPrice());
                items.add(itemMap);
            }
            enhancedOrder.put("items", items);

            // Process tracking updates
            List<Map<String, Object>> tracking = new ArrayList<>();
            if (order.getTrackingUpdates() != null) {
                for (var update : order.getTrackingUpdates()) {
                    Map<String, Object> updateMap = new HashMap<>();
                    updateMap.put("time", update.getTime());
                    updateMap.put("message", update.getMessage());
                    tracking.add(updateMap);
                }
            }
            enhancedOrder.put("trackingUpdates", tracking);

            return ResponseEntity.ok(enhancedOrder);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch order");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Cancel order (only if pending or preparing)
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, @RequestParam String email) {
        try {
            // Find order and verify ownership
            Optional<OrderModel> orderOpt = orderRepository.findByIdAndEmail(orderId, email);

            if (orderOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Order not found or unauthorized");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            OrderModel order = orderOpt.get();

            // Check if order can be cancelled
            if ("delivered".equals(order.getStatus())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot cancel delivered order");
                return ResponseEntity.badRequest().body(error);
            }

            if ("cancelled".equals(order.getStatus())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Order already cancelled");
                return ResponseEntity.badRequest().body(error);
            }

            // Restore stock for each item
            for (OrderItemModel item : order.getItems()) {
                Optional<FoodItemModel> foodItemOpt = foodItemRepository.findById(item.getFoodItemId());
                if (foodItemOpt.isPresent()) {
                    FoodItemModel foodItem = foodItemOpt.get();
                    foodItem.setStock(foodItem.getStock() + item.getQuantity());
                    foodItem.setTotalSold(foodItem.getTotalSold() - item.getQuantity());
                    foodItemRepository.save(foodItem);
                }
            }

            // Update order status to cancelled
            order.setStatus("cancelled");

            // Add tracking update
            List<Backend.model.TrackingUpdate> updates = order.getTrackingUpdates();
            if (updates == null) {
                updates = new ArrayList<>();
            }
            updates.add(new Backend.model.TrackingUpdate("Order cancelled by student"));
            order.setTrackingUpdates(updates);

            orderRepository.save(order);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order cancelled successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to cancel order");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get order statistics for a student
    @GetMapping("/statistics/{email}")
    public ResponseEntity<?> getOrderStatistics(@PathVariable String email) {
        try {
            List<OrderModel> orders = orderRepository.findByEmail(email);

            int totalOrders = orders.size();
            int pendingOrders = (int) orders.stream().filter(o -> "pending".equals(o.getStatus())).count();
            int preparingOrders = (int) orders.stream().filter(o -> "preparing".equals(o.getStatus())).count();
            int readyOrders = (int) orders.stream().filter(o -> "ready".equals(o.getStatus())).count();
            int deliveredOrders = (int) orders.stream().filter(o -> "delivered".equals(o.getStatus())).count();
            int cancelledOrders = (int) orders.stream().filter(o -> "cancelled".equals(o.getStatus())).count();

            double totalSpent = orders.stream()
                    .filter(o -> !"cancelled".equals(o.getStatus()))
                    .mapToDouble(OrderModel::getTotal)
                    .sum();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalOrders", totalOrders);
            stats.put("pendingOrders", pendingOrders);
            stats.put("preparingOrders", preparingOrders);
            stats.put("readyOrders", readyOrders);
            stats.put("deliveredOrders", deliveredOrders);
            stats.put("cancelledOrders", cancelledOrders);
            stats.put("totalSpent", totalSpent);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch statistics");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get active orders (pending, preparing, ready)
    @GetMapping("/active/{email}")
    public ResponseEntity<?> getActiveOrders(@PathVariable String email) {
        try {
            List<OrderModel> allOrders = orderRepository.findByEmailOrderByOrderDateDesc(email);
            List<OrderModel> activeOrders = allOrders.stream()
                    .filter(o -> !"delivered".equals(o.getStatus()) && !"cancelled".equals(o.getStatus()))
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(activeOrders);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch active orders");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}