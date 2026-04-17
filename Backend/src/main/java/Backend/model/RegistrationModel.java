package Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"session_id", "student_email"})
})
public class RegistrationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", insertable = false, updatable = false)
    private StudySessionModel session;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column(name = "attended")
    private boolean attended = false;

    @Column(name = "feedback_given")
    private boolean feedbackGiven = false;

    public RegistrationModel() {
        this.registeredAt = LocalDateTime.now();
    }

    public RegistrationModel(Long sessionId, String studentName, String studentId, String studentEmail) {
        this.sessionId = sessionId;
        this.studentName = studentName;
        this.studentId = studentId;
        this.studentEmail = studentEmail;
        this.registeredAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public StudySessionModel getSession() { return session; }
    public void setSession(StudySessionModel session) { this.session = session; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    public boolean isAttended() { return attended; }
    public void setAttended(boolean attended) { this.attended = attended; }

    public boolean isFeedbackGiven() { return feedbackGiven; }
    public void setFeedbackGiven(boolean feedbackGiven) { this.feedbackGiven = feedbackGiven; }
}