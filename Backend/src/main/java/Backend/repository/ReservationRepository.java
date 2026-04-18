package Backend.repository;

import Backend.model.ReservationModel;
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
public interface ReservationRepository extends JpaRepository<ReservationModel, Long> {

    // Count reservations by email for today
    @Query("SELECT COUNT(r) FROM ReservationModel r WHERE r.email = :email AND DATE(r.bookedAt) = CURRENT_DATE AND r.status = 'active'")
    long countTodayReservationsByEmail(@Param("email") String email);

    // Get all reservations for today
    @Query("SELECT r FROM ReservationModel r WHERE DATE(r.bookedAt) = CURRENT_DATE")
    List<ReservationModel> findAllDayReservations();

    // Get today's active reservations
    @Query("SELECT r FROM ReservationModel r WHERE DATE(r.bookedAt) = CURRENT_DATE AND r.status = 'active'")
    List<ReservationModel> findTodayReservations();

    // Check if seat is already booked
    @Query("SELECT COUNT(r) FROM ReservationModel r WHERE r.areaId = :areaId AND r.seatId = :seatId " +
            "AND r.status = 'active' AND r.bookedUntil > :currentTime")
    long countActiveReservationsForSeat(@Param("areaId") Long areaId, @Param("seatId") Long seatId,
                                        @Param("currentTime") LocalDateTime currentTime);

    // Get all active reservations
    @Query("SELECT r FROM ReservationModel r WHERE r.status = 'active' AND r.bookedUntil > CURRENT_TIMESTAMP ORDER BY r.bookedAt DESC")
    List<ReservationModel> findActiveReservations();

    // Get reservations by email ordered by bookedAt descending
    @Query("SELECT r FROM ReservationModel r WHERE r.email = :email ORDER BY r.bookedAt DESC")
    List<ReservationModel> findByEmailOrderByBookedAtDesc(@Param("email") String email);

    // Get reservations by email and status
    List<ReservationModel> findByEmailAndStatusOrderByBookedAtDesc(String email, String status);

    // Get active reservations by email
    @Query("SELECT r FROM ReservationModel r WHERE r.email = :email AND r.status = 'active' AND r.bookedUntil > CURRENT_TIMESTAMP ORDER BY r.bookedAt DESC")
    List<ReservationModel> findActiveReservationsByEmail(@Param("email") String email);

    // Get reservations by area
    List<ReservationModel> findByAreaIdAndStatus(Long areaId, String status);

    // Get expired reservations
    @Query("SELECT r FROM ReservationModel r WHERE r.status = 'active' AND r.bookedUntil < CURRENT_TIMESTAMP")
    List<ReservationModel> findExpiredReservations();

    // Update expired reservations to completed
    @Modifying
    @Transactional
    @Query("UPDATE ReservationModel r SET r.status = 'completed' WHERE r.status = 'active' AND r.bookedUntil < CURRENT_TIMESTAMP")
    void markExpiredReservationsAsCompleted();

    // Get reservations by date range
    @Query("SELECT r FROM ReservationModel r WHERE r.bookedAt BETWEEN :startDate AND :endDate")
    List<ReservationModel> findReservationsByDateRange(@Param("startDate") LocalDateTime startDate,
                                                       @Param("endDate") LocalDateTime endDate);

    // Cancel reservation
    @Modifying
    @Transactional
    @Query("UPDATE ReservationModel r SET r.status = 'cancelled', r.cancelledAt = CURRENT_TIMESTAMP WHERE r.id = :id AND r.email = :email AND r.status = 'active' AND r.bookedUntil > CURRENT_TIMESTAMP")
    int cancelReservation(@Param("id") Long id, @Param("email") String email);

    // Find reservation by ID and email
    Optional<ReservationModel> findByIdAndEmail(Long id, String email);

    // Get total reservations count by email
    @Query("SELECT COUNT(r) FROM ReservationModel r WHERE r.email = :email")
    Long getTotalReservationsByEmail(@Param("email") String email);

    // Get active reservations count by email
    @Query("SELECT COUNT(r) FROM ReservationModel r WHERE r.email = :email AND r.status = 'active' AND r.bookedUntil > CURRENT_TIMESTAMP")
    Long getActiveReservationsByEmail(@Param("email") String email);

    // Get upcoming reservations count by email
    @Query("SELECT COUNT(r) FROM ReservationModel r WHERE r.email = :email AND r.status = 'active' AND r.bookedAt > CURRENT_TIMESTAMP")
    Long getUpcomingReservationsByEmail(@Param("email") String email);

    // Get completed reservations count by email
    @Query("SELECT COUNT(r) FROM ReservationModel r WHERE r.email = :email AND (r.status = 'completed' OR r.bookedUntil < CURRENT_TIMESTAMP)")
    Long getCompletedReservationsByEmail(@Param("email") String email);

    // Get cancelled reservations count by email
    @Query("SELECT COUNT(r) FROM ReservationModel r WHERE r.email = :email AND r.status = 'cancelled'")
    Long getCancelledReservationsByEmail(@Param("email") String email);

    // Update expired reservations
    @Modifying
    @Transactional
    @Query("UPDATE ReservationModel r SET r.status = 'completed' WHERE r.status = 'active' AND r.bookedUntil < :currentTime")
    void updateExpiredReservations(@Param("currentTime") LocalDateTime currentTime);
}