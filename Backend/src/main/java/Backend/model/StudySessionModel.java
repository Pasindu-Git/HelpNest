package Backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "study_sessions")
public class StudySessionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "session_date", nullable = false)
    private LocalDate date;

    @Column(name = "session_time", nullable = false)
    private String time;

    @Column(name = "duration")
    private int duration = 2;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "location_type")
    private String locationType = "physical";

    @Column(name = "meeting_url")
    private String meetingUrl;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "max_participants")
    private int maxParticipants = 20;

    @Column(name = "current_participants")
    private int currentParticipants = 0;

    @Column(name = "instructor")
    private String instructor;

    @Column(name = "status")
    private String status = "upcoming";

    @Column(name = "is_student_request")
    private boolean isStudentRequest = false;

    @Column(name = "requested_by")
    private String requestedBy;

    @Column(name = "requested_by_id")
    private String requestedById;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ElementCollection
    @CollectionTable(name = "session_registrations", joinColumns = @JoinColumn(name = "session_id"))
    private List<Registration> registrations = new ArrayList<>();

    public StudySessionModel() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLocationType() { return locationType; }
    public void setLocationType(String locationType) { this.locationType = locationType; }

    public String getMeetingUrl() { return meetingUrl; }
    public void setMeetingUrl(String meetingUrl) { this.meetingUrl = meetingUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(int maxParticipants) { this.maxParticipants = maxParticipants; }

    public int getCurrentParticipants() { return currentParticipants; }
    public void setCurrentParticipants(int currentParticipants) { this.currentParticipants = currentParticipants; }

    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isStudentRequest() { return isStudentRequest; }
    public void setStudentRequest(boolean studentRequest) { isStudentRequest = studentRequest; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }

    public String getRequestedById() { return requestedById; }
    public void setRequestedById(String requestedById) { this.requestedById = requestedById; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Registration> getRegistrations() { return registrations; }
    public void setRegistrations(List<Registration> registrations) { this.registrations = registrations; }
}