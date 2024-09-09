import dfa.CustomWebDriverManager;
import dfa.ElementClickHelper;
import dfa.PageContentChecker;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static dfa.CustomWebDriverManager.getDriver;
import static org.junit.Assert.fail;

public class CreateNewApplicationPublic {

    private WebDriver driver;


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
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        WebElement element;
        CustomWebDriverManager.getElements();


        LoginPublicPortal loginPublicPortal = new LoginPublicPortal();
        loginPublicPortal.test();

        //Create New application
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Create a New Application ')]")));
        element.click();

        //Select dates
        Calendar calendar = Calendar.getInstance();
        Date today = calendar.getTime();

        calendar.add(Calendar.DAY_OF_YEAR, -1);
        Date yesterday = calendar.getTime();

        DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");

        String todayAsString = dateFormat.format(today);
        String yesterdayAsString = dateFormat.format(yesterday);

        System.out.println(todayAsString);
        System.out.println(yesterdayAsString);

        //Select cause of damage
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
        StringBuilder randomChars = new StringBuilder();

        for (int i = 0; i < 100; i++) {
            randomChars.append(alphabet.charAt(r.nextInt(alphabet.length())));
        }

        // Cause of damage
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='otherDamageText']")));
        element.clear();
        element.sendKeys(randomChars.toString());

        //Date of damage
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='damageFromDate']")));
        element.clear();
        element.sendKeys(yesterdayAsString);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='damageToDate']")));
        element.clear();
        element.sendKeys(todayAsString);

        //Application Type
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='applicantSubtype']")));
        ElementClickHelper.clickElement(driver, element);

        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), 'Municipality')]")));
        element.click();

        //Check 90% displayed
        WebElement elementVal = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='estimatedPercent']")));
        String value = elementVal.getAttribute("value");
        if ("90".equals(value)) {
            System.out.println("The text box contains 90");
        } else {
            System.out.println("The text box does not contain 90");
        }

        //If there was opportunity to receive guidance and support in assessing your damaged infrastructure, would you like to receive this support?*
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='radio'][value='true']")));
        ElementClickHelper.clickElement(driver, element);

        //Other Contact
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Other Contact ')]")));
        ElementClickHelper.clickElement(driver, element);

        //New Other Contact
        Map<String, String> formFields = new HashMap<>();
        formFields.put("firstName", "TestFirstName");
        formFields.put("lastName", "TestLastName");
        formFields.put("phoneNumber", "999-999-9999");
        formFields.put("email", "test@test.com");

        fillFormFields(driverWait, formFields);

        //Save Other Contact
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Save ')]")));
        ElementClickHelper.clickElement(driver, element);

        //Click on Next
        nextReviewSubmission(driver, driverWait);

        //Check Review page
        String[] valuesToCheck = {" " + randomChars + " ", yesterdayAsString, todayAsString, "Municipality", "TestFirstName  ", " TestLastName ", " 999-999-9999 "};
        for (String insertValues : valuesToCheck) {
            if (PageContentChecker.isValuePresentInBody(driver, insertValues)) {
                System.out.println("The body contains: " + insertValues);
            } else {
                System.out.println("The body does not contain: " + insertValues);
            }
        }
        //Submit
        clickSubmitButton(driver, driverWait);
        //Submit Application Confirmation
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to submit my application. ')]")));
        element.click();

        //Check success message
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Your application has been submitted. ')]")));
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Back To Dashboard ')]")));
        element.click();

        //Check Dashboard
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("spnCauseOfDamage")));
        if (element.getText().contains(randomChars)) {
            System.out.println("The body contains: " + randomChars);
        } else {
            System.out.println("The body does not contain: " + randomChars);
            fail("The body does not contain the expected randomChars value.");
        }
    }

    private void fillFormFields(WebDriverWait driverWait, Map<String, String> formFields) {
        for (Map.Entry<String, String> entry : formFields.entrySet()) {
            WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[formcontrolname='" + entry.getKey() + "']")));
            element.sendKeys(entry.getValue());
        }

    }

    public void clickSubmitButton(WebDriver driver, WebDriverWait driverWait) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit ')]")));
        ElementClickHelper.clickElement(driver, element);
    }

    public void nextReviewSubmission(WebDriver driver, WebDriverWait driverWait) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Review Submission ')]")));
        ElementClickHelper.clickElement(driver, element);
    }
}
