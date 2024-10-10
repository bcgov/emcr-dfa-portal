import lombok.Getter;
import lombok.Setter;

import java.security.SecureRandom;
import java.util.Random;

@Getter
public class RandomStringGenerator {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final Random RANDOM = new SecureRandom();
    @Getter
    @Setter
    private String randomString;

    public static String generateRandomAlphanumeric(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    public static String generateRandomAlphanumericWithSpaces(int length) {
        StringBuilder sb = new StringBuilder(length);
        int wordLength = 5; // Define the length of each word
        for (int i = 0; i < length; i++) {
            if (i > 0 && i % wordLength == 0) {
                sb.append(' '); // Insert a space after every wordLength characters
            }
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        RandomStringGenerator generator = new RandomStringGenerator();
        generator.setRandomString(generateRandomAlphanumeric(20));
        System.out.println("Random Alphanumeric String: " + generator.getRandomString());
    }
}