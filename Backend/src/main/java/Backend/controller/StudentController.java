package Backend.controller;

import Backend.model.StudentModel;
import Backend.repository.StudentRepository;
import Backend.service.EmailService;
import Backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    // Simple password encoding (Base64 - for demo only)
    private String encodePassword(String password) {
        return Base64.getEncoder().encodeToString(password.getBytes());
    }

    // Student Registration with Welcome Email (No Verification)
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> registerStudent(@RequestBody Map<String, Object> request) {
        try {
            String fullName = (String) request.get("fullName");
            String studentId = (String) request.get("studentId");
            String email = (String) request.get("email");
            String phone = (String) request.get("phone");
            String password = (String) request.get("password");
            String faculty = (String) request.get("faculty");
            String yearOfStudy = (String) request.get("yearOfStudy");
            String address = (String) request.get("address");

            // Check if email already exists
            if (studentRepository.existsByEmail(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email already registered");
                error.put("message", "This email is already registered. Please login or use a different email.");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if student ID already exists
            if (studentRepository.existsByStudentId(studentId)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Student ID already exists");
                error.put("message", "This Student ID is already registered.");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new student (directly verified)
            StudentModel student = new StudentModel();
            student.setFullName(fullName);
            student.setStudentId(studentId);
            student.setEmail(email);
            student.setPhone(phone);
            student.setPassword(encodePassword(password));
            student.setFaculty(faculty);
            student.setYearOfStudy(yearOfStudy);
            student.setAddress(address);
            student.setVerified(true); // Auto-verified
            student.setActive(true);

            StudentModel savedStudent = studentRepository.save(student);

            // Send welcome email
            emailService.sendWelcomeEmail(email, fullName);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful! A welcome email has been sent to your email address.");
            response.put("studentId", savedStudent.getId());
            response.put("email", savedStudent.getEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Student Login
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<StudentModel> studentOpt = studentRepository.findByEmail(email);

        if (studentOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            error.put("message", "No account found with this email.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        StudentModel student = studentOpt.get();

        if (!student.isActive()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Account deactivated");
            error.put("message", "Your account has been deactivated. Please contact support.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Check password (decode and compare)
        String decodedPassword = new String(Base64.getDecoder().decode(student.getPassword()));
        if (!decodedPassword.equals(password)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            error.put("message", "Incorrect password. Please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Update last login
        studentRepository.updateLastLogin(student.getId());

        // Create session response (without password)
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("student", Map.of(
                "id", student.getId(),
                "fullName", student.getFullName(),
                "studentId", student.getStudentId(),
                "email", student.getEmail(),
                "phone", student.getPhone(),
                "faculty", student.getFaculty(),
                "yearOfStudy", student.getYearOfStudy()
        ));

        return ResponseEntity.ok(response);
    }

    // Get Student by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        StudentModel student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        Map<String, Object> response = new HashMap<>();
        response.put("id", student.getId());
        response.put("fullName", student.getFullName());
        response.put("studentId", student.getStudentId());
        response.put("email", student.getEmail());
        response.put("phone", student.getPhone());
        response.put("faculty", student.getFaculty());
        response.put("yearOfStudy", student.getYearOfStudy());
        response.put("address", student.getAddress());

        return ResponseEntity.ok(response);
    }

    // Get Student Statistics
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("activeStudents", studentRepository.findAll().stream().filter(StudentModel::isActive).count());
        return stats;
    }


    // Get current student profile by ID
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getStudentProfile(@PathVariable Long id) {
        Optional<StudentModel> studentOpt = studentRepository.findById(id);

        if (studentOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Student not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        StudentModel student = studentOpt.get();

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", student.getId());
        profile.put("fullName", student.getFullName());
        profile.put("studentId", student.getStudentId());
        profile.put("email", student.getEmail());
        profile.put("phone", student.getPhone());
        profile.put("faculty", student.getFaculty());
        profile.put("yearOfStudy", student.getYearOfStudy());
        profile.put("address", student.getAddress());
        profile.put("isVerified", student.isVerified());
        profile.put("isActive", student.isActive());
        profile.put("registeredAt", student.getRegisteredAt());

        // Calculate batch based on year of study
        String batch = calculateBatch(student.getYearOfStudy());
        profile.put("batch", batch);

        return ResponseEntity.ok(profile);
    }

    private String calculateBatch(String yearOfStudy) {
        if (yearOfStudy == null) return "Batch 2024";
        switch(yearOfStudy) {
            case "1st Year": return "Batch 2027";
            case "2nd Year": return "Batch 2026";
            case "3rd Year": return "Batch 2025";
            case "4th Year": return "Batch 2024";
            case "Final Year": return "Batch 2023";
            default: return "Batch 2024";
        }
    }

    // Get student statistics (orders, bookings, etc.)
    @GetMapping("/statistics/{id}")
    public ResponseEntity<?> getStudentStatistics(@PathVariable Long id) {
        // This would connect to other services
        // For now, return placeholder data
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", 12);
        stats.put("totalBookings", 5);
        stats.put("totalEvents", 3);
        stats.put("totalFeedbacks", 4);

        return ResponseEntity.ok(stats);
    }
}