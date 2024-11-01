import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.sleep;

public class PartialPaymentApproveClaim {

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

        SubmitClaimsPublic submitClaimsPublic = new SubmitClaimsPublic();
        submitClaimsPublic.test();

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

        // Call the processClaimDetails method and capture the ClaimNumber
//        String ClaimNumber = VerifySubmitedClaimInRAFT.processClaimDetails(driver, driverWait);

        //Approve Partial Payment
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Approved Partial')]")));
        element.click();
        // Locate the body element
        WebElement bodyElement = driver.findElement(By.tagName("body"));
        // Click on the body element
        bodyElement.click();
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[contains(@aria-label,'Total being claimed. Last saved value')]")));
        String amountClaimed = element.getAttribute("value"); // "$171,136.00"

        // Remove the dollar sign and commas
        String numericValue = amountClaimed.replace("$", "").replace(",", "");

        // Parse the string to a double
        double amount = Double.parseDouble(numericValue);

        // Divide the amount by 2
        double partialAmount = amount / 2;
        String partialAmountStr = String.valueOf(partialAmount);

        System.out.println("Partial Amount: " + partialAmount);

        //add value
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[contains(@aria-label,'Approved amount')]")));
        element.click();
        element.sendKeys(partialAmountStr);

        sleep(2000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//textarea[contains(@aria-label,'Decision comments')]")));
        element.sendKeys(partialAmountStr + " is a half of total claimed amount for testing");

        //save
        SubmitApplicationsRAFT.clickSaveButton(driverWait);

        // Click back
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Go back'][aria-label='Press Enter to go back.']")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

        // Click Approval pending
        VerifySubmitedClaimInRAFT.clickApprovalPending(driver, driverWait);

        // Click Next
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 7, 2000);
        Thread.sleep(1000);

        //SubmitClaimsPublic.clickElementWithRetry(driverWait, By.cssSelector("[role='presentation'][title='Decision Made']"));
        //SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Set Active')]"), 1, 1000);


        // Decision Approve on Decision Made Popup
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-id='header_process_dfa_decision.fieldControl-option-set-select'][aria-label='Decision']")));
        element.click();
        sleep(1000);
        element.sendKeys(Keys.DOWN, Keys.RETURN);


        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Approved')]")));
        element.click();
        Thread.sleep(2000);

        // Click Save
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

      //  Thread.sleep(1000);
       // SubmitClaimsPublic.clickElementWithRetry(driverWait, By.cssSelector("[title='Decision Made'][role='presentation']"));

        Thread.sleep(1000);
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Login portal
        SubmitClaimsPublic.loginToPortal();

        //Click on Login page
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Log in with Business BCeID ')]")));
        element.click();

        // Click Submit project
        VerifySubmitedClaimInRAFT.submitProjectAndCheckClaim(driver, driverWait, ClaimNumber);
    }
}
