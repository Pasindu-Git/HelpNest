package Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "feedbacks")
public class FeedbackModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "category_name")
    private String categoryName;

    @Column(name = "feedback_text", nullable = false, length = 500)
    private String text;

    @Column(name = "sd_number", nullable = false)
    private String sdNumber;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "image_code", unique = true)
    private String imageCode;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    @Column(name = "likes")
    private int likes = 0;

    @Column(name = "dislikes")
    private int dislikes = 0;

    @Column(name = "status")
    private String status = "pending";

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    public FeedbackModel() {
        this.submittedAt = LocalDateTime.now();
        this.createdAt = new Date();
    }

    public FeedbackModel(String category, String categoryName, String text, String sdNumber,
                         String email, String studentName, String imageCode, String imageUrl) {
        this.category = category;
        this.categoryName = categoryName;
        this.text = text;
        this.sdNumber = sdNumber;
        this.email = email;
        this.studentName = studentName;
        this.imageCode = imageCode;
        this.imageUrl = imageUrl;
        this.createdAt = new Date();
        this.submittedAt = LocalDateTime.now();
        this.likes = 0;
        this.dislikes = 0;
        this.status = "pending";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getSdNumber() { return sdNumber; }
    public void setSdNumber(String sdNumber) { this.sdNumber = sdNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getImageCode() { return imageCode; }
    public void setImageCode(String imageCode) { this.imageCode = imageCode; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public int getDislikes() { return dislikes; }
    public void setDislikes(int dislikes) { this.dislikes = dislikes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }
}