package Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email", "booking_date", "area_id", "seat_id"})
})
public class ReservationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "area_id", nullable = false)
    private Long areaId;

    @Column(name = "area_name", nullable = false)
    private String areaName;

    @Column(name = "seat_id", nullable = false)
    private Long seatId;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "duration_hours")
    private int durationHours;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @Column(name = "booked_at")
    private LocalDateTime bookedAt;

    @Column(name = "booked_until")
    private LocalDateTime bookedUntil;

    @Column(name = "status")
    private String status = "active";

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    public ReservationModel() {
        this.bookedAt = LocalDateTime.now();
        this.bookingDate = LocalDateTime.now().toLocalDate().atStartOfDay();
    }

    public ReservationModel(Long areaId, String areaName, Long seatId, String seatNumber,
                            String studentName, String studentId, String email,
                            int durationHours, LocalDateTime bookedUntil) {
        this.areaId = areaId;
        this.areaName = areaName;
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.studentName = studentName;
        this.studentId = studentId;
        this.email = email;
        this.durationHours = durationHours;
        this.bookedUntil = bookedUntil;
        this.bookedAt = LocalDateTime.now();
        this.bookingDate = LocalDateTime.now().toLocalDate().atStartOfDay();
        this.status = "active";
    }

    // ============ GETTERS AND SETTERS ============

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(int durationHours) {
        this.durationHours = durationHours;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    public LocalDateTime getBookedUntil() {
        return bookedUntil;
    }

    public void setBookedUntil(LocalDateTime bookedUntil) {
        this.bookedUntil = bookedUntil;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }
}