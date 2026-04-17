package Backend.repository;

import Backend.model.StudentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentModel, Long> {

    Optional<StudentModel> findByEmail(String email);

    Optional<StudentModel> findByStudentId(String studentId);

    @Modifying
    @Transactional
    @Query("UPDATE StudentModel s SET s.lastLogin = CURRENT_TIMESTAMP WHERE s.id = :id")
    void updateLastLogin(@Param("id") Long id);

    boolean existsByEmail(String email);
    boolean existsByStudentId(String studentId);
}