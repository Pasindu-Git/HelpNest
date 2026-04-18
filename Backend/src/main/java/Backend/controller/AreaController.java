package Backend.controller;

import Backend.model.AreaModel;
import Backend.model.SeatModel;
import Backend.model.ReservationModel;
import Backend.repository.AreaRepository;
import Backend.repository.SeatRepository;
import Backend.repository.ReservationRepository;
import Backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "http://localhost:3000")
public class AreaController {

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    private static final int MAX_BOOKINGS_PER_DAY = 3;

    // ============ AREA MANAGEMENT METHODS ============

    // Get all areas
    @GetMapping
    public List<AreaModel> getAllAreas() {
        List<AreaModel> areas = areaRepository.findAll();
        areas.forEach(area -> {
            if (area.getSeats() != null) {
                area.getSeats().size();
            }
        });
        return areas;
    }

    // Get area by ID
    @GetMapping("/{id}")
    public AreaModel getAreaById(@PathVariable Long id) {
        AreaModel area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with id: " + id));
        if (area.getSeats() != null) {
            area.getSeats().size();
        }
        return area;
    }

    // Create new area
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AreaModel createArea(@RequestBody AreaModel area) {
        area.setCreatedAt(LocalDateTime.now());
        area.setUpdatedAt(LocalDateTime.now());

        if (area.getRows() > 0 && area.getCols() > 0) {
            List<SeatModel> seats = new ArrayList<>();
            String prefix = area.getName().length() > 0 ? String.valueOf(area.getName().charAt(0)).toUpperCase() : "S";
            int seatCount = 1;
            for (int i = 0; i < area.getRows(); i++) {
                for (int j = 0; j < area.getCols(); j++) {
                    SeatModel seat = new SeatModel();
                    seat.setNumber(String.format("%s%02d", prefix, seatCount));
                    seat.setType(area.getSeatType() != null ? area.getSeatType() : "standard");
                    seat.setHasPower(seatCount % 2 == 0);
                    seat.setStatus("available");
                    seat.setArea(area);
                    seats.add(seat);
                    seatCount++;
                }
            }
            area.setSeats(seats);
            area.setCapacity(seats.size());
        }

        return areaRepository.save(area);
    }

    // Update area with seat regeneration
    @PutMapping("/{id}")
    @Transactional
    public AreaModel updateArea(@PathVariable Long id, @RequestBody AreaModel areaDetails) {
        AreaModel area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with id: " + id));

        boolean layoutChanged = area.getRows() != areaDetails.getRows() ||
                area.getCols() != areaDetails.getCols();

        area.setName(areaDetails.getName());
        area.setIcon(areaDetails.getIcon());
        area.setColor(areaDetails.getColor());
        area.setDescription(areaDetails.getDescription());
        area.setSeatType(areaDetails.getSeatType());
        area.setAmenities(areaDetails.getAmenities());
        area.setUpdatedAt(LocalDateTime.now());

        if (layoutChanged) {
            area.setRows(areaDetails.getRows());
            area.setCols(areaDetails.getCols());
            int newCapacity = area.getRows() * area.getCols();
            area.setCapacity(newCapacity);

            if (area.getSeats() != null && !area.getSeats().isEmpty()) {
                for (SeatModel seat : area.getSeats()) {
                    seat.setArea(null);
                }
                area.getSeats().clear();
                areaRepository.flush();
            }

            List<SeatModel> newSeats = new ArrayList<>();
            String prefix = area.getName().length() > 0 ? String.valueOf(area.getName().charAt(0)).toUpperCase() : "S";

            for (int i = 0; i < newCapacity; i++) {
                SeatModel seat = new SeatModel();
                seat.setNumber(String.format("%s%02d", prefix, i + 1));
                seat.setType(area.getSeatType() != null ? area.getSeatType() : "standard");
                seat.setHasPower((i + 1) % 2 == 0);
                seat.setStatus("available");
                seat.setArea(area);
                newSeats.add(seat);
            }

            area.setSeats(newSeats);
        }

        AreaModel savedArea = areaRepository.save(area);
        if (savedArea.getSeats() != null) {
            savedArea.getSeats().size();
        }

        return savedArea;
    }

    // Delete area
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteArea(@PathVariable Long id) {
        AreaModel area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with id: " + id));

        if (area.getSeats() != null) {
            for (SeatModel seat : area.getSeats()) {
                seat.setArea(null);
            }
            area.getSeats().clear();
        }

        areaRepository.delete(area);
        return ResponseEntity.noContent().build();
    }

    // Get seats by area
    @GetMapping("/{areaId}/seats")
    public List<SeatModel> getSeatsByArea(@PathVariable Long areaId) {
        return seatRepository.findSeatsByAreaIdOrdered(areaId);
    }

    // Add seat to area
    @PostMapping("/{areaId}/seats")
    @ResponseStatus(HttpStatus.CREATED)
    public SeatModel addSeat(@PathVariable Long areaId, @RequestBody SeatModel seat) {
        AreaModel area = areaRepository.findById(areaId)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with id: " + areaId));

        seat.setArea(area);
        if (seat.getStatus() == null) {
            seat.setStatus("available");
        }
        SeatModel savedSeat = seatRepository.save(seat);

        area.setCapacity(area.getSeats().size());
        area.setUpdatedAt(LocalDateTime.now());
        areaRepository.save(area);

        return savedSeat;
    }

    // Update seat
    @PutMapping("/seats/{seatId}")
    public SeatModel updateSeat(@PathVariable Long seatId, @RequestBody SeatModel seatDetails) {
        SeatModel seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + seatId));

        seat.setNumber(seatDetails.getNumber());
        seat.setType(seatDetails.getType());
        seat.setHasPower(seatDetails.isHasPower());
        seat.setStatus(seatDetails.getStatus());

        return seatRepository.save(seat);
    }

    // Delete seat
    @DeleteMapping("/seats/{seatId}")
    @Transactional
    public ResponseEntity<Void> deleteSeat(@PathVariable Long seatId) {
        SeatModel seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + seatId));

        Long areaId = seat.getAreaId();
        seat.setArea(null);
        seatRepository.delete(seat);

        AreaModel area = areaRepository.findById(areaId).orElse(null);
        if (area != null) {
            area.setCapacity(area.getSeats().size());
            area.setUpdatedAt(LocalDateTime.now());
            areaRepository.save(area);
        }

        return ResponseEntity.noContent().build();
    }

    // Update seat status
    @PatchMapping("/seats/{seatId}/status")
    public SeatModel updateSeatStatus(@PathVariable Long seatId, @RequestBody Map<String, String> statusUpdate) {
        SeatModel seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + seatId));

        String newStatus = statusUpdate.get("status");
        String occupant = statusUpdate.get("occupant");

        seat.setStatus(newStatus);
        if (occupant != null) {
            seat.setOccupant(occupant);
        }

        if ("reserved".equals(newStatus) && statusUpdate.containsKey("bookedUntil")) {
            seat.setBookedUntil(LocalDateTime.parse(statusUpdate.get("bookedUntil")));
        } else if ("available".equals(newStatus)) {
            seat.setOccupant(null);
            seat.setBookedUntil(null);
        }

        return seatRepository.save(seat);
    }

    // Regenerate seats
    @PutMapping("/{id}/regenerate-seats")
    @Transactional
    public AreaModel regenerateSeats(@PathVariable Long id, @RequestBody Map<String, Integer> layout) {
        AreaModel area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with id: " + id));

        int rows = layout.get("rows");
        int cols = layout.get("cols");
        int newCapacity = rows * cols;

        area.setRows(rows);
        area.setCols(cols);
        area.setCapacity(newCapacity);
        area.setUpdatedAt(LocalDateTime.now());

        if (area.getSeats() != null && !area.getSeats().isEmpty()) {
            for (SeatModel seat : area.getSeats()) {
                seat.setArea(null);
            }
            area.getSeats().clear();
            areaRepository.flush();
        }

        List<SeatModel> newSeats = new ArrayList<>();
        String prefix = area.getName().length() > 0 ? String.valueOf(area.getName().charAt(0)).toUpperCase() : "S";

        for (int i = 0; i < newCapacity; i++) {
            SeatModel seat = new SeatModel();
            seat.setNumber(String.format("%s%02d", prefix, i + 1));
            seat.setType(area.getSeatType() != null ? area.getSeatType() : "standard");
            seat.setHasPower((i + 1) % 2 == 0);
            seat.setStatus("available");
            seat.setArea(area);
            newSeats.add(seat);
        }

        area.setSeats(newSeats);

        AreaModel savedArea = areaRepository.save(area);
        if (savedArea.getSeats() != null) {
            savedArea.getSeats().size();
        }

        return savedArea;
    }

    // ============ RESERVATION METHODS (Admin View) ============

    // Get all reservations (admin)
    @GetMapping("/reservations")
    public List<ReservationModel> getAllReservations() {
        reservationRepository.markExpiredReservationsAsCompleted();
        return reservationRepository.findAll();
    }

    // Get active reservations only
    @GetMapping("/reservations/active")
    public List<ReservationModel> getActiveReservations() {
        reservationRepository.markExpiredReservationsAsCompleted();
        return reservationRepository.findActiveReservations();
    }

    // Get today's reservations
    @GetMapping("/reservations/today")
    public List<ReservationModel> getTodayReservations() {
        return reservationRepository.findTodayReservations();
    }

    // Get reservations by date
    @GetMapping("/reservations/date/{date}")
    public List<ReservationModel> getReservationsByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime startOfDay = localDate.atStartOfDay();
        LocalDateTime endOfDay = localDate.plusDays(1).atStartOfDay();
        return reservationRepository.findReservationsByDateRange(startOfDay, endOfDay);
    }

    // Get reservations by student email
    @GetMapping("/reservations/student/{email}")
    public List<ReservationModel> getReservationsByStudent(@PathVariable String email) {
        return reservationRepository.findByEmailAndStatusOrderByBookedAtDesc(email, "active");
    }

    // Get detailed statistics for admin dashboard
    @GetMapping("/reservations/statistics")
    public Map<String, Object> getReservationStatistics() {
        Map<String, Object> stats = new HashMap<>();

        reservationRepository.markExpiredReservationsAsCompleted();

        // Today's stats
        List<ReservationModel> todayReservations = reservationRepository.findTodayReservations();
        stats.put("todayTotal", todayReservations.size());

        // Unique students today
        Set<String> uniqueStudentsToday = new HashSet<>();
        for (ReservationModel r : todayReservations) {
            uniqueStudentsToday.add(r.getEmail());
        }
        stats.put("uniqueStudentsToday", uniqueStudentsToday.size());

        // Students with max bookings today (3 per day limit)
        Map<String, Integer> studentBookings = new HashMap<>();
        for (ReservationModel r : todayReservations) {
            studentBookings.put(r.getEmail(), studentBookings.getOrDefault(r.getEmail(), 0) + 1);
        }

        List<Map<String, Object>> studentsAtLimit = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : studentBookings.entrySet()) {
            if (entry.getValue() >= MAX_BOOKINGS_PER_DAY) {
                Map<String, Object> student = new HashMap<>();
                student.put("email", entry.getKey());
                student.put("bookings", entry.getValue());
                // Get student name from first reservation
                ReservationModel firstRes = todayReservations.stream()
                        .filter(r -> r.getEmail().equals(entry.getKey()))
                        .findFirst().orElse(null);
                student.put("name", firstRes != null ? firstRes.getStudentName() : "Unknown");
                studentsAtLimit.add(student);
            }
        }
        stats.put("studentsAtDailyLimit", studentsAtLimit);

        // Area popularity
        Map<String, Integer> areaPopularity = new HashMap<>();
        for (ReservationModel r : todayReservations) {
            areaPopularity.put(r.getAreaName(), areaPopularity.getOrDefault(r.getAreaName(), 0) + 1);
        }
        stats.put("areaPopularity", areaPopularity);

        // Weekly trend
        List<Map<String, Object>> weeklyTrend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.plusDays(1).atStartOfDay();
            List<ReservationModel> dayReservations = reservationRepository.findReservationsByDateRange(start, end);

            Map<String, Object> dayStat = new HashMap<>();
            dayStat.put("date", date.toString());
            dayStat.put("total", dayReservations.size());
            weeklyTrend.add(dayStat);
        }
        stats.put("weeklyTrend", weeklyTrend);

        // Total active reservations
        stats.put("totalActiveReservations", reservationRepository.findActiveReservations().size());

        // Max bookings per day limit
        stats.put("maxBookingsPerDay", MAX_BOOKINGS_PER_DAY);

        return stats;
    }

    // Force release all expired bookings
    @PostMapping("/reservations/release-expired")
    public ResponseEntity<?> releaseExpiredBookings() {
        reservationRepository.markExpiredReservationsAsCompleted();

        // Also update seat statuses
        List<ReservationModel> completedReservations = reservationRepository.findExpiredReservations();
        for (ReservationModel reservation : completedReservations) {
            SeatModel seat = seatRepository.findById(reservation.getSeatId()).orElse(null);
            if (seat != null && "occupied".equals(seat.getStatus())) {
                seat.setStatus("available");
                seat.setOccupant(null);
                seat.setBookedUntil(null);
                seatRepository.save(seat);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Expired bookings released", "released", completedReservations.size()));
    }

    // Cancel a reservation (admin)
    @DeleteMapping("/reservations/{id}")
    @Transactional
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        ReservationModel reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        reservation.setStatus("cancelled");
        reservation.setCancelledAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        // Release the seat
        SeatModel seat = seatRepository.findById(reservation.getSeatId()).orElse(null);
        if (seat != null) {
            seat.setStatus("available");
            seat.setOccupant(null);
            seat.setBookedUntil(null);
            seatRepository.save(seat);
        }

        return ResponseEntity.ok(Map.of("message", "Reservation cancelled successfully"));
    }

    // Get area statistics (original method)
    @GetMapping("/statistics")
    public Map<String, Object> getAreaStatistics() {
        Map<String, Object> stats = new HashMap<>();

        List<AreaModel> allAreas = areaRepository.findAll();
        stats.put("totalAreas", allAreas.size());
        stats.put("totalSeats", seatRepository.count());
        stats.put("availableSeats", seatRepository.findByStatus("available").size());
        stats.put("occupiedSeats", seatRepository.findByStatus("occupied").size());

        seatRepository.releaseExpiredBookings();

        List<Map<String, Object>> areaStats = new ArrayList<>();
        for (AreaModel area : allAreas) {
            Map<String, Object> areaStat = new HashMap<>();
            areaStat.put("id", area.getId());
            areaStat.put("name", area.getName());
            int totalSeats = area.getSeats() != null ? area.getSeats().size() : 0;
            areaStat.put("totalSeats", totalSeats);
            areaStat.put("availableSeats", seatRepository.countByAreaIdAndStatus(area.getId(), "available"));
            areaStat.put("occupiedSeats", seatRepository.countByAreaIdAndStatus(area.getId(), "occupied"));
            areaStat.put("occupancyRate", totalSeats > 0
                    ? ((double) (totalSeats - seatRepository.countByAreaIdAndStatus(area.getId(), "available")) / totalSeats) * 100
                    : 0);
            areaStats.add(areaStat);
        }
        stats.put("areaStatistics", areaStats);

        return stats;
    }
}