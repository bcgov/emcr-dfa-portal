import dfa.Config;
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

import static dfa.CommonUtils.environmentUrls;
import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.sleep;
import static org.junit.Assert.assertTrue;

public class SubmitClaimsPublic {

    private static WebDriver driver;

    @Getter
    @Setter
    private static String vendorName;

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

        CreateNewProjectPublic createNewProjectPublic = new CreateNewProjectPublic();
        createNewProjectPublic.test();

        //Login RAFT
        getUrls();

        //Navigate to Submitted projects
        navigateToSubmittedProjects(driver, driverWait, js, actions, null);

        //Login Portal
        loginToPortal();

        //Submit project and add invoice
        submitProjectAndAddInvoice(driver, driverWait, js, actions);

        // Click add invoices
//        clickElementWithRetry(driverWait, By.xpath("//span[contains(text(), 'Add Invoice')]"));
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

    }

    public static void getUrls() throws Exception {
        WebDriver driver = CustomWebDriverManager.getDriver();
        String url = environmentUrls.get(Config.ENVIRONMENT_Dynamics);

        if (url != null) {
            driver.get(url);
            driver.navigate().to(url);
        } else {
            throw new IllegalArgumentException("Unknown environment: " + Config.ENVIRONMENT_Dynamics);
        }
    }

    public static void loginToPortal() throws Exception {
        WebDriver driver = CustomWebDriverManager.getDriver();
        String url = environmentUrls.get(Config.ENVIRONMENT);

        if (url != null) {
            driver.get(url);
            driver.navigate().to(url);
            driver.navigate().refresh();
        } else {
            throw new IllegalArgumentException("Unknown environment: " + Config.ENVIRONMENT);
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

    public static void navigateToSubmittedProjects(WebDriver driver, WebDriverWait driverWait, JavascriptExecutor js, Actions actions, String projectNumber) throws InterruptedException {
        // Ensure the driver is set
        if (SubmitClaimsPublic.driver == null) {
            SubmitClaimsPublic.driver = driver;
        }

        WebElement element;

        // Go to Submitted projects
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Projects')]")));
        element.click();
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-haspopup='true'][title='Select a view']")));
        System.out.println("Element found: " + element.isDisplayed()); // Log element visibility
        element = driverWait.until(ExpectedConditions.visibilityOf(element));
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));

        if (element.isDisplayed() && element.isEnabled()) {
            js.executeScript("arguments[0].scrollIntoView(true);", element);
            try {
                js.executeScript("arguments[0].click();", element);
            } catch (Exception e) {
                actions.moveToElement(element).click().perform();
            }
        } else {
            System.out.println("Element is not interactable: " + element);
        }
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Submitted Projects')]")));
        element.click();
        // Submitted dates descending
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[tabindex='-1'][title='Date Received (Case)']")));
        element.click();

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Sort Newest to Oldest')]"));
        // Click on case title
        Thread.sleep(1000);
        String caseTitleWithTimestamp = SubmitApplicationsRAFT.getCaseTitleWithTimestamp();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='" + caseTitleWithTimestamp + "'][tabindex='-1']")));
        element.click();
        // Click OK
        Thread.sleep(2000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.id("okButton"));
        // Click Recovery plan
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Recovery Plans'][title='Recovery Plans']")));
        element.click();
        // Double-click on Project number
        Thread.sleep(2000);

        // Determine the vendor name to use
        String resolvedProjectNumber = (projectNumber != null && !projectNumber.trim().isEmpty()) ? projectNumber : CreateNewProjectPublic.getRandomProjectNumber();

        System.out.println("Project number: " + resolvedProjectNumber);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='" + resolvedProjectNumber + "'][role='gridcell']")));
        actions.doubleClick(element).perform();
        Thread.sleep(5000);
        clickElementWithRetry(driverWait, By.cssSelector("[role='presentation'][title='Draft']"));
        // Click Set Active
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Set Active')]"), 1, 1000);
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='checkbox'][title='Pending']")));
        element.click();
        Thread.sleep(2000);
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 3, 2000);
        Thread.sleep(1000);
        SubmitApplicationsRAFT.clickSaveButton(driverWait);
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='tab'][title='Project Costing & Claims']")));
        element.click();
        // Add final cost and save
        System.out.println(RandomIntGenerator.generateRandomInt(7));
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[type='text'][title='$0.00']")));
        element.click();
        element.sendKeys(RandomIntGenerator.generateRandomInt(7));
        Thread.sleep(1000);
        SubmitApplicationsRAFT.clickSaveButton(driverWait);
        Thread.sleep(1000);

        SubmitApplicationsRAFT.clickSaveButton(driverWait);
        Thread.sleep(3000);


        // fix it

        clickElementWithRetry(driverWait, By.cssSelector("[role='presentation'][title='Adjudicator ']"));
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 5, 2000);

        sleep(2000);
        clickElementWithRetry(driverWait, By.cssSelector("[role='presentation'][title='Decision Made']"));
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Set Active')]"), 1, 1000);

        // Select Project Decision - Approved
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//select[@data-id='header_process_dfa_projectdecision.fieldControl-option-set-select']")));
        element.click();
         element.sendKeys(Keys.DOWN, Keys.RETURN);
        sleep(2000);

        SubmitApplicationsRAFT.clickSaveButton(driverWait);
        Thread.sleep(1000);
    }

    public static void submitProjectAndAddInvoice(WebDriver driver, WebDriverWait driverWait, JavascriptExecutor js, Actions actions) throws InterruptedException {
        WebElement element;

        // Click Submit project
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Projects ')]")));
        element.click();
        sleep(5000);

        // Check case number
        String caseNumberDisplayPortal = SubmitApplicationsRAFT.getCaseNumber();
        boolean isCaseNumberPresent = driver.getPageSource().contains(caseNumberDisplayPortal);
        System.out.println("Case Number found in page body: " + isCaseNumberPresent);
        assertTrue("Case Number not found in page body", isCaseNumberPresent);

//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Projects ')]")));
//        element.click();

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Claims ')]")));
        element.click();
        sleep(1000);
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

    }
}

