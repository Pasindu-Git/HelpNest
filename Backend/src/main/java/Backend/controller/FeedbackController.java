package Backend.controller;

import Backend.model.FeedbackModel;
import Backend.repository.FeedbackRepository;
import Backend.exception.FeedbackNotFoundException;
import Backend.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    // Get all active feedbacks (excluding resolved and rejected)
    @GetMapping
    public List<FeedbackModel> getAllFeedbacks() {
        return feedbackRepository.findActiveFeedbacks();
    }

    // Get all feedbacks including resolved/rejected (for reports)
    @GetMapping("/all")
    public List<FeedbackModel> getAllFeedbacksIncludingResolved() {
        return feedbackRepository.findAll();
    }

    // Get feedbacks by student email
    @GetMapping("/student/{email}")
    public List<FeedbackModel> getFeedbacksByStudentEmail(@PathVariable String email) {
        List<FeedbackModel> allFeedbacks = feedbackRepository.findAll();
        List<FeedbackModel> studentFeedbacks = new ArrayList<>();
        for (FeedbackModel f : allFeedbacks) {
            if (f.getEmail() != null && f.getEmail().equals(email)) {
                studentFeedbacks.add(f);
            }
        }
        studentFeedbacks.sort((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()));
        return studentFeedbacks;
    }

    @GetMapping("/{id}")
    public FeedbackModel getFeedbackById(@PathVariable Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new FeedbackNotFoundException(id));
    }

    // Get image by code
    @GetMapping("/image/{imageCode}")
    public ResponseEntity<Map<String, String>> getImageByCode(@PathVariable String imageCode) {
        Optional<FeedbackModel> feedback = feedbackRepository.findByImageCode(imageCode);
        if (feedback.isPresent() && feedback.get().getImageUrl() != null) {
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", feedback.get().getImageUrl());
            response.put("imageCode", feedback.get().getImageCode());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FeedbackModel createFeedback(@RequestBody Map<String, Object> request) {
        String category = (String) request.get("category");
        String text = (String) request.get("feedbackText");
        String sdNumber = (String) request.get("sdNumber");
        String email = (String) request.get("email");
        String base64Image = (String) request.get("imageUrl");

        // Extract student name from email
        String studentName = email.split("@")[0]
                .replace(".", " ")
                .replace("_", " ");
        String[] nameParts = studentName.split(" ");
        StringBuilder capitalized = new StringBuilder();
        for (String part : nameParts) {
            if (part.length() > 0) {
                capitalized.append(part.substring(0, 1).toUpperCase())
                        .append(part.substring(1).toLowerCase())
                        .append(" ");
            }
        }

        // Set category name
        Map<String, String> categoryNames = new HashMap<>();
        categoryNames.put("academic", "Academic");
        categoryNames.put("infrastructure", "Infrastructure");
        categoryNames.put("technology", "Technology");
        categoryNames.put("facilities", "Campus Facilities");
        categoryNames.put("administration", "Administration");
        categoryNames.put("studentLife", "Student Life");

        String imageCode = null;
        String imageUrl = null;

        // Handle image upload if present
        if (base64Image != null && !base64Image.isEmpty() && !base64Image.equals("null")) {
            try {
                imageUrl = imageUploadService.uploadBase64Image(base64Image);
                imageCode = imageUploadService.getImageCodeFromUrl(imageUrl);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        FeedbackModel feedback = new FeedbackModel(
                category,
                categoryNames.get(category),
                text,
                sdNumber,
                email,
                capitalized.toString().trim(),
                imageCode,
                imageUrl
        );

        return feedbackRepository.save(feedback);
    }

    // Alternative: Upload image separately
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            String imageUrl = imageUploadService.uploadImage(file);
            String imageCode = imageUploadService.getImageCodeFromUrl(imageUrl);

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            response.put("imageCode", imageCode);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Update feedback (student editing their own feedback)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedback(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            FeedbackModel feedback = feedbackRepository.findById(id)
                    .orElseThrow(() -> new FeedbackNotFoundException(id));

            String email = (String) request.get("email");

            // Verify ownership
            if (!feedback.getEmail().equals(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Unauthorized");
                error.put("message", "You can only edit your own feedbacks");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            // Update fields
            String newCategory = (String) request.get("category");
            String newText = (String) request.get("text");
            String newBase64Image = (String) request.get("imageUrl");

            // Set category name
            Map<String, String> categoryNames = new HashMap<>();
            categoryNames.put("academic", "Academic");
            categoryNames.put("infrastructure", "Infrastructure");
            categoryNames.put("technology", "Technology");
            categoryNames.put("facilities", "Campus Facilities");
            categoryNames.put("administration", "Administration");
            categoryNames.put("studentLife", "Student Life");

            feedback.setCategory(newCategory);
            feedback.setCategoryName(categoryNames.get(newCategory));
            feedback.setText(newText);

            // Handle image update
            if (newBase64Image != null && !newBase64Image.isEmpty() && !newBase64Image.equals("null")) {
                // Delete old image if exists
                if (feedback.getImageUrl() != null) {
                    imageUploadService.deleteImage(feedback.getImageUrl());
                }
                try {
                    String newImageUrl = imageUploadService.uploadBase64Image(newBase64Image);
                    feedback.setImageUrl(newImageUrl);
                    feedback.setImageCode(imageUploadService.getImageCodeFromUrl(newImageUrl));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            // Reset status to pending when edited
            feedback.setStatus("pending");
            feedback.setAdminNote(null);

            FeedbackModel updatedFeedback = feedbackRepository.save(feedback);
            return ResponseEntity.ok(updatedFeedback);

        } catch (FeedbackNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not found");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Update failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Delete feedback (student deleting their own feedback)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id, @RequestParam String email) {
        try {
            FeedbackModel feedback = feedbackRepository.findById(id)
                    .orElseThrow(() -> new FeedbackNotFoundException(id));

            // Verify ownership
            if (!feedback.getEmail().equals(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Unauthorized");
                error.put("message", "You can only delete your own feedbacks");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            // Delete associated image file
            if (feedback.getImageUrl() != null) {
                imageUploadService.deleteImage(feedback.getImageUrl());
            }

            feedbackRepository.delete(feedback);

            Map<String, String> response = new HashMap<>();
            response.put("success", "true");
            response.put("message", "Feedback deleted successfully");
            return ResponseEntity.ok(response);

        } catch (FeedbackNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not found");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Delete failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}/status")
    public FeedbackModel updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        FeedbackModel feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new FeedbackNotFoundException(id));
        String newStatus = statusUpdate.get("status");
        String adminNote = statusUpdate.get("adminNote");

        feedback.setStatus(newStatus);
        feedback.setAdminNote(adminNote);
        return feedbackRepository.save(feedback);
    }

    @PutMapping("/{id}/reaction")
    public FeedbackModel updateReaction(@PathVariable Long id, @RequestBody Map<String, String> reaction) {
        FeedbackModel feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new FeedbackNotFoundException(id));
        String type = reaction.get("reactionType");
        if ("like".equals(type)) {
            feedback.setLikes(feedback.getLikes() + 1);
        } else if ("dislike".equals(type)) {
            feedback.setDislikes(feedback.getDislikes() + 1);
        }
        return feedbackRepository.save(feedback);
    }

    @GetMapping("/category/{category}")
    public List<FeedbackModel> getByCategory(@PathVariable String category) {
        return feedbackRepository.findByCategory(category);
    }

    @GetMapping("/status/{status}")
    public List<FeedbackModel> getByStatus(@PathVariable String status) {
        return feedbackRepository.findByStatusOrderBySubmittedAtDesc(status);
    }

    @GetMapping("/recent")
    public List<FeedbackModel> getRecentFeedbacks() {
        return feedbackRepository.findRecentFeedbacks();
    }

    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFeedbacks", feedbackRepository.count());
        stats.put("pendingIssues", feedbackRepository.findByStatus("pending").size());
        stats.put("resolvedIssues", feedbackRepository.findByStatus("resolved").size());
        stats.put("inProgressIssues", feedbackRepository.findByStatus("in-progress").size());
        stats.put("rejectedIssues", feedbackRepository.findByStatus("rejected").size());

        List<Object[]> likesDislikes = feedbackRepository.getTotalLikesAndDislikes();
        if (likesDislikes != null && !likesDislikes.isEmpty()) {
            Object[] result = likesDislikes.get(0);
            stats.put("totalLikes", result[0] != null ? result[0] : 0);
            stats.put("totalDislikes", result[1] != null ? result[1] : 0);
        }

        List<Object[]> categoryCounts = feedbackRepository.countFeedbacksByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] row : categoryCounts) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("categoryCount", categoryMap);

        List<Object[]> statusCounts = feedbackRepository.countFeedbacksByStatus();
        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : statusCounts) {
            statusMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("statusCount", statusMap);

        return stats;
    }
}