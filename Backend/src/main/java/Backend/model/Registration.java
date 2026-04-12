package Backend.model;

import jakarta.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class Registration {

    private String studentName;
    private String studentId;
    private String email;
    private LocalDateTime registeredAt;

    public Registration() {}

    public Registration(String studentName, String studentId, String email) {
        this.studentName = studentName;
        this.studentId = studentId;
        this.email = email;
        this.registeredAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}