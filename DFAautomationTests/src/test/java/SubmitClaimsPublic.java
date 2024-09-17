import dfa.CommonUtils;
import dfa.Config;
import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CommonUtils.environmentUrls;
import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.sleep;

public class SubmitClaimsPublic {

    private WebDriver driver;


//    @After
//    public void tearDown() {
//        driver.close();
//        driver.quit();
//    }
//
//    @AfterClass
//    public static void afterClass() {
//        CustomWebDriverManager.instance = null;
//    }


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
        ;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='" + CreateNewProjectPublic.getRandomProjectNumber() + "'][role='gridcell']")));
        actions.doubleClick(element).perform();
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='presentation'][title='Draft']")));
        element.click();
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

        //Decision made
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='presentation'][title='Decision Made']")));
//        element.click();
//        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);
//        Thread.sleep(1000);
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


        System.out.println("Claim number: " + getClaimNumberText());

        //Check text
        driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Please review and complete the form below. You may start a claim, save it, and continue to add to it later. Required fields are marked with a red asterisk ')]")));

        //Click Next - add invoice
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Add Invoices ')]")));
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

        //Click add invoices
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Invoice ')]")));
        element.click();

        //Add invoice details
        DateUtils dateUtils = new DateUtils();
        dateUtils.setTodayAsString(DateUtils.getFormattedDates().get("today"));
        fillFormField(driverWait, "[formcontrolname='vendorName'][maxlength='100']", RandomStringGenerator.generateRandomAlphanumeric(100));
        fillFormField(driverWait, "[formcontrolname='invoiceNumber'][maxlength='100']", RandomStringGenerator.generateRandomAlphanumeric(100));
        fillFormField(driverWait, "[formcontrolname='invoiceDate'][aria-haspopup='dialog']", dateUtils.getTodayAsString());
        fillFormField(driverWait, "[formcontrolname='purposeOfGoodsServiceReceived'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumeric(2000));
        fillFormField(driverWait, "[formcontrolname='netInvoiceBeingClaimed'][maxlength='100']", RandomIntGenerator.generateRandomInt(6));
        fillFormField(driverWait, "[formcontrolname='pst'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));
        fillFormField(driverWait, "[formcontrolname='grossGST'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));

        //Check rdo buttons
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-radio-8-input")));
        element.click();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-radio-12-input")));
        element.click();

        //Click Add
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".button-p.add-invoice.ng-star-inserted")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));

        int attempts1 = 0;
        while (attempts1 < 3) {
            try {
                element.click();
                break;
            } catch (org.openqa.selenium.ElementClickInterceptedException e) {
                Thread.sleep(500); // Adjust the sleep time as necessary
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
            } catch (org.openqa.selenium.ElementNotInteractableException e) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
                break;
            }
            attempts1++;
        }






    }

    public void getUrls() throws Exception {
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
    public String getClaimNumberText() {
        WebDriver driver = CustomWebDriverManager.getDriver();
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("claimNumber")));
        return element.getText();
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
}

