import dfa.CustomWebDriverManager;
import dfa.ElementClickHelper;
import dfa.PageContentChecker;
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
import static org.junit.Assert.fail;

public class CreateNewApplicationPublic {
    private WebDriver driver;
    private String randomChars;
        @After
    public void tearDown() {
        driver.close();
        driver.quit();
    }

    @AfterClass
    public static void afterClass()

    {
        CustomWebDriverManager.instance = null;
    }

    public String getRandomChars() {
        return randomChars;
    }

    public void setRandomChars(String randomChars) {
        this.randomChars = randomChars;
    }

    @Test
    public void test() throws Exception {
        driver = getDriver();
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        WebElement element;
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

        //Choose and event
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='eventId']")));
        element.click();

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-option-8")));
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

        Random r = new Random();
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomCharsBuilder = new StringBuilder();

        for (int i = 0; i < 100; i++) {
            randomCharsBuilder.append(alphabet.charAt(r.nextInt(alphabet.length())));
        }

        setRandomChars(randomCharsBuilder.toString());

        // Cause of damage
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='otherDamageText']")));
        element.clear();
        element.sendKeys(getRandomChars());

        // Application Type
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='applicantSubtype']")));
        ElementClickHelper.clickElement(driver, element);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Municipality')]")));
        element.click();

        // Click on Next
        Thread.sleep(1000);
        nextReviewSubmission(driver, driverWait);


        // Submit
        Thread.sleep(1000);
        clickSubmitButton(driver, driverWait);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/div/div[2]/button/span[4]")));

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
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Your application has been submitted. ')]")));
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Back To Dashboard ')]")));
        element.click();

        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Cause(s) of Damage - ')]")));
        WebElement bodyElement = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
        String bodyText = bodyElement.getText();
        if (bodyText.contains(getRandomChars())) {
            System.out.println("The body contains: " + getRandomChars());
        } else {
            System.out.println("The body does not contain: " + getRandomChars());
        }
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
