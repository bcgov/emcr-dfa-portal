import dfa.CustomWebDriverManager;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

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
        try {
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Contact Information ')]")));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);

            // Ensure the element is visible and enabled before clicking
            element = driverWait.until(ExpectedConditions.visibilityOf(element));
            element = driverWait.until(ExpectedConditions.elementToBeClickable(element));

            // Adding a small delay to ensure the element is interactable
            Thread.sleep(500);

            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        } catch (ElementClickInterceptedException e) {
            System.out.println("Element click intercepted: " + e.getMessage());
            throw e;
        } catch (InterruptedException e) {
            System.out.println("Thread was interrupted: " + e.getMessage());
            Thread.currentThread().interrupt();
        }

        // Click on Next
        Thread.sleep(2000);
        element = driverWait.until(ExpectedConditions
                .elementToBeClickable(By.xpath("//*[contains(text(), ' Next - Review & Submit ')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);


        // Read errors in red
        String[] errorMessages = {
                "Enter required start date.",
                "Enter required end date.",
                "Enter required information",
                "At least one cause of damage is required.",
        };

        for (String errorMessage : errorMessages) {
            WebElement errorElement = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + errorMessage + "')]")));
            String color = errorElement.getCssValue("color");
            if (!"rgba(255, 0, 0, 1)".equals(color) && !"rgb(255, 0, 0)".equals(color) && !"rgba(244, 67, 54, 1)".equals(color)) {
                System.out.println("Error message '" + errorMessage + "' is not displayed in red font.");
                fail("Error message '" + errorMessage + "' is not displayed in red font.");
            }        }

//        // Check if error messages are displayed on App detail page
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='cdk-step-content-0-1']/div/div[1]/button/span[4]")));
//        ElementClickHelper.clickElement(driver, element);
//        //Click Back again
//        Thread.sleep(1000);
//        element = driverWait.until(ExpectedConditions
//                .elementToBeClickable(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[2]/div/div[1]/button[1]/span[4]")));
//        ElementClickHelper.clickElement(driver, element);

//        String[] errorMessagesAppDetail = {
//                "At least one cause of damage is required. ",
//                " From date is required",
//                " To date is required",
//                "No matching disaster events for this date.",
//                " Type of governing body is required"
//        };
//
//        for (String errorMessageAppDetail : errorMessagesAppDetail) {
//            WebElement errorElement = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + errorMessageAppDetail + "')]")));
//            if (errorElement != null) {
//                System.out.println("Error message '" + errorMessageAppDetail + "' is present on the page.");
//            } else {
//                System.out.println("Error message '" + errorMessageAppDetail + "' is not present on the page.");
//            }
//        }
    }
}

