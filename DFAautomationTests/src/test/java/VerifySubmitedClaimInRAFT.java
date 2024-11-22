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
        Thread.sleep(1000);
        // Locate the body element
        WebElement bodyElement = driver.findElement(By.tagName("body"));
        actions.moveToElement(bodyElement).click().perform();

        // Click back
        try {
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Go back'][aria-label='Press Enter to go back.']")));
            element.click();
        } catch (ElementClickInterceptedException e) {
            js.executeScript("arguments[0].click();", element);
        }

        // Click Approval pending
        Thread.sleep(1000);
        clickApprovalPending(driver, driverWait);
        Thread.sleep(1000);
        // Click Next
       SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 7, 1000);

        // Decision Approve on Decision Made Popup
        approveDecision(driver, driverWait);

        // Click Save
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Decision Made'][role='presentation']")));
        element.click();
        Thread.sleep(1000);
        clickApprovalDecisionMade(driver, driverWait);
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Login portal
        SubmitClaimsPublic.loginToPortal();

        // Check Case number
        String caseNumberDisplayPortal = SubmitApplicationsRAFT.getCaseNumber();
        boolean isCaseNumberPresent = driver.getPageSource().contains(caseNumberDisplayPortal);
        System.out.println("Case Number found in page body: " + isCaseNumberPresent);

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
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[type='text'][placeholder='Search this view']")));
        element.sendKeys(ClaimNumber);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("quickFind_button_icon_1")));
        element.click();
        int attempts = 0;
        while (attempts < 3) {
            try {
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + ClaimNumber + "')]")));
                element.click();
                break; // Exit the loop if successful
            } catch (StaleElementReferenceException e) {
                attempts++;
                Thread.sleep(1000); // Wait for 1 second before retrying
            }
        }

        // Click Draft
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='presentation'][title='Draft']")));
        element.click();
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Set Active')]"), 1, 1000);
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
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='presentation'][title='Submitted']")));
                element.click();
                Thread.sleep(1000);
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Submitted'][data-id='header_process_dfa_submittedbpf.fieldControl-option-set-select']")));
                element.click();
                Thread.sleep(1500);
                // Select Project Decision - Approved
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//select[@data-id='header_process_dfa_submittedbpf.fieldControl-option-set-select']")));
                element.click();
                sleep(1000);
                element.sendKeys(Keys.DOWN, Keys.RETURN);
                break; // Exit the loop if successful
            } catch (StaleElementReferenceException e) {
                attempts++;
                sleep(1000); // Wait for 1 second before retrying
            }
        }
    }
    public static void submitProjectAndCheckClaim(WebDriver driver, WebDriverWait driverWait, String ClaimNumber) throws InterruptedException {
        WebElement element;

        //Click on Login page
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Log in with Business BCeID ')]")));
//        element.click();
        Thread.sleep(1000);
        // Click Submit project
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Projects ')]")));
        element.click();
        Thread.sleep(1000);
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
    public static void clickApprovalDecisionMade(WebDriver driver, WebDriverWait driverWait) throws InterruptedException {
        WebElement element;
        int attempts = 0;
        while (attempts < 3) {
            try {
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Decision'][data-id='header_process_dfa_decision.fieldControl-option-set-select']")));
                element.click();
                Thread.sleep(1500);
                // Select Project Decision - Approved
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//select[@data-id='header_process_dfa_decision.fieldControl-option-set-select']")));
                element.click();
                sleep(1000);
                element.sendKeys(Keys.DOWN, Keys.RETURN);
                break; // Exit the loop if successful
            } catch (StaleElementReferenceException e) {
                attempts++;
                sleep(1000); // Wait for 1 second before retrying
            }
        }
    }

    public static void approveDecision(WebDriver driver, WebDriverWait driverWait) {
        WebElement element;

        // Decision Approve on Decision Made Popup
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-id='header_process_dfa_decision.fieldControl-option-set-select'][aria-label='Decision']")));
        element.click();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Approved')]")));
        element.click();
    }

}

