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
@RequestMapping("/api/student/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SeatRepository seatRepository;

    // Get all reservations for a student by email
    @GetMapping("/student/{email}")
    public ResponseEntity<?> getReservationsByStudent(@PathVariable String email) {
        try {
            // Mark expired reservations first
            reservationRepository.markExpiredReservationsAsCompleted();

            List<ReservationModel> reservations = reservationRepository.findByEmailOrderByBookedAtDesc(email);

            List<Map<String, Object>> enhancedReservations = new ArrayList<>();
            for (ReservationModel reservation : reservations) {
                Map<String, Object> enhanced = new HashMap<>();
                enhanced.put("id", reservation.getId());
                enhanced.put("areaId", reservation.getAreaId());
                enhanced.put("areaName", reservation.getAreaName());
                enhanced.put("seatId", reservation.getSeatId());
                enhanced.put("seatNumber", reservation.getSeatNumber());
                enhanced.put("studentName", reservation.getStudentName());
                enhanced.put("studentId", reservation.getStudentId());
                enhanced.put("email", reservation.getEmail());
                enhanced.put("durationHours", reservation.getDurationHours());
                enhanced.put("bookedAt", reservation.getBookedAt());
                enhanced.put("bookedUntil", reservation.getBookedUntil());
                enhanced.put("status", reservation.getStatus());

                // Format date and time for display
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

                enhanced.put("date", reservation.getBookedAt().format(dateFormatter));
                enhanced.put("startTime", reservation.getBookedAt().format(timeFormatter));
                enhanced.put("endTime", reservation.getBookedUntil().format(timeFormatter));
                enhanced.put("timeSlot", reservation.getBookedAt().format(timeFormatter) + " - " +
                        reservation.getBookedUntil().format(timeFormatter));

                // Determine status for display
                String displayStatus;
                if ("cancelled".equals(reservation.getStatus())) {
                    displayStatus = "cancelled";
                } else if (reservation.getBookedUntil().isBefore(LocalDateTime.now())) {
                    displayStatus = "completed";
                } else if (reservation.getBookedAt().isBefore(LocalDateTime.now()) &&
                        reservation.getBookedUntil().isAfter(LocalDateTime.now())) {
                    displayStatus = "active";
                } else {
                    displayStatus = "upcoming";
                }
                enhanced.put("displayStatus", displayStatus);

                // Get seat details
                Optional<SeatModel> seatOpt = seatRepository.findById(reservation.getSeatId());
                if (seatOpt.isPresent()) {
                    SeatModel seat = seatOpt.get();
                    enhanced.put("seatType", seat.getType());
                    enhanced.put("hasPower", seat.isHasPower());
                }

                enhancedReservations.add(enhanced);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("reservations", enhancedReservations);
            response.put("count", enhancedReservations.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch reservations");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get active reservations for a student
    @GetMapping("/active/{email}")
    public ResponseEntity<?> getActiveReservations(@PathVariable String email) {
        try {
            reservationRepository.markExpiredReservationsAsCompleted();
            List<ReservationModel> reservations = reservationRepository.findActiveReservationsByEmail(email);

            List<Map<String, Object>> enhancedReservations = new ArrayList<>();
            for (ReservationModel reservation : reservations) {
                Map<String, Object> enhanced = new HashMap<>();
                enhanced.put("id", reservation.getId());
                enhanced.put("areaName", reservation.getAreaName());
                enhanced.put("seatNumber", reservation.getSeatNumber());
                enhanced.put("bookedUntil", reservation.getBookedUntil());
                enhanced.put("status", "active");
                enhancedReservations.add(enhanced);
            }

            return ResponseEntity.ok(enhancedReservations);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Cancel a reservation
    @DeleteMapping("/{reservationId}")
    @Transactional
    public ResponseEntity<?> cancelReservation(@PathVariable Long reservationId, @RequestParam String email) {
        try {
            // Find reservation and verify ownership
            Optional<ReservationModel> reservationOpt = reservationRepository.findByIdAndEmail(reservationId, email);

            if (reservationOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Reservation not found or unauthorized");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            ReservationModel reservation = reservationOpt.get();

            // Check if reservation can be cancelled
            if ("cancelled".equals(reservation.getStatus())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Reservation already cancelled");
                return ResponseEntity.badRequest().body(error);
            }

            if (reservation.getBookedUntil().isBefore(LocalDateTime.now())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot cancel expired reservation");
                return ResponseEntity.badRequest().body(error);
            }

            // Update reservation status to cancelled
            reservation.setStatus("cancelled");
            reservation.setCancelledAt(LocalDateTime.now());
            reservationRepository.save(reservation);

            // Release the seat back to available
            Optional<SeatModel> seatOpt = seatRepository.findById(reservation.getSeatId());
            if (seatOpt.isPresent()) {
                SeatModel seat = seatOpt.get();
                seat.setStatus("available");
                seat.setOccupant(null);
                seat.setBookedUntil(null);
                seatRepository.save(seat);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Reservation cancelled successfully. Seat is now available for others.");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to cancel reservation");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get reservation statistics for a student
    @GetMapping("/statistics/{email}")
    public ResponseEntity<?> getReservationStatistics(@PathVariable String email) {
        try {
            reservationRepository.markExpiredReservationsAsCompleted();

            List<ReservationModel> allReservations = reservationRepository.findByEmailOrderByBookedAtDesc(email);

            long total = allReservations.size();
            long active = allReservations.stream()
                    .filter(r -> "active".equals(r.getStatus()) && r.getBookedUntil().isAfter(LocalDateTime.now()))
                    .count();
            long upcoming = allReservations.stream()
                    .filter(r -> "active".equals(r.getStatus()) && r.getBookedAt().isAfter(LocalDateTime.now()))
                    .count();
            long completed = allReservations.stream()
                    .filter(r -> "completed".equals(r.getStatus()) ||
                            ("active".equals(r.getStatus()) && r.getBookedUntil().isBefore(LocalDateTime.now())))
                    .count();
            long cancelled = allReservations.stream()
                    .filter(r -> "cancelled".equals(r.getStatus()))
                    .count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("total", total);
            stats.put("active", active);
            stats.put("upcoming", upcoming);
            stats.put("completed", completed);
            stats.put("cancelled", cancelled);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch statistics");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get reservation by ID
    @GetMapping("/{reservationId}")
    public ResponseEntity<?> getReservationById(@PathVariable Long reservationId, @RequestParam String email) {
        try {
            Optional<ReservationModel> reservationOpt = reservationRepository.findByIdAndEmail(reservationId, email);

            if (reservationOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Reservation not found or unauthorized");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            ReservationModel reservation = reservationOpt.get();

            Map<String, Object> enhanced = new HashMap<>();
            enhanced.put("id", reservation.getId());
            enhanced.put("areaId", reservation.getAreaId());
            enhanced.put("areaName", reservation.getAreaName());
            enhanced.put("seatId", reservation.getSeatId());
            enhanced.put("seatNumber", reservation.getSeatNumber());
            enhanced.put("studentName", reservation.getStudentName());
            enhanced.put("studentId", reservation.getStudentId());
            enhanced.put("email", reservation.getEmail());
            enhanced.put("durationHours", reservation.getDurationHours());
            enhanced.put("bookedAt", reservation.getBookedAt());
            enhanced.put("bookedUntil", reservation.getBookedUntil());
            enhanced.put("status", reservation.getStatus());

            // Get seat details
            Optional<SeatModel> seatOpt = seatRepository.findById(reservation.getSeatId());
            if (seatOpt.isPresent()) {
                SeatModel seat = seatOpt.get();
                enhanced.put("seatType", seat.getType());
                enhanced.put("hasPower", seat.isHasPower());
            }

            return ResponseEntity.ok(enhanced);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch reservation");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}