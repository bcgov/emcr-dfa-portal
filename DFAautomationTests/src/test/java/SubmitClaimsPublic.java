import dfa.CommonUtils;
import dfa.Config;
import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static dfa.CommonUtils.environmentUrls;
import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.sleep;

public class SubmitClaimsPublic {

    private static WebDriver driver;
    private static String vendorName;

    public static String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }


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

        //Go to Submitted projects
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), 'Projects')]")));
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
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), 'Submitted Projects')]")));
        element.click();
        // Submitted dates descending
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[tabindex='-1'][title='Date Received (Case)']")));
        element.click();

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Sort Newest to Oldest')]"));
        //Click on case title
        String caseTitleWithTimestamp = SubmitApplicationsRAFT.getCaseTitleWithTimestamp();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='" + caseTitleWithTimestamp + "'][tabindex='-1']")));
        element.click();
        //Click OK
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.id("okButtonText"));
        //Click Recovery plan
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Recovery Plans'][title='Recovery Plans']")));
        element.click();
        //Double-click on Project number
        System.out.println("Project number: " + CreateNewProjectPublic.getRandomProjectNumber());
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='" + CreateNewProjectPublic.getRandomProjectNumber() + "'][role='gridcell']")));
        actions.doubleClick(element).perform();
        Thread.sleep(1000);
        clickElementWithRetry(driverWait, By.cssSelector("[role='presentation'][title='Draft']"));
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='checkbox'][title='Pending']")));
        element.click();
        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 3, 1000);
        Thread.sleep(1000);
        SubmitApplicationsRAFT.clickSaveButton(driver, driverWait);
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='tab'][title='Project Costing & Claims']")));
        element.click();
        //add final cost and save
        System.out.println(RandomIntGenerator.generateRandomInt(7));
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[type='text'][title='$0.00']")));
        element.click();
        element.sendKeys(RandomIntGenerator.generateRandomInt(7));
        Thread.sleep(1000);
        SubmitApplicationsRAFT.clickSaveButton(driver, driverWait);
        Thread.sleep(1000);

        SubmitApplicationsRAFT.clickSaveButton(driver, driverWait);
        Thread.sleep(1000);

       //Login Portal
        loginToPortal();

        //Click Submit project
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Projects ')]")));
        element.click();
        Thread.sleep(1000);
        // Check case number
        String caseNumberDisplayPortal = SubmitApplicationsRAFT.getCaseNumber();
        boolean isCaseNumberPresent = driver.getPageSource().contains(caseNumberDisplayPortal);
        System.out.println("Case Number found in page body: " + isCaseNumberPresent);

        //Create project
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Claims ')]")));
        element.click();
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Create a New Claim')]")));
        element.click();
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to proceed. ')]")));
        element.click();


        //Check text
        driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Please review and complete the form below. You may start a claim, save it, and continue to add to it later. Required fields are marked with a red asterisk ')]")));

        //Click Next - add invoice
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' Next - Add Invoices ')]"));

        //Click add invoices
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' + Add Invoice ')]"));

        //Add invoice details
        DateUtils dateUtils = new DateUtils();
        dateUtils.setTodayAsString(DateUtils.getFormattedDates().get("today"));
        setVendorName(RandomStringGenerator.generateRandomAlphanumeric(100));

// Use the getter method to retrieve and use the vendorName value
        fillFormField(driverWait, "[formcontrolname='vendorName'][maxlength='100']", getVendorName());
        System.out.println("Vendor name is: " + getVendorName());
        fillFormField(driverWait, "[formcontrolname='invoiceNumber'][maxlength='100']", RandomIntGenerator.generateRandomInt(100));
        fillFormField(driverWait, "[formcontrolname='invoiceDate'][aria-haspopup='dialog']", dateUtils.getTodayAsString());
        fillFormField(driverWait, "[formcontrolname='purposeOfGoodsServiceReceived'][maxlength='200']", RandomStringGenerator.generateRandomAlphanumeric(200));
        fillFormField(driverWait, "[formcontrolname='netInvoiceBeingClaimed'][maxlength='100']", RandomIntGenerator.generateRandomInt(6));
        fillFormField(driverWait, "[formcontrolname='pst'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));
        fillFormField(driverWait, "[formcontrolname='grossGST'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));



        //Check rdo buttons
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-radio-8-input")));
        element.click();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-radio-12-input")));
        element.click();

        //Click Add
        clickElementWithRetry(driverWait, By.cssSelector(".button-p.add-invoice.ng-star-inserted"));

        //Click Nxt to upload docs
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Upload Documents ')]")));
        element.click();
        Thread.sleep(1000);
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' + Add Invoices ')]"));
        // Upload docs
        Thread.sleep(1000);
        CreateNewProjectPublic.uploadFile(driverWait, "fileDrop", System.getProperty("user.dir") + '/' + "dummy.pdf");

        CreateNewProjectPublic.clickElementWithRetry(driverWait, By.cssSelector(".family-button.details-button.save-button.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base"));

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

        //Click Next - Review and Submit and Submit
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' Next - Review & Submit ')]"));

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
        Thread.sleep(1000);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-claim-main/div/mat-horizontal-stepper/div/div[2]/div[4]/div/div[2]/button/span[4]")));

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
       // Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to submit the claim. ')]")));
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
    private void fillFormField(WebDriverWait driverWait, String cssSelector, String value) throws InterruptedException {
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
}

