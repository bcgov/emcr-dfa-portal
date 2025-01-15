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

public class VerifyMulipleProjectSubmission {
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

//    @After
//    public void tearDown() {
//        driver.close();
//        driver.quit();
//    }


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

        VerifyMultipleClaimSubmission verifyMultipleClaimSubmission = new VerifyMultipleClaimSubmission();
        verifyMultipleClaimSubmission.test();

        // Login portal
        SubmitClaimsPublic.loginToPortal();
        // Check Case number
        String caseNumberDisplayPortal = SubmitApplicationsRAFT.getCaseNumber();
        boolean isCaseNumberPresent = driver.getPageSource().contains(caseNumberDisplayPortal);
        System.out.println("Case Number found in page body: " + isCaseNumberPresent);


        // Submit project
        String xpathSubmitProjectByCaseNumber = "//span[contains(text(),'" + SubmitApplicationsRAFT.getCaseNumber() + "')]/../../div//button[contains(text(), 'Submit Projects')]";
        driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath(xpathSubmitProjectByCaseNumber)));
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath(xpathSubmitProjectByCaseNumber));

        //Create project
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Create a New Project')]")));
        element.click();
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to proceed. ')]")));
        element.click();

        // Create random number
        Thread.sleep(1000);
        String randomProjectNumber = "AT_" + RandomStringGenerator.generateRandomAlphanumeric(7);
        System.out.println("Project Number is: " + randomProjectNumber);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("projectNumber")));
        setRandomProjectNumber(randomProjectNumber);

        // Scroll into view if necessary
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        Thread.sleep(1000);
        // Ensure the element is clickable
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        element.sendKeys(randomProjectNumber);

        // Create random project name
        String randomProjectName = "AT_Project_" + RandomStringGenerator.generateRandomAlphanumeric(9);
        System.out.println("Project Name is: " + randomProjectName);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-input-1")));

        // Scroll into view if necessary
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);

        // Ensure the element is clickable
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        element.sendKeys(randomProjectName);

        //Are the dates of damage the same dates provided on the application?
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[type='radio'][value='false']")));
        element.click();

        //What is the date(s) of damage for this site?
        DateUtils dateUtils = new DateUtils();
        dateUtils.setYesterdayAsString(DateUtils.getFormattedDates().get("yesterday"));
        dateUtils.setTodayAsString(DateUtils.getFormattedDates().get("today"));
        dateUtils.setInOneYearAsString(DateUtils.getFormattedDates().get("inOneYear"));

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-input-11")));
        element.clear();
        element.sendKeys(dateUtils.getYesterdayAsString());

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-input-12")));
        element.clear();
        element.sendKeys(dateUtils.getTodayAsString());
        Thread.sleep(1000);

        // Fill form fields
        fillFormField(driverWait, "[formcontrolname='differentDamageDatesReason'][maxlength='500']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(500));
        fillFormField(driverWait, "[formcontrolname='siteLocation'][maxlength='100']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(100));
        fillFormField(driverWait, "[formcontrolname='infraDamageDetails'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(2000));
        fillFormField(driverWait, "[formcontrolname='causeofDamageDetails'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(2000));
        fillFormField(driverWait, "[formcontrolname='describeDamageDetails'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(2000));
        fillFormField(driverWait, "[formcontrolname='describeDamagedInfrastructure'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(2000));
        fillFormField(driverWait, "[formcontrolname='repairWorkDetails'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(2000));
        fillFormField(driverWait, "[formcontrolname='repairDamagedInfrastructure'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(2000));
        fillFormField(driverWait, "[formcontrolname='estimateCostIncludingTax'][maxlength='100']", RandomIntGenerator.generateRandomInt(7));
        fillFormField(driverWait, "[formcontrolname='estimatedCompletionDate'][aria-haspopup='dialog']", dateUtils.getInOneYearAsString());

        //Click Next
        Thread.sleep(1000);
        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight);");
        Thread.sleep(1000);
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' Next - Upload Documents ')]"));
        System.out.println("Next - Upload Documents clicked");

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Previous Event Condition ')]")));
        element.click();

        Thread.sleep(1000);

        // Upload docs
        Thread.sleep(1000);
        uploadFile(driverWait, "fileDrop", System.getProperty("user.dir") + '/' + "dummy.pdf");
        Thread.sleep(1000);

        clickElementWithRetry(driverWait, By.xpath("//mat-card//span[contains(text(),'Save')]"));

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Post Event Condition ')]")));

        JavascriptExecutor jse = (JavascriptExecutor) driver;
        jse.executeScript("arguments[0].click();", element);

        Thread.sleep(1000);
        uploadFile(driverWait, "fileDrop", System.getProperty("user.dir") + '/' + "testDFA.xlsx");

        Thread.sleep(1000);
        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight);");
        Thread.sleep(1000);

        clickElementWithRetry(driverWait, By.xpath("//mat-card//span[contains(text(),'Save')]"));

        //Click Next
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Review & Submit ')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

        System.out.println("Next - Review & Submit clicked");

        //Check Review page
        // Check if the random project number is present in the page body
        boolean isProjectNumberPresent = driver.getPageSource().contains(randomProjectNumber);
        System.out.println("Project Number found in page body: " + isProjectNumberPresent);
        boolean isProjectNamePresent = driver.getPageSource().contains(randomProjectName);
        System.out.println("Project Number found in page body: " + isProjectNamePresent);

        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-project-main/div/mat-horizontal-stepper/div/div[2]/div[3]/div/div[2]/button/span[2]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
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

        Thread.sleep(5000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("(//span[contains(text(),'Submit')])[last()]")));
        jse.executeScript("arguments[0].click();", element);

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//span[contains(text(), 'Yes, I want to submit the project.')]")));
        jse.executeScript("arguments[0].click();", element);
        System.out.println("Yes, I want to submit the project.");

        driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), 'Open Projects')]")));



        //Login RAFT
        SubmitClaimsPublic.getUrls();

        //Navigate to Submitted projects
        SubmitClaimsPublic.navigateToSubmittedProjects(driver, driverWait, js, actions, getRandomProjectNumber());

        //Login Portal
        SubmitClaimsPublic.loginToPortal();
        SubmitApplicationsRAFT.setCaseNumber(caseNumberDisplayPortal);
        SubmitClaimsPublic.submitProjectAndAddInvoice(driver, driverWait, js, actions);

        ///

        sleep(2000);
        clickElementWithRetry(driverWait, By.xpath("//span[contains(text(), '+ Add Invoice')]"));

        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Vendor Name')]")));

        // Add invoice details
     //   DateUtils dateUtils = new DateUtils();
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
        int attempts2 = 0;
        while (attempts2 < 3) {
            try {
                element.sendKeys(Keys.ENTER);
                System.out.println("Submit button is clicked");
                break;
            } catch (org.openqa.selenium.ElementNotInteractableException e) {
                Thread.sleep(500); // Adjust the sleep time as necessary
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
            }
            attempts2++;
        }
        if (attempts2 == 3) {
            System.out.println("Failed to click the Submit button after " + attempts2 + " attempts");
        }

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to submit the claim. ')]")));
        element.click();

        sleep(2000);
        VerifySubmitedClaimInRAFT verifySubmitedClaimInRAFT = new VerifySubmitedClaimInRAFT();
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
        Thread.sleep(2000);
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        WebElement generalTab = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("li[aria-label='General']")));
        generalTab.click();
        Thread.sleep(3000);


/// ////


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

    public static void uploadFile(WebDriverWait driverWait, String elementId, String filePath) throws InterruptedException {
        WebElement fileInput = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id(elementId)));
        fileInput.sendKeys(filePath);
        Thread.sleep(1000);
    }

}