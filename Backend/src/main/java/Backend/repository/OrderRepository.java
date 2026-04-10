package Backend.repository;

import Backend.model.OrderModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderModel, Long> {

    // Existing methods
    List<OrderModel> findByStatus(String status);

    List<OrderModel> findByStudentId(String studentId);

    List<OrderModel> findByEmail(String email);

    @Query("SELECT o FROM OrderModel o WHERE o.status = :status ORDER BY o.orderDate DESC")
    List<OrderModel> findByStatusOrderByOrderDateDesc(@Param("status") String status);

    @Query("SELECT o FROM OrderModel o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<OrderModel> findOrdersByDateRange(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM OrderModel o WHERE DATE(o.orderDate) = CURRENT_DATE")
    List<OrderModel> findTodayOrders();

    @Modifying
    @Transactional
    @Query("UPDATE OrderModel o SET o.status = :status WHERE o.id = :id")
    void updateOrderStatus(@Param("id") Long id, @Param("status") String status);

    @Query("SELECT SUM(o.total) FROM OrderModel o WHERE DATE(o.orderDate) = CURRENT_DATE")
    Double getTodaySales();

    @Query("SELECT SUM(o.total) FROM OrderModel o")
    Double getTotalSales();

    @Query("SELECT COUNT(o) FROM OrderModel o")
    Long getTotalOrders();

    @Query("SELECT AVG(o.rating) FROM OrderModel o WHERE o.rating > 0")
    Double getAverageRating();

    // ============ NEW METHODS FOR STUDENT ORDERS ============

    // Get orders by email ordered by date descending (newest first)
    @Query("SELECT o FROM OrderModel o WHERE o.email = :email ORDER BY o.orderDate DESC")
    List<OrderModel> findByEmailOrderByOrderDateDesc(@Param("email") String email);

    // Get orders by email and status
    List<OrderModel> findByEmailAndStatus(String email, String status);

    // Get order by ID and email (for security - ensure user owns the order)
    Optional<OrderModel> findByIdAndEmail(Long id, String email);

    // Get orders by date range for a specific student
    @Query("SELECT o FROM OrderModel o WHERE o.email = :email AND o.orderDate BETWEEN :startDate AND :endDate")
    List<OrderModel> findOrdersByDateRangeForStudent(@Param("email") String email,
                                                     @Param("startDate") LocalDateTime startDate,
                                                     @Param("endDate") LocalDateTime endDate);

    // Get today's orders for a student
    @Query("SELECT o FROM OrderModel o WHERE o.email = :email AND DATE(o.orderDate) = CURRENT_DATE")
    List<OrderModel> findTodayOrdersByEmail(@Param("email") String email);

    // Cancel order (only if pending or preparing)
    @Modifying
    @Transactional
    @Query("UPDATE OrderModel o SET o.status = 'cancelled' WHERE o.id = :id AND (o.status = 'pending' OR o.status = 'preparing')")
    int cancelOrder(@Param("id") Long id);

    // Get total spent by student (excluding cancelled orders)
    @Query("SELECT SUM(o.total) FROM OrderModel o WHERE o.email = :email AND o.status != 'cancelled'")
    Double getTotalSpentByEmail(@Param("email") String email);

    // Get order count by student
    @Query("SELECT COUNT(o) FROM OrderModel o WHERE o.email = :email")
    Long getOrderCountByEmail(@Param("email") String email);

    // Get pending orders count by student
    @Query("SELECT COUNT(o) FROM OrderModel o WHERE o.email = :email AND o.status = 'pending'")
    Long getPendingOrdersCountByEmail(@Param("email") String email);

    // Get preparing orders count by student
    @Query("SELECT COUNT(o) FROM OrderModel o WHERE o.email = :email AND o.status = 'preparing'")
    Long getPreparingOrdersCountByEmail(@Param("email") String email);

    // Get ready orders count by student
    @Query("SELECT COUNT(o) FROM OrderModel o WHERE o.email = :email AND o.status = 'ready'")
    Long getReadyOrdersCountByEmail(@Param("email") String email);

    // Get delivered orders count by student
    @Query("SELECT COUNT(o) FROM OrderModel o WHERE o.email = :email AND o.status = 'delivered'")
    Long getDeliveredOrdersCountByEmail(@Param("email") String email);

    // Get cancelled orders count by student
    @Query("SELECT COUNT(o) FROM OrderModel o WHERE o.email = :email AND o.status = 'cancelled'")
    Long getCancelledOrdersCountByEmail(@Param("email") String email);

    // Get active orders (not delivered or cancelled) for a student
    @Query("SELECT o FROM OrderModel o WHERE o.email = :email AND o.status NOT IN ('delivered', 'cancelled') ORDER BY o.orderDate DESC")
    List<OrderModel> findActiveOrdersByEmail(@Param("email") String email);

    // Get recent orders (last 7 days) for a student
    @Query("SELECT o FROM OrderModel o WHERE o.email = :email AND o.orderDate >= :recentDate ORDER BY o.orderDate DESC")
    List<OrderModel> findRecentOrdersByEmail(@Param("email") String email, @Param("recentDate") LocalDateTime recentDate);
}