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

        //Click Save
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        Thread.sleep(1000);

        scrollToBottom(driver);
        Thread.sleep(1000);

        //Deny comments
        String commentsDeny= RandomStringGenerator.generateRandomAlphanumeric(2000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Select to enter data'][maxlength='2000']")));
        element.click();
        element.sendKeys(commentsDeny);

        // Click Save
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        Thread.sleep(1000);
        // Locate the body element
        WebElement bodyElement = driver.findElement(By.tagName("body"));
        actions.moveToElement(bodyElement).click().perform();
        Thread.sleep(1000);

        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Approved amount. Last saved value: $0.00'][title='$0.00']")));

        // Click back
        clickGoBackButton(driver, driverWait);

        //Check Decision and EMCR approved amount
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Denied')]")));
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='gridcell'][title='$0.00']")));

        //Click Approval Pending
        VerifySubmitedClaimInRAFT.clickApprovalPending(driver, driverWait);

        // Click Next
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 7, 1000);

        // Decision Approve on Decision Made Popup
        VerifySubmitedClaimInRAFT.approveDecision(driver, driverWait);

        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
        element.click();

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Login portal
        SubmitClaimsPublic.loginToPortal();

        // Click Submit project
        VerifySubmitedClaimInRAFT.submitProjectAndCheckClaim(driver, driverWait, ClaimNumber);

    }
    public void clickGoBackButton(WebDriver driver, WebDriverWait driverWait) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Go back'][aria-label='Press Enter to go back.']")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    public void scrollToBottom(WebDriver driver) {
        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight);");
    }
}
