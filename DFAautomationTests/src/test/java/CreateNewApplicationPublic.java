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
    public static void afterClass() {
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

        //Choose date calendar
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"cdk-step-content-0-0\"]/app-component-wrapper/app-application-details/mat-card/mat-card-content/form/div[2]/div[1]/mat-form-field/div[1]/div/div[3]/mat-datepicker-toggle/button/span[3]")));
//        ElementClickHelper.clickElement(driver, element);
//        Thread.sleep(1000);
//        clickElementWithRetry(driverWait, driver, By.xpath("//*[contains(text(), ' 10 ')]"));
//        Thread.sleep(1000);
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"cdk-step-content-0-0\"]/app-component-wrapper/app-application-details/mat-card/mat-card-content/form/div[2]/div[2]/mat-form-field/div[1]/div/div[3]/mat-datepicker-toggle/button/span[3]")));
//        ElementClickHelper.clickElement(driver, element);
//        Thread.sleep(1000);
//        clickElementWithRetry(driverWait, driver, By.xpath("//*[contains(text(), ' 11 ')]"));

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

        // Check 90% displayed
     /*    WebElement elementVal = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='estimatedPercent']")));
        String value = elementVal.getAttribute("value");
        if ("90".equals(value)) {
            System.out.println("The text box contains 90");
        } else {
            System.out.println("The text box does not contain 90");
        }

        // If there was opportunity to receive guidance and support in assessing your damaged infrastructure, would you like to receive this support?*
       element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='radio'][value='true']")));
        ElementClickHelper.clickElement(driver, element);

        // Other Contact
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Other Contact ')]")));
        ElementClickHelper.clickElement(driver, element);

        // New Other Contact
        Map<String, String> formFields = new HashMap<>();
        formFields.put("firstName", "TestFirstName");
        formFields.put("lastName", "TestLastName");
        formFields.put("phoneNumber", "999-999-9999");
        formFields.put("email", "test@test.com");

        fillFormFields(driverWait, formFields);

        // Save Other Contact
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Save ')]")));
        ElementClickHelper.clickElement(driver, element); */

        // Click on Next
        Thread.sleep(1000);
        nextReviewSubmission(driver, driverWait);

        // Check Review page
//        String[] valuesToCheck = {" " + getRandomChars() + " ", yesterdayAsString, todayAsString, "Municipality", "TestFirstName  ", " TestLastName ", " 999-999-9999 "};
//        for (String insertValues : valuesToCheck) {
//            if (PageContentChecker.isValuePresentInBody(driver, insertValues)) {
//                System.out.println("The body contains: " + insertValues);
//            } else {
//                System.out.println("The body does not contain: " + insertValues);
//            }
//        }


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

        // Check Dashboard
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("spnCauseOfDamage")));
//        if (element.getText().contains(getRandomChars())) {
//            System.out.println("The body contains: " + getRandomChars());
//        } else {
//            System.out.println("The body does not contain: " + getRandomChars());
//            fail("The body does not contain the expected randomChars value.");
//        }
//    }

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

    public void nextReviewSubmission(WebDriver driver, WebDriverWait driverWait) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Contact Information ')]")));
        ElementClickHelper.clickElement(driver, element);
    }
}
