package Backend.repository;

import Backend.model.SeatModel;
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
public interface SeatRepository extends JpaRepository<SeatModel, Long> {

    List<SeatModel> findByAreaId(Long areaId);

    List<SeatModel> findByStatus(String status);

    List<SeatModel> findByAreaIdAndStatus(Long areaId, String status);

    @Query("SELECT s FROM SeatModel s WHERE s.areaId = :areaId ORDER BY s.number")
    List<SeatModel> findSeatsByAreaIdOrdered(@Param("areaId") Long areaId);

    @Modifying
    @Transactional
    @Query("UPDATE SeatModel s SET s.status = :status WHERE s.id = :seatId")
    void updateSeatStatus(@Param("seatId") Long seatId, @Param("status") String status);

    // Add this method to SeatRepository.java
    @Modifying
    @Transactional
    @Query("DELETE FROM SeatModel s WHERE s.area.id = :areaId")
    void deleteByAreaId(@Param("areaId") Long areaId);

    @Modifying
    @Transactional
    @Query("UPDATE SeatModel s SET s.status = 'available', s.occupant = NULL, s.bookedUntil = NULL WHERE s.bookedUntil < CURRENT_TIMESTAMP")
    void releaseExpiredBookings();

    long countByAreaIdAndStatus(Long areaId, String status);


    // Add these methods to existing SeatRepository.java

    @Modifying
    @Transactional
    @Query("UPDATE SeatModel s SET s.status = 'available', s.occupant = NULL, s.bookedUntil = NULL WHERE s.id = :seatId")
    void releaseSeat(@Param("seatId") Long seatId);


    @Query("SELECT s FROM SeatModel s WHERE s.areaId = :areaId AND s.status = 'available'")
    List<SeatModel> findAvailableSeatsByArea(@Param("areaId") Long areaId);

// Add these methods to SeatRepository.java

    // Find seat by ID
    Optional<SeatModel> findById(Long id);

    // Update seat status
    @Modifying
    @Transactional
    @Query("UPDATE SeatModel s SET s.status = :status, s.occupant = :occupant, s.bookedUntil = :bookedUntil WHERE s.id = :id")
    void updateSeatStatus(@Param("id") Long id,
                          @Param("status") String status,
                          @Param("occupant") String occupant,
                          @Param("bookedUntil") LocalDateTime bookedUntil);




}