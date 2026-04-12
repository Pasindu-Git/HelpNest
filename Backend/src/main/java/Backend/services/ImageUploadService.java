package Backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
public class ImageUploadService {

    @Value("${image.upload.directory}")
    private String uploadDirectory;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    public String uploadImage(MultipartFile file) throws IOException {
        // Generate unique code for image
        String imageCode = generateUniqueCode();

        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Get file extension
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Generate unique filename
        String fileName = imageCode + extension;
        Path filePath = uploadPath.resolve(fileName);

        // Save file
        file.transferTo(filePath.toFile());

        // Return image URL
        return imageBaseUrl + "/images/" + fileName;
    }

    public String uploadBase64Image(String base64Image) throws IOException {
        // Generate unique code for image
        String imageCode = generateUniqueCode();

        // Remove data:image/png;base64, prefix if present
        String base64Data = base64Image;
        if (base64Image.contains(",")) {
            base64Data = base64Image.split(",")[1];
        }

        // Decode base64 to bytes
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Determine file extension (default to png)
        String extension = ".png";
        if (base64Image.startsWith("data:image/jpeg") || base64Image.startsWith("data:image/jpg")) {
            extension = ".jpg";
        } else if (base64Image.startsWith("data:image/gif")) {
            extension = ".gif";
        }

        // Generate filename
        String fileName = imageCode + extension;
        Path filePath = uploadPath.resolve(fileName);

        // Save file
        Files.write(filePath, imageBytes);

        // Return image URL
        return imageBaseUrl + "/images/" + fileName;
    }

    public String getImageCodeFromUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        return fileName.contains(".") ? fileName.substring(0, fileName.lastIndexOf(".")) : fileName;
    }

    private String generateUniqueCode() {
        return "IMG_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    public boolean deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return false;
        }
        try {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDirectory).resolve(fileName);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}