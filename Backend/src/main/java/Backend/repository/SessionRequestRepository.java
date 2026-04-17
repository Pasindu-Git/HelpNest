package Backend.repository;

import Backend.model.SessionRequestModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface SessionRequestRepository extends JpaRepository<SessionRequestModel, Long> {

    List<SessionRequestModel> findByStatus(String status);

    List<SessionRequestModel> findByEmail(String email);

    List<SessionRequestModel> findByStudentNameContainingIgnoreCase(String studentName);

    @Query("SELECT r FROM SessionRequestModel r WHERE r.status = 'pending' ORDER BY r.createdAt DESC")
    List<SessionRequestModel> findPendingRequests();

    @Query("SELECT r FROM SessionRequestModel r WHERE r.status = 'approved' ORDER BY r.reviewedAt DESC")
    List<SessionRequestModel> findApprovedRequests();

    @Query("SELECT r FROM SessionRequestModel r WHERE r.status = 'rejected' ORDER BY r.reviewedAt DESC")
    List<SessionRequestModel> findRejectedRequests();

    @Modifying
    @Transactional
    @Query("UPDATE SessionRequestModel r SET r.status = :status, r.adminNote = :note, r.reviewedAt = CURRENT_TIMESTAMP WHERE r.id = :id")
    void updateRequestStatus(@Param("id") Long id, @Param("status") String status, @Param("note") String note);

    long countByStatus(String status);
}