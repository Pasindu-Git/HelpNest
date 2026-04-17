package Backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "areas")
public class AreaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "icon")
    private String icon = "Building";

    @Column(name = "color")
    private String color = "#22C55E";

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "capacity")
    private int capacity = 0;

    @Column(name = "rows_count")
    private int rows = 4;

    @Column(name = "cols_count")
    private int cols = 4;

    @Column(name = "seat_type")
    private String seatType = "standard";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<SeatModel> seats = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "area_amenities", joinColumns = @JoinColumn(name = "area_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();

    public AreaModel() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public AreaModel(String name, String icon, String color, String description,
                     int capacity, int rows, int cols, String seatType) {
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.description = description;
        this.capacity = capacity;
        this.rows = rows;
        this.cols = cols;
        this.seatType = seatType;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.seats = new ArrayList<>();
        this.amenities = new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getRows() { return rows; }
    public void setRows(int rows) { this.rows = rows; }

    public int getCols() { return cols; }
    public void setCols(int cols) { this.cols = cols; }

    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<SeatModel> getSeats() { return seats; }
    public void setSeats(List<SeatModel> seats) {
        this.seats = seats;
        if (seats != null) {
            for (SeatModel seat : seats) {
                seat.setArea(this);
            }
        }
    }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
}