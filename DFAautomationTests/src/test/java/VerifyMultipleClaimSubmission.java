import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import lombok.Getter;
import lombok.Setter;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.sleep;

public class VerifyMultipleClaimSubmission {
    private static WebDriver driver;
    @Getter
    @Setter
    private static String randomProjectNumber;

    @Getter
    @Setter
    private static String vendorName;

    @AfterClass
    public static void afterClass() {

        CustomWebDriverManager.instance = null;
    }

    @After
    public void tearDown() {
        driver.close();
        driver.quit();
    }


    public void submitClaim(WebDriver driver, WebDriverWait driverWait){

    }


    @Test
    public void test() throws Exception {
        driver = getDriver();
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        WebElement element;
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Actions actions = new Actions(driver);
        CustomWebDriverManager.getElements();

        VerifySubmitedClaimInRAFT verifySubmitedClaimInRAFT = new VerifySubmitedClaimInRAFT();
        verifySubmitedClaimInRAFT.test();

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Create a New Claim')]")));
        element.click();
        sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to proceed. ')]")));
        element.click();
        sleep(1000);

        // Check text
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Please review and complete the form below. You may start a claim, save it, and continue to add to it later. Required fields are marked with a red asterisk ')]")));

        // Click Next - add invoice
        sleep(2000);
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' Next - Add Invoices ')]"));
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), 'Add Invoices')]"));

        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'You must provide all the required information to save an invoice record')]")));






        sleep(2000);
        clickElementWithRetry(driverWait, By.xpath("//span[contains(text(), '+ Add Invoice')]"));

        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Vendor Name')]")));

        // Add invoice details
        DateUtils dateUtils = new DateUtils();
        dateUtils.setTodayAsString(DateUtils.getFormattedDates().get("today"));
        setVendorName(RandomStringGenerator.generateRandomAlphanumeric(100));
        // Use the getter method to retrieve and use the vendorName value
        fillFormField(driverWait, "[formcontrolname='vendorName'][maxlength='100']", getVendorName());
        System.out.println("Vendor name is: " + getVendorName());
        fillFormField(driverWait, "[formcontrolname='invoiceNumber'][maxlength='100']", RandomIntGenerator.generateRandomInt(100));
        fillFormField(driverWait, "[formcontrolname='invoiceDate'][aria-haspopup='dialog']", dateUtils.getTodayAsString());
        fillFormField(driverWait, "[formcontrolname='purposeOfGoodsServiceReceived'][maxlength='200']", RandomStringGenerator.generateRandomAlphanumeric(200));
        //fillFormField(driverWait, "[formcontrolname='netInvoiceBeingClaimed'][maxlength='100']", RandomIntGenerator.generateRandomInt(6));
        fillFormField(driverWait, "input#currencyBoxnetInvoiceBeingClaimed[maxlength='100']", RandomIntGenerator.generateRandomInt(6));
        // fillFormField(driverWait, "[formcontrolname='pst'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));
        // fillFormField(driverWait, "input[mask='separator.2'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));
        // fillFormField(driverWait, "[formcontrolname='grossGST'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));
        // fillFormField(driverWait, "input[mask='separator.2'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));

        // Check rdo buttons

        // Select Yes
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(text(),'same as the invoice date?')]/parent::*//input[@value='true']")));
        element.click();

        // Select No
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(text(),'Are you claiming only a portion')]/parent::*//input[@value='false']")));
        element.click();
        sleep(1000);

        // Click Add
        clickElementWithRetry(driverWait, By.xpath("//button[text()='Add']"));
        sleep(4000);
        //Click Nxt to upload docs
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//span[contains(text(), 'Next - Upload Documents')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' + Add Invoices ')]"));
        // Upload docs
        Thread.sleep(1000);
        CreateNewProjectPublic.uploadFile(driverWait, "fileDrop", System.getProperty("user.dir") + '/' + "dummy.pdf");
        Thread.sleep(1000);
        CreateNewProjectPublic.clickElementWithRetry(driverWait, By.cssSelector(".family-button.details-button.save-button.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base"));
        Thread.sleep(1000);
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add General Ledger ')]")));
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add General Ledger ')]")));
        element.click();
        Thread.sleep(1000);
        CreateNewProjectPublic.uploadFile(driverWait, "fileDrop", System.getProperty("user.dir") + '/' + "testDFA.xlsx");
        Thread.sleep(1000);
        CreateNewProjectPublic.clickElementWithRetryforDocSave(driverWait, By.cssSelector(".family-button.details-button.save-button.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base"));
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Proof of Payment ')]")));
        element.click();
        Thread.sleep(1000);
        CreateNewProjectPublic.uploadFile(driverWait, "fileDrop", System.getProperty("user.dir") + '/' + "testPPXDFA.pptx");
        Thread.sleep(1000);
        CreateNewProjectPublic.clickElementWithRetryforDocSave(driverWait, By.cssSelector(".family-button.details-button.save-button.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base"));
        Thread.sleep(1000);
        //Click Next - Review and Submit and Submit
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' Next - Review & Submit ')]"));
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-claim-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-review-claim/mat-card/div/mat-card-content[1]/div[1]/div[2]/span")));
        if (element != null) {
            System.out.println("Element found: " + element.isDisplayed()); // Log element visibility
            String claimNumber = element.getText();
            System.out.println("Claim number: " + claimNumber);
        } else {
            System.out.println("Element with id 'claimNumber' not found.");
        }

        js.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        Thread.sleep(1000);
        actions.moveToElement(driver.findElement(By.tagName("body")), 0, 0).clickAndHold().perform();
        Thread.sleep(3000);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-claim-main/div/mat-horizontal-stepper/div/div[2]/div[4]/div/div[2]/button/span[2]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        element = driverWait.until(ExpectedConditions.visibilityOf(element));
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        int attempts = 0;
        while (attempts < 3) {
            try {
                element.sendKeys(Keys.ENTER);
                System.out.println("Submit button is clicked");
                break;
            } catch (org.openqa.selenium.ElementNotInteractableException e) {
                Thread.sleep(500); // Adjust the sleep time as necessary
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
            }
            attempts++;
        }
        if (attempts == 3) {
            System.out.println("Failed to click the Submit button after " + attempts + " attempts");
        }

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to submit the claim. ')]")));
        element.click();

        sleep(2000);

        verifySubmitedClaimInRAFT.processClaimDetails(driver,driverWait,getVendorName());



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
        verifySubmitedClaimInRAFT.clickApprovalPending(driver, driverWait);
        Thread.sleep(1000);
        // Click Next
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 7, 1000);

        // Decision Approve on Decision Made Popup
        verifySubmitedClaimInRAFT.approveDecision(driver, driverWait);

        // Click Save
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Decision Made'][role='presentation']")));
        element.click();
        Thread.sleep(2000);
        verifySubmitedClaimInRAFT.clickApprovalDecisionMade(driver, driverWait);
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        WebElement generalTab = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("li[aria-label='General']")));
        generalTab.click();
        Thread.sleep(3000);

     
        //end of multiple claim

        // Check Case number
        String caseNumberDisplayPortal = SubmitApplicationsRAFT.getCaseNumber();
        boolean isCaseNumberPresent = driver.getPageSource().contains(caseNumberDisplayPortal);
        System.out.println("Case Number found in page body: " + isCaseNumberPresent);



    }

    public static void uploadFile(WebDriverWait driverWait, String elementId, String filePath) throws InterruptedException {
        WebElement fileInput = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id(elementId)));
        fileInput.sendKeys(filePath);
        Thread.sleep(1000);
    }

    public static void clickElementWithRetry(WebDriverWait driverWait, By locator) throws InterruptedException {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        element = driverWait.until(ExpectedConditions.visibilityOf(element));
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        int attempts = 0;
        while (attempts < 3) {
            try {
                element.click();
                break;
            } catch (org.openqa.selenium.ElementNotInteractableException e) {
                Thread.sleep(500); // Adjust the sleep time as necessary
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
            }
            attempts++;
        }
    }

    static void fillFormField(WebDriverWait driverWait, String cssSelector, String value) throws InterruptedException {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(cssSelector)));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        int attempts = 0;
        while (attempts < 3) {
            try {
                element.clear();
                element.sendKeys(value);
                break;
            } catch (org.openqa.selenium.ElementNotInteractableException e) {
                Thread.sleep(500); // Adjust the sleep time as necessary
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
            }
            attempts++;
        }
    }


}
