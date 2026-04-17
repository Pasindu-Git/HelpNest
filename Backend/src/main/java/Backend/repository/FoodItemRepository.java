package Backend.repository;

import Backend.model.FoodItemModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItemModel, Long> {

    List<FoodItemModel> findByCategory(String category);

    List<FoodItemModel> findByAvailableTrue();

    List<FoodItemModel> findByNameContainingIgnoreCase(String name);

    Optional<FoodItemModel> findByImageCode(String imageCode);

    @Query("SELECT f FROM FoodItemModel f WHERE f.stock > 0 AND f.available = true")
    List<FoodItemModel> findAvailableItems();

    @Query("SELECT f.category, COUNT(f) FROM FoodItemModel f GROUP BY f.category")
    List<Object[]> countByCategory();

    @Query("SELECT SUM(f.totalSold) FROM FoodItemModel f")
    Long getTotalItemsSold();

    @Query("SELECT f FROM FoodItemModel f ORDER BY f.totalSold DESC")
    List<FoodItemModel> findTopSellingItems();
}