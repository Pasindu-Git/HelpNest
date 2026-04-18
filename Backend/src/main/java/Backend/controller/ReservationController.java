package Backend.controller;

import Backend.model.ReservationModel;
import Backend.model.SeatModel;
import Backend.repository.ReservationRepository;
import Backend.repository.SeatRepository;
import Backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SeatRepository seatRepository;

    private static final int MAX_BOOKINGS_PER_DAY = 3;

    // Create new reservation
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createReservation(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            Long areaId = ((Number) request.get("areaId")).longValue();
            Long seatId = ((Number) request.get("seatId")).longValue();
            String areaName = (String) request.get("areaName");
            String seatNumber = (String) request.get("seatNumber");
            String studentName = (String) request.get("studentName");
            String studentId = (String) request.get("studentId");
            int durationHours = (int) request.get("durationHours");

            // Check if student already has 3 bookings today
            long todayBookings = reservationRepository.countTodayReservationsByEmail(email);
            if (todayBookings >= MAX_BOOKINGS_PER_DAY) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Maximum bookings per day reached");
                error.put("message", "You can only book up to " + MAX_BOOKINGS_PER_DAY + " slots per day");
                error.put("currentBookings", todayBookings);
                return ResponseEntity.badRequest().body(error);
            }

            // Check if seat is already booked
            long activeReservations = reservationRepository.countActiveReservationsForSeat(areaId, seatId, LocalDateTime.now());
            if (activeReservations > 0) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Seat already booked");
                error.put("message", "This seat is already reserved for the current time");
                return ResponseEntity.badRequest().body(error);
            }

            // Calculate booked until time
            LocalDateTime bookedUntil = LocalDateTime.now().plusHours(durationHours);

            // Create reservation
            ReservationModel reservation = new ReservationModel(
                    areaId, areaName, seatId, seatNumber,
                    studentName, studentId, email, durationHours, bookedUntil
            );

            ReservationModel savedReservation = reservationRepository.save(reservation);

            // Update seat status to occupied
            SeatModel seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat not found"));
            seat.setStatus("occupied");
            seat.setOccupant(studentName);
            seat.setBookedUntil(bookedUntil);
            seatRepository.save(seat);

            return ResponseEntity.ok(savedReservation);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Booking failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get all active reservations
    @GetMapping
    public List<ReservationModel> getAllActiveReservations() {
        reservationRepository.markExpiredReservationsAsCompleted();
        return reservationRepository.findActiveReservations();
    }

    // Get reservations by email
    @GetMapping("/student/{email}")
    public List<ReservationModel> getReservationsByEmail(@PathVariable String email) {
        return reservationRepository.findByEmailOrderByBookedAtDesc(email);
    }

    // Get today's reservations
    @GetMapping("/today")
    public List<ReservationModel> getTodayReservations() {
        return reservationRepository.findTodayReservations();
    }

    // Get reservation by ID
    @GetMapping("/{id}")
    public ReservationModel getReservationById(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
    }

    // Cancel reservation
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id, @RequestParam String email) {
        int updated = reservationRepository.cancelReservation(id, email);
        if (updated > 0) {
            // Find the seat and update its status
            ReservationModel reservation = reservationRepository.findById(id).orElse(null);
            if (reservation != null) {
                SeatModel seat = seatRepository.findById(reservation.getSeatId()).orElse(null);
                if (seat != null) {
                    seat.setStatus("available");
                    seat.setOccupant(null);
                    seat.setBookedUntil(null);
                    seatRepository.save(seat);
                }
            }
            return ResponseEntity.ok().body(Map.of("message", "Reservation cancelled successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    // Check booking availability for student
    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(@RequestParam String email) {
        long todayBookings = reservationRepository.countTodayReservationsByEmail(email);
        int remainingBookings = MAX_BOOKINGS_PER_DAY - (int) todayBookings;

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("todayBookings", todayBookings);
        response.put("maxBookingsPerDay", MAX_BOOKINGS_PER_DAY);
        response.put("remainingBookings", Math.max(0, remainingBookings));
        response.put("canBook", remainingBookings > 0);

        return ResponseEntity.ok(response);
    }

    // Get statistics
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        reservationRepository.markExpiredReservationsAsCompleted();

        long totalActive = reservationRepository.findActiveReservations().size();
        long todayTotal = reservationRepository.findTodayReservations().size();

        // Get unique students today
        List<ReservationModel> todayReservations = reservationRepository.findTodayReservations();
        Set<String> uniqueStudents = new HashSet<>();
        for (ReservationModel r : todayReservations) {
            uniqueStudents.add(r.getEmail());
        }

        // Get popular areas
        Map<String, Integer> areaPopularity = new HashMap<>();
        for (ReservationModel r : todayReservations) {
            areaPopularity.put(r.getAreaName(), areaPopularity.getOrDefault(r.getAreaName(), 0) + 1);
        }

        stats.put("totalActiveReservations", totalActive);
        stats.put("todayReservations", todayTotal);
        stats.put("uniqueStudentsToday", uniqueStudents.size());
        stats.put("maxBookingsPerDay", MAX_BOOKINGS_PER_DAY);
        stats.put("popularAreas", areaPopularity);

        return stats;
    }

    // Release expired bookings (called by scheduler or manually)
    @PostMapping("/release-expired")
    public ResponseEntity<?> releaseExpiredBookings() {
        List<ReservationModel> expiredReservations = reservationRepository.findExpiredReservations();

        for (ReservationModel reservation : expiredReservations) {
            reservation.setStatus("completed");
            reservationRepository.save(reservation);

            // Release seat
            SeatModel seat = seatRepository.findById(reservation.getSeatId()).orElse(null);
            if (seat != null && "occupied".equals(seat.getStatus())) {
                seat.setStatus("available");
                seat.setOccupant(null);
                seat.setBookedUntil(null);
                seatRepository.save(seat);
            }
        }

        return ResponseEntity.ok(Map.of("released", expiredReservations.size()));
    }
}