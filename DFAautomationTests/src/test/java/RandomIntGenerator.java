import java.security.SecureRandom;
import java.util.Random;

public class RandomIntGenerator {

    private static final Random RANDOM = new SecureRandom();
    private String randomInt;


    public static String generateRandomInt(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be greater than 0");
        }
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(RANDOM.nextInt(10)); // Append a random digit (0-9)
        }
        return sb.toString();
    }

    public String getRandomInt() {
        return randomInt;
    }

    public void setRandomInt(String randomInt) {
        this.randomInt = randomInt;
    }

    public static void main(String[] args) {
        RandomIntGenerator generator = new RandomIntGenerator();
        generator.setRandomInt(generateRandomInt(6));
        System.out.println("Random 6-digit Integer: " + generator.getRandomInt());
    }
}