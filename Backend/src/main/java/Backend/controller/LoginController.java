package Backend.controller;

import Backend.model.StudentModel;
import Backend.model.UserModel;
import Backend.repository.StudentRepository;
import Backend.repository.UserRepository;
import Backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    // Simple password decoding
    private String decodePassword(String encodedPassword) {
        return new String(Base64.getDecoder().decode(encodedPassword));
    }

    // Student Login
    @PostMapping("/student/login")
    public ResponseEntity<?> studentLogin(@RequestBody Map<String, String> loginData) {
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

        // Check password
        String decodedPassword = decodePassword(student.getPassword());
        if (!decodedPassword.equals(password)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            error.put("message", "Incorrect password. Please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Update last login
        studentRepository.updateLastLogin(student.getId());

        // Create session response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("userType", "student");
        response.put("user", Map.of(
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

    // Admin Login
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<UserModel> userOpt = userRepository.findByEmailAndRole(email, "ADMIN");

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            error.put("message", "No admin account found with this email.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        UserModel admin = userOpt.get();

        if (!admin.isActive()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Account deactivated");
            error.put("message", "Your account has been deactivated. Please contact support.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Check password
        String decodedPassword = decodePassword(admin.getPassword());
        if (!decodedPassword.equals(password)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            error.put("message", "Incorrect password. Please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Update last login
        userRepository.updateLastLogin(admin.getId());

        // Create session response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Admin login successful!");
        response.put("userType", "admin");
        response.put("user", Map.of(
                "id", admin.getId(),
                "fullName", admin.getFullName(),
                "email", admin.getEmail(),
                "role", admin.getRole()
        ));

        return ResponseEntity.ok(response);
    }

    // Canteen Owner Login
    @PostMapping("/canteen/login")
    public ResponseEntity<?> canteenLogin(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<UserModel> userOpt = userRepository.findByEmailAndRole(email, "CANTEEN_OWNER");

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            error.put("message", "No canteen owner account found with this email.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        UserModel canteenOwner = userOpt.get();

        if (!canteenOwner.isActive()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Account deactivated");
            error.put("message", "Your account has been deactivated. Please contact support.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Check password
        String decodedPassword = decodePassword(canteenOwner.getPassword());
        if (!decodedPassword.equals(password)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            error.put("message", "Incorrect password. Please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Update last login
        userRepository.updateLastLogin(canteenOwner.getId());

        // Create session response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Canteen Owner login successful!");
        response.put("userType", "canteen_owner");
        response.put("user", Map.of(
                "id", canteenOwner.getId(),
                "fullName", canteenOwner.getFullName(),
                "email", canteenOwner.getEmail(),
                "role", canteenOwner.getRole()
        ));

        return ResponseEntity.ok(response);
    }

    // Unified Login (Auto-detect user type)
    @PostMapping("/login")
    public ResponseEntity<?> unifiedLogin(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // Try student first
        Optional<StudentModel> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            StudentModel student = studentOpt.get();
            String decodedPassword = decodePassword(student.getPassword());

            if (decodedPassword.equals(password) && student.isActive()) {
                studentRepository.updateLastLogin(student.getId());

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Student login successful!");
                response.put("userType", "student");
                response.put("user", Map.of(
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
        }

        // Try admin
        Optional<UserModel> adminOpt = userRepository.findByEmailAndRole(email, "ADMIN");
        if (adminOpt.isPresent()) {
            UserModel admin = adminOpt.get();
            String decodedPassword = decodePassword(admin.getPassword());

            if (decodedPassword.equals(password) && admin.isActive()) {
                userRepository.updateLastLogin(admin.getId());

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Admin login successful!");
                response.put("userType", "admin");
                response.put("user", Map.of(
                        "id", admin.getId(),
                        "fullName", admin.getFullName(),
                        "email", admin.getEmail(),
                        "role", admin.getRole()
                ));
                return ResponseEntity.ok(response);
            }
        }

        // Try canteen owner
        Optional<UserModel> canteenOpt = userRepository.findByEmailAndRole(email, "CANTEEN_OWNER");
        if (canteenOpt.isPresent()) {
            UserModel canteenOwner = canteenOpt.get();
            String decodedPassword = decodePassword(canteenOwner.getPassword());

            if (decodedPassword.equals(password) && canteenOwner.isActive()) {
                userRepository.updateLastLogin(canteenOwner.getId());

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Canteen Owner login successful!");
                response.put("userType", "canteen_owner");
                response.put("user", Map.of(
                        "id", canteenOwner.getId(),
                        "fullName", canteenOwner.getFullName(),
                        "email", canteenOwner.getEmail(),
                        "role", canteenOwner.getRole()
                ));
                return ResponseEntity.ok(response);
            }
        }

        // No valid user found
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid credentials");
        error.put("message", "Invalid email or password. Please try again.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // Get current session (check if logged in)
    @GetMapping("/session")
    public ResponseEntity<?> getSession(@RequestHeader(value = "Authorization", required = false) String token) {
        // This would check JWT token in production
        // For now, return simple response
        Map<String, Object> response = new HashMap<>();
        response.put("isLoggedIn", false);
        response.put("message", "No active session");
        return ResponseEntity.ok(response);
    }

    // Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }



}