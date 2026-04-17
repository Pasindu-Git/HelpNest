package Backend.repository;

import Backend.model.AreaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<AreaModel, Long> {

    Optional<AreaModel> findByName(String name);

    List<AreaModel> findByNameContainingIgnoreCase(String name);

    List<AreaModel> findBySeatType(String seatType);

    @Query("SELECT a FROM AreaModel a WHERE a.capacity > :minCapacity")
    List<AreaModel> findAreasWithCapacityGreaterThan(@Param("minCapacity") int minCapacity);

    @Query("SELECT a.name, COUNT(s) FROM AreaModel a LEFT JOIN a.seats s GROUP BY a.id")
    List<Object[]> getSeatCountByArea();

    @Query("SELECT a, COUNT(s) FROM AreaModel a LEFT JOIN a.seats s WHERE s.status = 'available' GROUP BY a.id")
    List<Object[]> getAvailableSeatsByArea();
}