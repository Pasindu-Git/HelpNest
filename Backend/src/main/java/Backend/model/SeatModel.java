package Backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seats")
public class SeatModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_number", nullable = false)
    private String number;

    @Column(name = "seat_type")
    private String type = "standard";

    @Column(name = "has_power")
    private boolean hasPower = false;

    @Column(name = "status")
    private String status = "available";

    @Column(name = "occupant_name")
    private String occupant;

    @Column(name = "booked_until")
    private LocalDateTime bookedUntil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    @JsonBackReference
    private AreaModel area;

    @Column(name = "area_id", insertable = false, updatable = false)
    private Long areaId;

    public SeatModel() {}

    public SeatModel(String number, String type, boolean hasPower, String status) {
        this.number = number;
        this.type = type;
        this.hasPower = hasPower;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isHasPower() { return hasPower; }
    public void setHasPower(boolean hasPower) { this.hasPower = hasPower; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOccupant() { return occupant; }
    public void setOccupant(String occupant) { this.occupant = occupant; }

    public LocalDateTime getBookedUntil() { return bookedUntil; }
    public void setBookedUntil(LocalDateTime bookedUntil) { this.bookedUntil = bookedUntil; }

    public AreaModel getArea() { return area; }
    public void setArea(AreaModel area) { this.area = area; }

    public Long getAreaId() { return areaId; }
    public void setAreaId(Long areaId) { this.areaId = areaId; }
}