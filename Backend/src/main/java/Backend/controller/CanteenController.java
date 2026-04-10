package Backend.controller;

import Backend.model.FoodItemModel;
import Backend.model.OrderModel;
import Backend.model.OrderItemModel;
import Backend.model.TrackingUpdate;
import Backend.repository.FoodItemRepository;
import Backend.repository.OrderRepository;
import Backend.service.ImageUploadService;
import Backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/canteen")
@CrossOrigin(origins = "http://localhost:3000")
public class CanteenController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    // ============ FOOD ITEM MANAGEMENT (Canteen Owner) ============

    @GetMapping("/items")
    public List<FoodItemModel> getAllItems() {
        return foodItemRepository.findAll();
    }

    @GetMapping("/items/available")
    public List<FoodItemModel> getAvailableItems() {
        // Show all items, but mark which are available
        List<FoodItemModel> allItems = foodItemRepository.findAll();
        return allItems;
    }

    @GetMapping("/items/{id}")
    public FoodItemModel getItemById(@PathVariable Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public FoodItemModel createItem(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String category = (String) request.get("category");
        double price = ((Number) request.get("price")).doubleValue();
        int stock = (int) request.get("stock");
        String description = (String) request.get("description");
        String base64Image = (String) request.get("image");
        int prepTime = request.containsKey("prepTime") ? (int) request.get("prepTime") : 15;
        int calories = request.containsKey("calories") ? (int) request.get("calories") : 0;

        String imageUrl = null;
        String imageCode = null;

        if (base64Image != null && !base64Image.isEmpty() && !base64Image.equals("null")) {
            try {
                imageUrl = imageUploadService.uploadBase64Image(base64Image);
                imageCode = imageUploadService.getImageCodeFromUrl(imageUrl);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        FoodItemModel item = new FoodItemModel(name, category, price, stock, description, imageCode, imageUrl);
        item.setPrepTime(prepTime);
        item.setCalories(calories);
        item.setAvailable(stock > 0);
        item.setRating(0);
        item.setTotalSold(0);

        return foodItemRepository.save(item);
    }

    @PutMapping("/items/{id}")
    public FoodItemModel updateItem(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        FoodItemModel item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));

        item.setName((String) request.get("name"));
        item.setCategory((String) request.get("category"));
        item.setPrice(((Number) request.get("price")).doubleValue());
        item.setStock((int) request.get("stock"));
        item.setDescription((String) request.get("description"));
        item.setAvailable((boolean) request.get("available"));

        // Auto-update available based on stock
        if (item.getStock() <= 0) {
            item.setAvailable(false);
        } else if (item.getStock() > 0 && !item.isAvailable()) {
            item.setAvailable(true);
        }

        if (request.containsKey("prepTime")) {
            item.setPrepTime((int) request.get("prepTime"));
        }
        if (request.containsKey("calories")) {
            item.setCalories((int) request.get("calories"));
        }

        String base64Image = (String) request.get("image");
        if (base64Image != null && !base64Image.isEmpty() && !base64Image.equals("null") &&
                (item.getImageUrl() == null || !base64Image.equals(item.getImageUrl()))) {
            if (item.getImageUrl() != null) {
                imageUploadService.deleteImage(item.getImageUrl());
            }
            try {
                String imageUrl = imageUploadService.uploadBase64Image(base64Image);
                item.setImageUrl(imageUrl);
                item.setImageCode(imageUploadService.getImageCodeFromUrl(imageUrl));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        item.setUpdatedAt(LocalDateTime.now());
        return foodItemRepository.save(item);
    }

    // Restock item (increase stock)
    @PatchMapping("/items/{id}/restock")
    public FoodItemModel restockItem(@PathVariable Long id, @RequestBody Map<String, Integer> restockData) {
        FoodItemModel item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));

        int additionalStock = restockData.get("additionalStock");
        item.setStock(item.getStock() + additionalStock);
        item.setAvailable(true); // Make available again when restocked
        item.setUpdatedAt(LocalDateTime.now());

        return foodItemRepository.save(item);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        FoodItemModel item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));

        if (item.getImageUrl() != null) {
            imageUploadService.deleteImage(item.getImageUrl());
        }

        foodItemRepository.delete(item);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/items/{id}/stock")
    public FoodItemModel updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> stockUpdate) {
        FoodItemModel item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));

        item.setStock(stockUpdate.get("stock"));
        // Auto-update available status
        item.setAvailable(item.getStock() > 0);
        return foodItemRepository.save(item);
    }

    // ============ ORDER MANAGEMENT (Canteen Owner) ============

    @GetMapping("/orders")
    public List<OrderModel> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/orders/pending")
    public List<OrderModel> getPendingOrders() {
        return orderRepository.findByStatusOrderByOrderDateDesc("pending");
    }

    @GetMapping("/orders/preparing")
    public List<OrderModel> getPreparingOrders() {
        return orderRepository.findByStatusOrderByOrderDateDesc("preparing");
    }

    @GetMapping("/orders/ready")
    public List<OrderModel> getReadyOrders() {
        return orderRepository.findByStatusOrderByOrderDateDesc("ready");
    }

    @GetMapping("/orders/delivered")
    public List<OrderModel> getDeliveredOrders() {
        return orderRepository.findByStatusOrderByOrderDateDesc("delivered");
    }

    @GetMapping("/orders/{id}")
    public OrderModel getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    @PutMapping("/orders/{id}/status")
    public OrderModel updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        OrderModel order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        String newStatus = statusUpdate.get("status");
        order.setStatus(newStatus);

        // Add tracking update
        List<TrackingUpdate> updates = order.getTrackingUpdates();
        if (updates == null) {
            updates = new ArrayList<>();
        }
        updates.add(new TrackingUpdate("Order " + getStatusMessage(newStatus)));
        order.setTrackingUpdates(updates);

        return orderRepository.save(order);
    }

    private String getStatusMessage(String status) {
        switch(status) {
            case "preparing": return "is being prepared";
            case "ready": return "is ready for pickup";
            case "delivered": return "has been delivered";
            case "cancelled": return "has been cancelled";
            default: return "status updated to " + status;
        }
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        OrderModel order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        // Restore stock if order was pending
        if ("pending".equals(order.getStatus())) {
            for (OrderItemModel item : order.getItems()) {
                FoodItemModel foodItem = foodItemRepository.findById(item.getFoodItemId()).orElse(null);
                if (foodItem != null) {
                    foodItem.setStock(foodItem.getStock() + item.getQuantity());
                    foodItem.setTotalSold(foodItem.getTotalSold() - item.getQuantity());
                    foodItem.setAvailable(true);
                    foodItemRepository.save(foodItem);
                }
            }
        }

        orderRepository.delete(order);
        return ResponseEntity.noContent().build();
    }

    // ============ STATISTICS (Canteen Owner) ============

    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalItems", foodItemRepository.count());
        stats.put("totalOrders", orderRepository.getTotalOrders());
        stats.put("totalSales", orderRepository.getTotalSales() != null ? orderRepository.getTotalSales() : 0);
        stats.put("todaySales", orderRepository.getTodaySales() != null ? orderRepository.getTodaySales() : 0);
        stats.put("totalItemsSold", foodItemRepository.getTotalItemsSold() != null ? foodItemRepository.getTotalItemsSold() : 0);
        stats.put("averageRating", orderRepository.getAverageRating() != null ? orderRepository.getAverageRating() : 0);

        // Pending orders count
        stats.put("pendingOrders", orderRepository.findByStatus("pending").size());
        stats.put("preparingOrders", orderRepository.findByStatus("preparing").size());
        stats.put("readyOrders", orderRepository.findByStatus("ready").size());

        // Category breakdown
        List<Object[]> categoryCounts = foodItemRepository.countByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] row : categoryCounts) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("categoryCount", categoryMap);

        // Top selling items
        List<FoodItemModel> topSelling = foodItemRepository.findTopSellingItems();
        List<Map<String, Object>> topItems = new ArrayList<>();
        for (int i = 0; i < Math.min(5, topSelling.size()); i++) {
            FoodItemModel item = topSelling.get(i);
            Map<String, Object> itemStat = new HashMap<>();
            itemStat.put("name", item.getName());
            itemStat.put("totalSold", item.getTotalSold());
            topItems.add(itemStat);
        }
        stats.put("topSellingItems", topItems);

        // Low stock items
        List<FoodItemModel> lowStockItems = foodItemRepository.findAll().stream()
                .filter(item -> item.getStock() > 0 && item.getStock() <= 5)
                .collect(Collectors.toList());
        stats.put("lowStockItems", lowStockItems.size());

        return stats;
    }

    // ============ STUDENT METHODS ============

    // Get all items for students (including out of stock, but marked as unavailable)
    @GetMapping("/student/items")
    public List<FoodItemModel> getItemsForStudents() {
        List<FoodItemModel> allItems = foodItemRepository.findAll();
        // Return all items, student will see stock status in UI
        return allItems;
    }

    // Get item details with real-time stock
    @GetMapping("/student/items/{id}")
    public ResponseEntity<?> getItemWithStock(@PathVariable Long id) {
        FoodItemModel item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", item.getId());
        response.put("name", item.getName());
        response.put("price", item.getPrice());
        response.put("stock", item.getStock());
        response.put("available", item.getStock() > 0);
        response.put("description", item.getDescription());
        response.put("imageUrl", item.getImageUrl());
        response.put("prepTime", item.getPrepTime());
        response.put("calories", item.getCalories());
        response.put("rating", item.getRating());

        return ResponseEntity.ok(response);
    }

    // Check stock before adding to cart
    @GetMapping("/student/check-stock/{id}")
    public ResponseEntity<?> checkStock(@PathVariable Long id, @RequestParam int requestedQuantity) {
        FoodItemModel item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("available", item.getStock() >= requestedQuantity && item.getStock() > 0);
        response.put("stock", item.getStock());
        response.put("requested", requestedQuantity);
        response.put("message", item.getStock() >= requestedQuantity && item.getStock() > 0 ?
                "Stock available" : "Only " + item.getStock() + " items available");

        return ResponseEntity.ok(response);
    }

    // Place order from student
    @PostMapping("/student/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> placeStudentOrder(@RequestBody Map<String, Object> orderData) {
        try {
            // Validate required fields
            String studentName = (String) orderData.get("studentName");
            String studentId = (String) orderData.get("studentId");
            String email = (String) orderData.get("email");
            String phone = (String) orderData.get("phone");
            String deliveryLocation = (String) orderData.get("deliveryLocation");
            String specialInstructions = (String) orderData.get("specialInstructions");
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");

            // Validate student ID format
            if (studentId == null || !studentId.matches("^SD\\d{7}$")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid Student ID format");
                error.put("message", "Student ID must be in format SD followed by 7 digits (e.g., SD2024001)");
                return ResponseEntity.badRequest().body(error);
            }

            // Validate email
            if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email format");
                return ResponseEntity.badRequest().body(error);
            }

            // Check stock for all items before creating order
            for (Map<String, Object> itemData : items) {
                Long itemId = ((Number) itemData.get("id")).longValue();
                int quantity = (int) itemData.get("quantity");

                FoodItemModel foodItem = foodItemRepository.findById(itemId).orElse(null);
                if (foodItem == null) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Item not found");
                    error.put("itemId", String.valueOf(itemId));
                    return ResponseEntity.badRequest().body(error);
                }

                if (foodItem.getStock() < quantity) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Insufficient stock");
                    error.put("itemName", foodItem.getName());
                    error.put("available", foodItem.getStock());
                    error.put("requested", quantity);
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Calculate total
            double total = 0;
            for (Map<String, Object> itemData : items) {
                double price = ((Number) itemData.get("price")).doubleValue();
                int quantity = (int) itemData.get("quantity");
                total += price * quantity;
            }

            // Create order
            OrderModel order = new OrderModel();
            order.setStudentName(studentName);
            order.setStudentId(studentId);
            order.setEmail(email);
            order.setPhone(phone);
            order.setDeliveryLocation(deliveryLocation != null ? deliveryLocation : "Canteen Pickup");
            order.setTotal(total);
            order.setStatus("pending");
            order.setSpecialInstructions(specialInstructions);
            order.setOrderDate(LocalDateTime.now());

            // Add tracking update
            List<TrackingUpdate> updates = new ArrayList<>();
            updates.add(new TrackingUpdate("Order placed successfully"));
            order.setTrackingUpdates(updates);

            // Process items and update stock
            List<OrderItemModel> orderItems = new ArrayList<>();
            for (Map<String, Object> itemData : items) {
                Long itemId = ((Number) itemData.get("id")).longValue();
                String name = (String) itemData.get("name");
                double price = ((Number) itemData.get("price")).doubleValue();
                int quantity = (int) itemData.get("quantity");

                OrderItemModel orderItem = new OrderItemModel(itemId, name, price, quantity);
                orderItem.setOrder(order);
                orderItems.add(orderItem);

                // Update stock
                FoodItemModel foodItem = foodItemRepository.findById(itemId).get();
                foodItem.setStock(foodItem.getStock() - quantity);
                foodItem.setTotalSold(foodItem.getTotalSold() + quantity);
                foodItem.setAvailable(foodItem.getStock() > 0);
                foodItemRepository.save(foodItem);
            }
            order.setItems(orderItems);

            OrderModel savedOrder = orderRepository.save(order);

            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", savedOrder.getId());
            response.put("message", "Order placed successfully!");
            response.put("total", total);
            response.put("estimatedPickupTime", getEstimatedPickupTime());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to place order");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    private String getEstimatedPickupTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime estimated = now.plusMinutes(20);
        return estimated.format(DateTimeFormatter.ofPattern("hh:mm a"));
    }
}