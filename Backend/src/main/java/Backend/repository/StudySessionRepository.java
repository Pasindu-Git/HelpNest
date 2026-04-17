package Backend.repository;

import Backend.model.StudySessionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySessionModel, Long> {

    List<StudySessionModel> findByStatus(String status);

    List<StudySessionModel> findBySubjectContainingIgnoreCase(String subject);

    @Query("SELECT s FROM StudySessionModel s WHERE s.status = 'upcoming' ORDER BY s.date ASC, s.time ASC")
    List<StudySessionModel> findUpcomingSessions();

    @Query("SELECT s FROM StudySessionModel s WHERE s.date >= CURRENT_DATE ORDER BY s.date ASC")
    List<StudySessionModel> findFutureSessions();

    @Query("SELECT COUNT(r) > 0 FROM StudySessionModel s JOIN s.registrations r WHERE s.id = :sessionId AND r.email = :email")
    boolean isStudentRegistered(@Param("sessionId") Long sessionId, @Param("email") String email);

    @Query("SELECT s FROM StudySessionModel s JOIN s.registrations r WHERE r.email = :email ORDER BY s.date DESC")
    List<StudySessionModel> findSessionsByStudentEmail(@Param("email") String email);

    List<StudySessionModel> findByDateGreaterThanEqual(LocalDate date);

    List<StudySessionModel> findByInstructorContainingIgnoreCase(String instructor);

    @Query("SELECT s FROM StudySessionModel s WHERE s.currentParticipants < s.maxParticipants AND s.status = 'upcoming'")
    List<StudySessionModel> findSessionsWithAvailableSeats();

    // Find sessions created by a student - FIXED: use isStudentRequest
    @Query("SELECT s FROM StudySessionModel s WHERE s.requestedById = :studentId AND s.isStudentRequest = true ORDER BY s.date DESC")
    List<StudySessionModel> findSessionsByStudentCreator(@Param("studentId") String studentId);

    // REMOVE THIS METHOD - it's causing the error
    // List<StudySessionModel> findSessionsByStudentCreatorName(String studentName);

    // Update session (for student editing their own session)
    @Modifying
    @Transactional
    @Query("UPDATE StudySessionModel s SET s.subject = :subject, s.date = :date, s.time = :time, " +
            "s.duration = :duration, s.location = :location, s.locationType = :locationType, " +
            "s.meetingUrl = :meetingUrl, s.description = :description, s.maxParticipants = :maxParticipants, " +
            "s.updatedAt = CURRENT_TIMESTAMP WHERE s.id = :id")
    void updateStudentSession(@Param("id") Long id,
                              @Param("subject") String subject,
                              @Param("date") LocalDate date,
                              @Param("time") String time,
                              @Param("duration") int duration,
                              @Param("location") String location,
                              @Param("locationType") String locationType,
                              @Param("meetingUrl") String meetingUrl,
                              @Param("description") String description,
                              @Param("maxParticipants") int maxParticipants);

    // Delete session and its registrations
    @Modifying
    @Transactional
    @Query("DELETE FROM StudySessionModel s WHERE s.id = :id AND s.isStudentRequest = true")
    int deleteStudentSession(@Param("id") Long id);
}