package Backend.model;

import jakarta.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class TrackingUpdate {

    private LocalDateTime time;
    private String message;

    public TrackingUpdate() {}

    public TrackingUpdate(String message) {
        this.time = LocalDateTime.now();
        this.message = message;
    }

    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}