import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.sleep;

public class DenyClaimAmountPublic {


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
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Actions actions = new Actions(driver);

        SubmitClaimsPublic submitClaimsPublic = new SubmitClaimsPublic();
        submitClaimsPublic.test();

        // Call the processClaimDetails method and capture the ClaimNumber
        String ClaimNumber = VerifySubmitedClaimInRAFT.processClaimDetails(driver, driverWait);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Denied')]")));
        element.click();

        //Deny comments
        String commentsDeny= RandomStringGenerator.generateRandomAlphanumeric(2000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Decision comments'][maxlength='2000']")));
        element.click();
        element.sendKeys(commentsDeny);

        // Click Save
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Locate the body element
        WebElement bodyElement = driver.findElement(By.tagName("body"));
        actions.moveToElement(bodyElement).click().perform();

        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Approved amount. Last saved value: $0.00'][title='$0.00']")));

        // Click back
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Go back'][aria-label='Press Enter to go back.']")));
        element.click();

        //Check Decision and EMCR approved amount
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Denied')]")));
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='gridcell'][title='$0.00']")));

        //Click Approval Pending
        VerifySubmitedClaimInRAFT.clickApprovalPending(driver, driverWait);

        // Click Next
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 6, 1000);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Login portal
        SubmitClaimsPublic.loginToPortal();

        // Click Submit project
        VerifySubmitedClaimInRAFT.submitProjectAndCheckClaim(driver, driverWait, ClaimNumber);

    }
}
