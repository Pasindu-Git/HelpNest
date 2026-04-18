package Backend.controller;

import Backend.model.StudySessionModel;
import Backend.model.Registration;
import Backend.model.SessionRating;
import Backend.model.SessionRequestModel;
import Backend.repository.StudySessionRepository;
import Backend.repository.SessionRequestRepository;
import Backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/study-sessions")
@CrossOrigin(origins = "http://localhost:3000")
public class StudySessionController {

    @Autowired
    private StudySessionRepository sessionRepository;

    @Autowired
    private SessionRequestRepository requestRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // ============ ADMIN SESSION MANAGEMENT ============

    @GetMapping("/admin/all")
    public List<StudySessionModel> getAllSessions() {
        return enrichSessions(sessionRepository.findAll());
    }

    @GetMapping("/upcoming")
    public List<StudySessionModel> getUpcomingSessions() {
        return enrichSessions(sessionRepository.findUpcomingSessions());
    }

    @GetMapping("/{id}")
    public StudySessionModel getSessionById(@PathVariable Long id) {
        StudySessionModel session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));
        return enrichSession(session);
    }

    @PostMapping("/admin")
    @ResponseStatus(HttpStatus.CREATED)
    public StudySessionModel createSession(@RequestBody Map<String, Object> request) {
        StudySessionModel session = new StudySessionModel();
        session.setSubject((String) request.get("subject"));
        session.setDate(LocalDate.parse((String) request.get("date"), DATE_FORMATTER));
        session.setTime((String) request.get("time"));
        session.setDuration((Integer) request.get("duration"));
        session.setLocation((String) request.get("location"));
        session.setLocationType((String) request.get("locationType"));
        if (request.containsKey("meetingUrl") && request.get("meetingUrl") != null) {
            session.setMeetingUrl((String) request.get("meetingUrl"));
        }
        session.setDescription((String) request.get("description"));
        session.setMaxParticipants((Integer) request.get("maxParticipants"));
        session.setInstructor((String) request.get("instructor"));
        session.setStatus("upcoming");
        session.setStudentRequest(false);
        session.setCurrentParticipants(0);

        return sessionRepository.save(session);
    }

    @PutMapping("/admin/{id}")
    public StudySessionModel updateSession(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        StudySessionModel session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));

        session.setSubject((String) request.get("subject"));
        session.setDate(LocalDate.parse((String) request.get("date"), DATE_FORMATTER));
        session.setTime((String) request.get("time"));
        session.setDuration((Integer) request.get("duration"));
        session.setLocation((String) request.get("location"));
        session.setLocationType((String) request.get("locationType"));
        if (request.containsKey("meetingUrl") && request.get("meetingUrl") != null) {
            session.setMeetingUrl((String) request.get("meetingUrl"));
        }
        session.setDescription((String) request.get("description"));
        session.setMaxParticipants((Integer) request.get("maxParticipants"));
        session.setInstructor((String) request.get("instructor"));
        session.setUpdatedAt(LocalDateTime.now());

        return sessionRepository.save(session);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        StudySessionModel session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));
        sessionRepository.delete(session);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/{id}/registrations")
    public List<Registration> getSessionRegistrations(@PathVariable Long id) {
        StudySessionModel session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));
        return session.getRegistrations();
    }

    @PostMapping("/admin/{id}/send-reminder")
    public ResponseEntity<?> sendReminder(@PathVariable Long id, @RequestBody Map<String, String> reminderData) {
        StudySessionModel session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));

        String message = reminderData.get("message");
        List<String> emails = new ArrayList<>();
        for (Registration reg : session.getRegistrations()) {
            emails.add(reg.getEmail());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Reminder sent to " + emails.size() + " students");
        response.put("emails", emails);
        response.put("reminderMessage", message);

        return ResponseEntity.ok(response);
    }

    // ============ SESSION REQUEST MANAGEMENT ============

    @GetMapping("/requests")
    public List<SessionRequestModel> getAllRequests() {
        return requestRepository.findAll();
    }

    @GetMapping("/requests/pending")
    public List<SessionRequestModel> getPendingRequests() {
        return requestRepository.findPendingRequests();
    }

    @GetMapping("/requests/{id}")
    public SessionRequestModel getRequestById(@PathVariable Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
    }

    @PutMapping("/requests/{id}/review")
    public ResponseEntity<?> reviewRequest(@PathVariable Long id, @RequestBody Map<String, String> reviewData) {
        SessionRequestModel request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));

        String status = reviewData.get("status");
        String adminNote = reviewData.get("adminNote");

        request.setStatus(status);
        request.setAdminNote(adminNote);
        request.setReviewedAt(LocalDateTime.now());
        requestRepository.save(request);

        if ("approved".equals(status)) {
            StudySessionModel newSession = new StudySessionModel();
            newSession.setSubject(request.getSubject());
            newSession.setDate(request.getDate());
            newSession.setTime(request.getTime());
            newSession.setDuration(request.getDuration());
            newSession.setLocation(request.getLocation());
            newSession.setLocationType(request.getLocationType());
            newSession.setMeetingUrl(request.getMeetingUrl());
            newSession.setDescription(request.getDescription());
            newSession.setMaxParticipants(request.getExpectedParticipants());
            newSession.setInstructor(request.getStudentName());
            newSession.setStudentRequest(true);
            newSession.setRequestedBy(request.getStudentName());
            newSession.setRequestedById(request.getStudentId());
            newSession.setStatus("upcoming");
            newSession.setCurrentParticipants(0);
            sessionRepository.save(newSession);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Request " + status + " successfully");
        response.put("status", status);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        SessionRequestModel request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
        requestRepository.delete(request);
        return ResponseEntity.noContent().build();
    }

    // ============ STUDENT ENDPOINTS ============

    // Get all available sessions for students
    @GetMapping("/student/available")
    public List<StudySessionModel> getAvailableSessions() {
        return enrichSessions(sessionRepository.findSessionsWithAvailableSeats());
    }

    // Register student for a session
    @PostMapping("/student/register")
    @Transactional
    public ResponseEntity<?> registerForSession(@RequestBody Map<String, Object> registrationData) {
        Long sessionId = ((Number) registrationData.get("sessionId")).longValue();
        String studentName = (String) registrationData.get("studentName");
        String studentId = (String) registrationData.get("studentId");
        String email = (String) registrationData.get("email");

        StudySessionModel session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        // Check if already registered
        if (sessionRepository.isStudentRegistered(sessionId, email)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Already registered");
            error.put("message", "You have already registered for this session");
            return ResponseEntity.badRequest().body(error);
        }

        // Check if session is full
        if (session.getCurrentParticipants() >= session.getMaxParticipants()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Session full");
            error.put("message", "This session has reached maximum capacity");
            return ResponseEntity.badRequest().body(error);
        }

        // Add registration
        Registration registration = new Registration(studentName, studentId, email);
        session.getRegistrations().add(registration);
        session.setCurrentParticipants(session.getCurrentParticipants() + 1);
        session.setUpdatedAt(LocalDateTime.now());

        sessionRepository.save(session);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Successfully registered for " + session.getSubject());
        response.put("sessionId", session.getId());
        response.put("sessionSubject", session.getSubject());

        return ResponseEntity.ok(response);
    }

    // Unregister student from a session
    @PostMapping("/student/unregister")
    @Transactional
    public ResponseEntity<?> unregisterFromSession(@RequestBody Map<String, Object> unregisterData) {
        Long sessionId = ((Number) unregisterData.get("sessionId")).longValue();
        String email = (String) unregisterData.get("email");

        StudySessionModel session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        // Check if registered
        if (!sessionRepository.isStudentRegistered(sessionId, email)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not registered");
            error.put("message", "You are not registered for this session");
            return ResponseEntity.badRequest().body(error);
        }

        // Check if session is upcoming (can't unregister from past sessions)
        LocalDate sessionDate = session.getDate();
        if (sessionDate.isBefore(LocalDate.now())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Cannot unregister");
            error.put("message", "Cannot unregister from past sessions");
            return ResponseEntity.badRequest().body(error);
        }

        // Remove registration
        List<Registration> registrations = session.getRegistrations();
        registrations.removeIf(reg -> reg.getEmail().equals(email));
        session.setRegistrations(registrations);
        session.setCurrentParticipants(session.getCurrentParticipants() - 1);
        session.setUpdatedAt(LocalDateTime.now());

        sessionRepository.save(session);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Successfully unregistered from " + session.getSubject());

        return ResponseEntity.ok(response);
    }

    // Get student's registered sessions
    @GetMapping("/student/my-sessions/{email}")
    public List<StudySessionModel> getMySessions(@PathVariable String email) {
        return enrichSessions(sessionRepository.findSessionsByStudentEmail(email));
    }

    // Get sessions created by student - FIXED
    @GetMapping("/student/my-created-sessions/{studentId}")
    public List<StudySessionModel> getMyCreatedSessions(@PathVariable String studentId) {
        return enrichSessions(sessionRepository.findSessionsByStudentCreator(studentId));
    }

    @PostMapping("/student/rate-session")
    @Transactional
    public ResponseEntity<?> rateStudentCreatedSession(@RequestBody Map<String, Object> ratingData) {
        Long sessionId = ((Number) ratingData.get("sessionId")).longValue();
        String studentName = (String) ratingData.get("studentName");
        String studentId = (String) ratingData.get("studentId");
        String email = (String) ratingData.get("email");
        int rating = ((Number) ratingData.get("rating")).intValue();

        if (rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid rating",
                    "message", "Rating must be between 1 and 5"
            ));
        }

        StudySessionModel session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.isStudentRequest() || session.getRequestedById() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid session",
                    "message", "Only student-created sessions can be rated"
            ));
        }

        if (session.getRequestedById().equals(studentId)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cannot self-rate",
                    "message", "You cannot rate your own session"
            ));
        }

        if (!sessionRepository.isStudentRegistered(sessionId, email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "error", "Not registered",
                    "message", "Only registered students can rate this session"
            ));
        }

        boolean alreadyRated = session.getRatings().stream()
                .anyMatch(existingRating -> email.equalsIgnoreCase(existingRating.getEmail()));

        if (alreadyRated) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Already rated",
                    "message", "You have already rated this session"
            ));
        }

        session.getRatings().add(new SessionRating(studentName, studentId, email, rating));
        session.setUpdatedAt(LocalDateTime.now());
        sessionRepository.save(session);

        StudySessionModel enrichedSession = enrichSession(session);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Rating submitted successfully",
                "averageRating", enrichedSession.getAverageRating(),
                "totalRatings", enrichedSession.getTotalRatings(),
                "creatorOverallRating", enrichedSession.getCreatorOverallRating(),
                "creatorTotalRatings", enrichedSession.getCreatorTotalRatings()
        ));
    }

    // Check if student is registered for a session
    @GetMapping("/student/check-registration")
    public ResponseEntity<?> checkRegistration(@RequestParam Long sessionId, @RequestParam String email) {
        boolean isRegistered = sessionRepository.isStudentRegistered(sessionId, email);
        Map<String, Object> response = new HashMap<>();
        response.put("isRegistered", isRegistered);
        return ResponseEntity.ok(response);
    }

    // Create a session request (student)
    @PostMapping("/student/request")
    @ResponseStatus(HttpStatus.CREATED)
    public SessionRequestModel createRequest(@RequestBody Map<String, Object> requestData) {
        SessionRequestModel request = new SessionRequestModel();
        request.setSubject((String) requestData.get("subject"));
        request.setDate(LocalDate.parse((String) requestData.get("date"), DATE_FORMATTER));
        request.setTime((String) requestData.get("time"));
        request.setDuration((Integer) requestData.get("duration"));
        request.setLocation((String) requestData.get("location"));
        request.setLocationType((String) requestData.get("locationType"));
        if (requestData.containsKey("meetingUrl") && requestData.get("meetingUrl") != null) {
            request.setMeetingUrl((String) requestData.get("meetingUrl"));
        }
        request.setDescription((String) requestData.get("description"));
        request.setExpectedParticipants((Integer) requestData.get("expectedParticipants"));
        request.setStudentName((String) requestData.get("studentName"));
        request.setStudentId((String) requestData.get("studentId"));
        request.setEmail((String) requestData.get("email"));
        request.setStatus("pending");

        return requestRepository.save(request);
    }

    // Student creates a session directly (without admin approval)
    @PostMapping("/student/create-session")
    @ResponseStatus(HttpStatus.CREATED)
    public StudySessionModel createStudentSession(@RequestBody Map<String, Object> requestData) {
        StudySessionModel session = new StudySessionModel();
        session.setSubject((String) requestData.get("subject"));
        session.setDate(LocalDate.parse((String) requestData.get("date"), DATE_FORMATTER));
        session.setTime((String) requestData.get("time"));
        session.setDuration((Integer) requestData.get("duration"));
        session.setLocation((String) requestData.get("location"));
        session.setLocationType((String) requestData.get("locationType"));
        if (requestData.containsKey("meetingUrl") && requestData.get("meetingUrl") != null) {
            session.setMeetingUrl((String) requestData.get("meetingUrl"));
        }
        session.setDescription((String) requestData.get("description"));
        session.setMaxParticipants((Integer) requestData.get("maxParticipants"));
        session.setInstructor((String) requestData.get("studentName"));
        session.setStatus("upcoming");
        session.setStudentRequest(true);
        session.setRequestedBy((String) requestData.get("studentName"));
        session.setRequestedById((String) requestData.get("studentId"));
        session.setCurrentParticipants(1); // Creator is automatically registered

        // Auto-register the creator
        Registration registration = new Registration(
                (String) requestData.get("studentName"),
                (String) requestData.get("studentId"),
                (String) requestData.get("email")
        );
        session.getRegistrations().add(registration);

        return sessionRepository.save(session);
    }

    // Student edits their own session
    @PutMapping("/student/update-session/{id}")
    public ResponseEntity<?> updateStudentSession(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        StudySessionModel session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));

        // Verify ownership
        String studentId = (String) requestData.get("studentId");
        if (!session.getRequestedById().equals(studentId)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            error.put("message", "You can only edit sessions you created");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        session.setSubject((String) requestData.get("subject"));
        session.setDate(LocalDate.parse((String) requestData.get("date"), DATE_FORMATTER));
        session.setTime((String) requestData.get("time"));
        session.setDuration((Integer) requestData.get("duration"));
        session.setLocation((String) requestData.get("location"));
        session.setLocationType((String) requestData.get("locationType"));
        if (requestData.containsKey("meetingUrl") && requestData.get("meetingUrl") != null) {
            session.setMeetingUrl((String) requestData.get("meetingUrl"));
        }
        session.setDescription((String) requestData.get("description"));
        session.setMaxParticipants((Integer) requestData.get("maxParticipants"));
        session.setUpdatedAt(LocalDateTime.now());

        sessionRepository.save(session);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Session updated successfully");

        return ResponseEntity.ok(response);
    }

    // Student deletes their own session
    @DeleteMapping("/student/delete-session/{id}")
    public ResponseEntity<?> deleteStudentSession(@PathVariable Long id, @RequestParam String studentId) {
        StudySessionModel session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));

        // Verify ownership
        if (!session.getRequestedById().equals(studentId)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            error.put("message", "You can only delete sessions you created");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        sessionRepository.delete(session);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Session deleted successfully");

        return ResponseEntity.ok(response);
    }

    // ============ STATISTICS ============

    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalSessions", sessionRepository.count());
        stats.put("upcomingSessions", sessionRepository.findUpcomingSessions().size());
        stats.put("totalRegistrations", sessionRepository.findAll().stream()
                .mapToInt(s -> s.getRegistrations().size()).sum());
        stats.put("pendingRequests", requestRepository.countByStatus("pending"));
        stats.put("approvedRequests", requestRepository.countByStatus("approved"));
        stats.put("rejectedRequests", requestRepository.countByStatus("rejected"));

        List<StudySessionModel> allSessions = sessionRepository.findAll();
        int totalCapacity = allSessions.stream().mapToInt(StudySessionModel::getMaxParticipants).sum();
        int totalParticipants = allSessions.stream().mapToInt(StudySessionModel::getCurrentParticipants).sum();
        double utilizationRate = totalCapacity > 0 ? (double) totalParticipants / totalCapacity * 100 : 0;
        stats.put("utilizationRate", Math.round(utilizationRate));

        return stats;
    }

    private List<StudySessionModel> enrichSessions(List<StudySessionModel> sessions) {
        List<StudySessionModel> allSessions = sessionRepository.findAll();
        Map<String, List<StudySessionModel>> sessionsByCreator = new HashMap<>();

        for (StudySessionModel session : allSessions) {
            if (session.isStudentRequest() && session.getRequestedById() != null) {
                sessionsByCreator
                        .computeIfAbsent(session.getRequestedById(), key -> new ArrayList<>())
                        .add(session);
            }
        }

        for (StudySessionModel session : sessions) {
            enrichSessionWithCreatorStats(session, sessionsByCreator.get(session.getRequestedById()));
        }

        return sessions;
    }

    private StudySessionModel enrichSession(StudySessionModel session) {
        List<StudySessionModel> creatorSessions = null;
        if (session.isStudentRequest() && session.getRequestedById() != null) {
            creatorSessions = sessionRepository.findSessionsByStudentCreator(session.getRequestedById());
        }
        enrichSessionWithCreatorStats(session, creatorSessions);
        return session;
    }

    private void enrichSessionWithCreatorStats(StudySessionModel session, List<StudySessionModel> creatorSessions) {
        List<SessionRating> sessionRatings = session.getRatings() != null ? session.getRatings() : Collections.emptyList();
        session.setTotalRatings(sessionRatings.size());
        session.setAverageRating(calculateAverageRating(sessionRatings));

        if (session.isStudentRequest() && creatorSessions != null) {
            List<SessionRating> creatorRatings = new ArrayList<>();
            for (StudySessionModel creatorSession : creatorSessions) {
                if (creatorSession.getRatings() != null) {
                    creatorRatings.addAll(creatorSession.getRatings());
                }
            }
            session.setCreatorTotalRatings(creatorRatings.size());
            session.setCreatorOverallRating(calculateAverageRating(creatorRatings));
        } else {
            session.setCreatorTotalRatings(0);
            session.setCreatorOverallRating(0.0);
        }
    }

    private double calculateAverageRating(List<SessionRating> ratings) {
        if (ratings == null || ratings.isEmpty()) {
            return 0.0;
        }

        double average = ratings.stream()
                .mapToInt(SessionRating::getRating)
                .average()
                .orElse(0.0);

        return Math.round(average * 10.0) / 10.0;
    }

}
