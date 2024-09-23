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
import static org.junit.Assert.fail;

public class VerifySubmitedClaimInRAFT {


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
        String ClaimNumber = processClaimDetails(driver, driverWait);

        // Approve decision Total
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-id='dfa_emcrdecision.fieldControl-option-set-select'][aria-label='Decision']")));
        element.click();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Approved Total')]")));
        element.click();

        // Click Save
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Locate the body element
        WebElement bodyElement = driver.findElement(By.tagName("body"));
        actions.moveToElement(bodyElement).click().perform();

        // Click back
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Go back'][aria-label='Press Enter to go back.']")));
        element.click();

        // Click Approval pending
        clickApprovalPending(driver, driverWait);

        // Click Next
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 5, 1000);

        // Decision Approve on Decision Made Popup
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-id='header_process_dfa_decision.fieldControl-option-set-select'][aria-label='Decision']")));
        element.click();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Approved')]")));
        element.click();
        // Click Save
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Decision Made'][role='presentation']")));
        element.click();

        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Login portal
        SubmitClaimsPublic.loginToPortal();

        // Check Case number

        // Click Submit project
        submitProjectAndCheckClaim(driver, driverWait, ClaimNumber);
    }

    public static String processClaimDetails(WebDriver driver, WebDriverWait driverWait) throws Exception {
        WebElement element;

        // Locate the element using the provided XPath
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-claim-dashboard/div/div[3]/mat-tab-nav-panel/app-dfadashboard-claim/div/div[2]/mat-card/div[1]/div[1]/span[2]")));

        // Retrieve the text content of the located element
        String ClaimNumber = element.getText();

        // Print the text content
        System.out.println("Claim Number is: " + ClaimNumber);

        // Login RAFT
        SubmitClaimsPublic.getUrls();

        // Search for Claim no and switch to Submitted claims
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Recovery Claims')]"));
        sleep(1000);

        // Search for Claim no
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Select to enter data'][placeholder='Search this view']")));
        element.sendKeys(ClaimNumber);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("quickFind_button_icon_1")));
        element.click();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + ClaimNumber + "')]")));
        element.click();

        // Click Draft
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='presentation'][title='Draft']")));
        element.click();

        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 3, 1000);

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Go to Invoices
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='tab'][title='Invoices']")));
        element.click();

        // Click on the vendor name
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[tabindex='-1'][title='" + SubmitClaimsPublic.getVendorName() + "']")));
        element.click();

        // Approve decision Total
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-id='dfa_emcrdecision.fieldControl-option-set-select'][aria-label='Decision']")));
        element.click();

        return ClaimNumber;
    }

    public static void clickApprovalPending(WebDriver driver, WebDriverWait driverWait) throws InterruptedException {
        WebElement element;
        int attempts = 0;
        while (attempts < 3) {
            try {
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='presentation'][title='Approval Pending']")));
                element.click();
                break; // Exit the loop if successful
            } catch (StaleElementReferenceException e) {
                attempts++;
                sleep(1000); // Wait for 1 second before retrying
            }
        }
    }
    public static void submitProjectAndCheckClaim(WebDriver driver, WebDriverWait driverWait, String ClaimNumber) throws InterruptedException {
        WebElement element;

        // Click Submit project
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Projects ')]")));
        element.click();

        // Click Submit Claims
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Claims ')]")));
        element.click();
        Thread.sleep(1000);

        // Retrieve the text content of the body element
        String bodyText = driver.findElement(By.tagName("body")).getText();

        // Check if the ClaimNumber exists in the body text
        if (bodyText.contains(ClaimNumber)) {
            System.out.println("Claim Number " + ClaimNumber + " exists in the body of the page.");
        } else {
            System.out.println("Claim Number " + ClaimNumber + " does not exist in the body of the page.");
            fail("Claim Number " + ClaimNumber + " does not exist in the body of the page.");
        }
    }

}

