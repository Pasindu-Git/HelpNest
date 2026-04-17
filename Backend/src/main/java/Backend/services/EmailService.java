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
}