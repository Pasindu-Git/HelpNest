package Backend.repository;

import Backend.model.FeedbackModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackModel, Long> {

    List<FeedbackModel> findByCategory(String category);

    List<FeedbackModel> findByStatus(String status);

    Optional<FeedbackModel> findByImageCode(String imageCode);

    @Query("SELECT f FROM FeedbackModel f WHERE f.status NOT IN ('resolved', 'rejected') ORDER BY f.submittedAt DESC")
    List<FeedbackModel> findActiveFeedbacks();

    @Query("SELECT f FROM FeedbackModel f WHERE f.status = :status ORDER BY f.submittedAt DESC")
    List<FeedbackModel> findByStatusOrderBySubmittedAtDesc(@Param("status") String status);

    List<FeedbackModel> findBySdNumber(String sdNumber);

    List<FeedbackModel> findByEmail(String email);

    @Query("SELECT f FROM FeedbackModel f ORDER BY f.submittedAt DESC")
    List<FeedbackModel> findRecentFeedbacks();

    @Query("SELECT f.category, COUNT(f) FROM FeedbackModel f GROUP BY f.category")
    List<Object[]> countFeedbacksByCategory();

    @Query("SELECT f.status, COUNT(f) FROM FeedbackModel f GROUP BY f.status")
    List<Object[]> countFeedbacksByStatus();

    @Query("SELECT SUM(f.likes), SUM(f.dislikes) FROM FeedbackModel f")
    List<Object[]> getTotalLikesAndDislikes();

    @Modifying
    @Transactional
    @Query("UPDATE FeedbackModel f SET f.status = :status, f.adminNote = :note WHERE f.id = :id")
    void updateStatusAndNote(@Param("id") Long id, @Param("status") String status, @Param("note") String note);
}