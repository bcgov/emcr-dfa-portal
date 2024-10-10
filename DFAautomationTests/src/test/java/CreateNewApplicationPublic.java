import dfa.CustomWebDriverManager;
import dfa.ElementClickHelper;
import dfa.ElementInteractionHelper;
import lombok.Getter;
import lombok.Setter;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static dfa.CustomWebDriverManager.getDriver;

public class CreateNewApplicationPublic {
    private WebDriver driver;

    @Setter
    @Getter
    private static String randomChars;

    @Setter
    @Getter
    private static String DBAName = "Test DBA Name";

    private static String bceidUSERNAME = System.getenv("USERNAME_BCEID");

    @After
    public void tearDown() {
        driver.close();
        driver.quit();
    }

    @AfterClass
    public static void afterClass() {
        CustomWebDriverManager.instance = null;
    }

    @Test
    public void test() throws Exception {
        driver = getDriver();
        WebElement element;
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        CustomWebDriverManager.getElements();

        createApplication(false);

        // Submit
        Thread.sleep(1000);
        clickSubmitButton(driver, driverWait);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("(//span[contains(text(),'Submit')])[last()]")));

        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        int attempts = 0;
        while (attempts < 3) {
            try {
                element.sendKeys(Keys.ENTER);
                System.out.println("Submit button is clicked");
                break;
            } catch (org.openqa.selenium.ElementNotInteractableException e) {
                Thread.sleep(500); // Adjust the sleep time as necessary
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            }
            attempts++;
        }
        // Submit Application Confirmation
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to submit my application. ')]")));
        element.click();

        // Check success message
        // there's a bug that redirect doesn't work, need to uncomment after fix

//        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Your application has been submitted. ')]")));
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Back To Dashboard ')]")));
//        element.click();
//
//        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Cause(s) of Damage - ')]")));
//        WebElement bodyElement = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
//        String bodyText = bodyElement.getText();
//        if (bodyText.contains(getRandomChars())) {
//            System.out.println("The body contains: " + getRandomChars());
//        } else {
//            System.out.println("The body does not contain: " + getRandomChars());
//        }
    }

    public static void createApplication(Boolean isDraft) throws Exception {
        WebDriver driver = getDriver();
        WebElement element;
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        CustomWebDriverManager.getElements();

        LoginPublicPortal loginPublicPortal = new LoginPublicPortal();
        loginPublicPortal.test();

        // Create New application
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Create a New Application ')]")));
        element.click();

        // Select dates
        Calendar calendar = Calendar.getInstance();
        Date today = calendar.getTime();

        calendar.add(Calendar.DAY_OF_YEAR, -10);
        Date yesterday = calendar.getTime();

        DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");

        String todayAsString = dateFormat.format(today);
        String yesterdayAsString = dateFormat.format(yesterday);

        System.out.println(todayAsString);
        System.out.println(yesterdayAsString);

        // Date of damage
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='damageFromDate']")));
        element.clear();
        element.sendKeys("08/16/2024");

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='damageToDate']")));
        element.clear();
        element.sendKeys("08/19/2024");

        Thread.sleep(2000);
        //Choose and event
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='eventId']")));
        element.click();

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//mat-option")));
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//span[contains(text(),'August 1')]")));
        element.click();

        // Select cause of damage
        Thread.sleep(1000);
        String[] checkboxIds = {
                "mat-mdc-checkbox-1-input",
                "mat-mdc-checkbox-2-input",
                "mat-mdc-checkbox-3-input",
                "mat-mdc-checkbox-4-input",
                "mat-mdc-checkbox-5-input"
        };

        for (String id : checkboxIds) {
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id(id)));
            ElementClickHelper.clickElement(driver, element);
        }

        CreateNewApplicationPublic.setRandomChars(generateDamageCause());

        // Cause of damage
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='otherDamageText']")));
        element.clear();
        element.sendKeys(getRandomChars());

        // Application Type
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='applicantSubtype']")));
        ElementClickHelper.clickElement(driver, element);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Municipality')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

        // Click on Next
        Thread.sleep(1000);
        nextReviewSubmission(driver, driverWait);

        if (isDraft) {
            setDBAName(DBAName + " - DraftApplication");
        }

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(text(),'Doing Business as (DBA) Name')]/parent::div//input")));
        element.sendKeys(DBAName);

        Random random = new Random();
        StringBuilder randomNumbers = new StringBuilder();

        for (int i = 0; i < 5; i++) {
            int randomNumber = random.nextInt(10); // Generates a random number between 0 and 9
            randomNumbers.append(randomNumber);
        }


        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(text(),'Business Number')]/parent::div//input")));
        element.sendKeys("Test" + randomNumbers);

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(text(),'Mailing Address')]/parent::div//input")));
        element.sendKeys("1409-755 Caledonia Ave");

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//mat-option")));
        element.click();

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(text(),'Primary Contact')]/parent::div//input")));
        element.sendKeys(bceidUSERNAME);

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//span[contains(text(),'Search for Contact')]")));
        element.click();

        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(text(),' Primary Contact found!')]")));

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//input[@type='radio']"));

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(text(),'Cell Phone')]/parent::div//input")));
        element.sendKeys("7780000000");


        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(text(),'Job Title')]/parent::div//input")));
        element.sendKeys("Test Title");
    }

    public static String generateDamageCause() {
        // Get current date and time
        Calendar calendar = Calendar.getInstance();
        Date now = calendar.getTime();

        // Format date and time
        DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
        String formattedDate = dateFormat.format(now);

        // Predefined list of words
        String[] words = {
                "fire", "flood", "earthquake", "hurricane", "tornado", "hailstorm", "landslide", "volcano",
                "tsunami", "drought", "blizzard", "avalanche", "cyclone", "erosion", "sinkhole", "lightning",
                "wildfire", "storm", "wind", "ice", "snow", "heatwave", "coldwave", "mudslide", "thunderstorm"
        };

        // Symbols to use between words
        String symbols = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~\\";
        Random r = new Random();
        StringBuilder randomWordsBuilder = new StringBuilder();

        // Combine "Test_", formatted date, and random words with symbols
        String prefix = "Test " + formattedDate + " ";
        randomWordsBuilder.append(prefix);

        int maxLength = 100;
        int currentLength = randomWordsBuilder.length();

        // Convert array to list and shuffle
        List<String> wordList = Arrays.asList(words);
        Collections.shuffle(wordList, r);

        for (String word : wordList) {
            String wordWithSymbols = word + " " + symbols.charAt(r.nextInt(symbols.length())) + " ";
            if (currentLength + wordWithSymbols.length() > maxLength) {
                break;
            }
            randomWordsBuilder.append(wordWithSymbols);
            currentLength += wordWithSymbols.length();
        }

        return randomWordsBuilder.length() > maxLength ? randomWordsBuilder.substring(0, maxLength).trim() : randomWordsBuilder.toString().trim();
    }

    private void fillFormFields(WebDriverWait driverWait, Map<String, String> formFields) {
        for (Map.Entry<String, String> entry : formFields.entrySet()) {
            WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='" + entry.getKey() + "']")));
            element.sendKeys(entry.getValue());
        }
    }

    public static void clickSubmitButton(WebDriver driver, WebDriverWait driverWait) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit ')]")));
        ElementClickHelper.clickElement(driver, element);
    }

    public static void nextReviewSubmission(WebDriver driver, WebDriverWait driverWait) {

        try {
            WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Next - Contact Information')]")));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);

            // Ensure the element is visible and enabled before clicking
            element = driverWait.until(ExpectedConditions.visibilityOf(element));
            element = driverWait.until(ExpectedConditions.elementToBeClickable(element));

            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

            // Adding a small delay to ensure the element is interactable
            Thread.sleep(500);
        } catch (ElementNotInteractableException e) {
            System.out.println("Element not interactable: " + e.getMessage());
            throw e;
        } catch (InterruptedException e) {
            System.out.println("Thread was interrupted: " + e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}
