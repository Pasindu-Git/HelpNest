package Backend.exception;

public class FeedbackNotFoundException extends RuntimeException {

    public FeedbackNotFoundException(Long id) {
        super("Feedback not found with id: " + id);
    }

    public FeedbackNotFoundException(String message) {
        super(message);
    }
}