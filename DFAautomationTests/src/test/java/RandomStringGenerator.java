import java.security.SecureRandom;
import java.util.Random;

public class RandomStringGenerator {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final Random RANDOM = new SecureRandom();
    private String randomString;

    public static String generateRandomAlphanumeric(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    public String getRandomString() {
        return randomString;
    }

    public void setRandomString(String randomString) {
        this.randomString = randomString;
    }

    public static void main(String[] args) {
        RandomStringGenerator generator = new RandomStringGenerator();
        generator.setRandomString(generateRandomAlphanumeric(20));
        System.out.println("Random Alphanumeric String: " + generator.getRandomString());
    }
}