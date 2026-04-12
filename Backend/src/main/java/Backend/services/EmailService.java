package Backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("🎉 Welcome to Campus Portal!");

            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<style>" +
                    "body { font-family: 'Segoe UI', Arial, sans-serif; }" +
                    ".container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }" +
                    ".header { background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }" +
                    ".header h1 { color: white; margin: 0; font-size: 24px; }" +
                    ".content { padding: 20px; }" +
                    ".welcome-text { font-size: 22px; font-weight: bold; color: #0F172A; margin-bottom: 15px; }" +
                    ".message { color: #475569; line-height: 1.6; margin-bottom: 20px; }" +
                    ".features { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 15px; border-radius: 10px; margin: 20px 0; }" +
                    ".feature { padding: 8px 0; border-bottom: 1px solid #bbf7d0; }" +
                    ".feature:last-child { border-bottom: none; }" +
                    ".button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; margin: 20px 0; }" +
                    ".footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>" +
                    "<div class='header'>" +
                    "<h1>🎓 Campus Portal</h1>" +
                    "</div>" +
                    "<div class='content'>" +
                    "<div class='welcome-text'>Welcome, " + name + "! 🎉</div>" +
                    "<div class='message'>" +
                    "Thank you for joining Campus Portal! Your account has been successfully created. " +
                    "We're excited to have you on board." +
                    "</div>" +
                    "<div class='features'>" +
                    "<h3 style='margin-top: 0; color: #0F172A;'>✨ What you can do:</h3>" +
                    "<div class='feature'>🍔 Order food from campus canteens</div>" +
                    "<div class='feature'>📚 Reserve study spots across campus</div>" +
                    "<div class='feature'>💬 Share feedback and suggestions</div>" +
                    "<div class='feature'>📊 Track your orders and reservations</div>" +
                    "</div>" +
                    "<div style='text-align: center;'>" +
                    "<a href='http://localhost:3000/student-login' class='button'>Login to Your Account</a>" +
                    "</div>" +
                    "<div class='message' style='font-size: 14px;'>" +
                    "<strong>Need help?</strong> Contact our support team at support@campusportal.com" +
                    "</div>" +
                    "</div>" +
                    "<div class='footer'>" +
                    "<p>&copy; 2024 Campus Portal. All rights reserved.</p>" +
                    "<p>This is an automated message, please do not reply to this email.</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✅ Welcome email sent successfully to: " + to);

        } catch (Exception e) {
            System.err.println("❌ Failed to send welcome email to: " + to);
            e.printStackTrace();
        }
    }

    public void sendFeedbackStatusUpdateEmail(String to, String studentName, String categoryName, String status, String adminNote) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String safeName = studentName == null || studentName.trim().isEmpty() ? "Student" : studentName.trim();
            String safeCategory = categoryName == null || categoryName.trim().isEmpty() ? "General" : categoryName.trim();
            String safeStatus = status == null || status.trim().isEmpty() ? "updated" : status.trim();
            String safeAdminNote = adminNote == null || adminNote.trim().isEmpty()
                    ? "Your feedback status has been updated by the administration team."
                    : adminNote.trim();

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Feedback Status Updated - " + safeStatus.toUpperCase());

            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<style>" +
                    "body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; }" +
                    ".container { max-width: 640px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }" +
                    ".header { background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%); padding: 24px; text-align: center; }" +
                    ".header h1 { color: white; margin: 0; font-size: 24px; }" +
                    ".content { padding: 24px; color: #334155; line-height: 1.6; }" +
                    ".status-badge { display: inline-block; padding: 8px 14px; border-radius: 999px; background: #dcfce7; color: #166534; font-weight: 700; margin: 12px 0; text-transform: uppercase; }" +
                    ".details { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; }" +
                    ".note { background: #eff6ff; border-left: 4px solid #22C55E; padding: 14px; border-radius: 8px; margin-top: 16px; white-space: pre-wrap; }" +
                    ".button { display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%); color: white !important; text-decoration: none; border-radius: 999px; font-weight: 600; margin-top: 20px; }" +
                    ".footer { padding: 18px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>" +
                    "<div class='header'>" +
                    "<h1>Campus Portal Feedback Update</h1>" +
                    "</div>" +
                    "<div class='content'>" +
                    "<p>Hello " + safeName + ",</p>" +
                    "<p>Your feedback submission has been reviewed by the admin team.</p>" +
                    "<div class='status-badge'>" + safeStatus + "</div>" +
                    "<div class='details'>" +
                    "<p><strong>Category:</strong> " + safeCategory + "</p>" +
                    "<p><strong>Updated Status:</strong> " + safeStatus + "</p>" +
                    "</div>" +
                    "<p><strong>Admin Message:</strong></p>" +
                    "<div class='note'>" + safeAdminNote + "</div>" +
                    "<a href='http://localhost:3000/student-feedbacks' class='button'>View My Feedbacks</a>" +
                    "</div>" +
                    "<div class='footer'>" +
                    "<p>This is an automated message from Campus Portal.</p>" +
                    "<p>Please do not reply directly to this email.</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Feedback status update email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send feedback status update email to: " + to);
            e.printStackTrace();
        }
    }
}
