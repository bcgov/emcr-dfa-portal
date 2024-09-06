import dfa.CustomWebDriverManager;
import dfa.ElementClickHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

import static dfa.CustomWebDriverManager.getDriver;
import static org.junit.Assert.fail;

public class CreateNewApplicationPublicNeg {

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

        // Create New application
        element = driverWait.until(ExpectedConditions
                .elementToBeClickable(By.xpath("//*[contains(text(), ' Create a New Application ')]")));
        element.click();

        // Click on the submit button
        CreateNewApplicationPublic createNewApplicationPublic = new CreateNewApplicationPublic();
        createNewApplicationPublic.nextReviewSubmission(driver, driverWait);

        // Read errors in red
        String[] errorMessages = {
                "Enter required start date.  Enter required end date.",
                "Enter required information",
                "At least one other contact is required."
        };

        for (String errorMessage : errorMessages) {
            WebElement errorElement = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + errorMessage + "')]")));
            String color = errorElement.getCssValue("color");
            if (!"rgba(255, 0, 0, 1)".equals(color) && !"rgb(255, 0, 0)".equals(color)) {
                System.out.println("Error message '" + errorMessage + "' is not displayed in red font.");
                fail("Error message '" + errorMessage + "' is not displayed in red font.");
            }
        }

        // Check if error messages are displayed on App detail page
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='cdk-step-content-0-1']/div/div[1]/button/span[4]")));
        ElementClickHelper.clickElement(driver, element);

        String[] errorMessagesAppDetail = {
                "At least one cause of damage is required. ",
                " From date is required",
                " To date is required",
                " Applicant type is required"
        };

        for (String errorMessageAppDetail : errorMessagesAppDetail) {
            WebElement errorElement = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + errorMessageAppDetail + "')]")));
            if (errorElement != null) {
                System.out.println("Error message '" + errorMessageAppDetail + "' is present on the page.");
            } else {
                System.out.println("Error message '" + errorMessageAppDetail + "' is not present on the page.");
            }
        }
    }
}

