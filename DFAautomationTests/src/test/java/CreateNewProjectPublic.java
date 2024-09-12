import dfa.CommonUtils;
import dfa.Config;
import dfa.CustomWebDriverManager;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static org.junit.Assert.fail;

public class CreateNewProjectPublic {

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

        SubmitApplicationsRAFT submitApplicationsRAFT = new SubmitApplicationsRAFT();
        submitApplicationsRAFT.test();

        getUrls();

        // Submit project
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Projects ')]")));
        element.click();
        Thread.sleep(1000);
        // Check case number
        String caseNumberDisplayPortal = submitApplicationsRAFT.getCaseNumber();
        boolean isCaseNumberPresent = driver.getPageSource().contains(caseNumberDisplayPortal);
        System.out.println("Case Number found in page body: " + isCaseNumberPresent);

        //Create project
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Create a New Project')]")));
        element.click();
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to proceed. ')]")));
        element.click();

        // Create random number
        Thread.sleep(1000);
        String randomProjectNumber = RandomStringGenerator.generateRandomAlphanumeric(10);
        System.out.println("Project Number is: " + randomProjectNumber);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("projectNumber")));

        // Scroll into view if necessary
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        Thread.sleep(1000);
        // Ensure the element is clickable
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        element.sendKeys(randomProjectNumber);

        // Create random project name
        String randomProjectName = RandomStringGenerator.generateRandomAlphanumeric(20);
        System.out.println("Project Name is: " + randomProjectName);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-input-1")));

        // Scroll into view if necessary
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);

        // Ensure the element is clickable
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        element.sendKeys(randomProjectName);

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
        fillFormField(driverWait, "[formcontrolname='differentDamageDatesReason'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumeric(200));
        fillFormField(driverWait, "[formcontrolname='siteLocation'][maxlength='100']", RandomStringGenerator.generateRandomAlphanumeric(100));
        fillFormField(driverWait, "[formcontrolname='infraDamageDetails'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumeric(2000));
        fillFormField(driverWait, "[formcontrolname='causeofDamageDetails'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumeric(2000));
        fillFormField(driverWait, "[formcontrolname='describeDamageDetails'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumeric(2000));
        fillFormField(driverWait, "[formcontrolname='describeDamagedInfrastructure'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumeric(2000));
        fillFormField(driverWait, "[formcontrolname='repairWorkDetails'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumeric(2000));
        fillFormField(driverWait, "[formcontrolname='repairDamagedInfrastructure'][maxlength='2000']", RandomStringGenerator.generateRandomAlphanumeric(2000));
        fillFormField(driverWait, "[formcontrolname='estimateCostIncludingTax'][maxlength='100']", RandomIntGenerator.generateRandomInt(7));
        fillFormField(driverWait, "[formcontrolname='estimatedCompletionDate'][aria-haspopup='dialog']", dateUtils.getInOneYearAsString());


        //Click Next
        Thread.sleep(1000);
        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight);");
        Thread.sleep(1000);
        clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' Next - Upload Documents ')]"));
        System.out.println("Next - Upload Documents clicked");



    }


    public void getUrls() {
        String urlPortal = CommonUtils.environmentUrls.get(Config.ENVIRONMENT);

        if (urlPortal == null) {
            throw new IllegalArgumentException("Unknown environment: " + Config.ENVIRONMENT);
        }

        driver.get(urlPortal);
    }

    private void fillFormField(WebDriverWait driverWait, String cssSelector, String value) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(cssSelector)));
        element.clear();
        element.sendKeys(value);
    }

    private void clickElementWithRetry(WebDriverWait driverWait, By locator) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        try {
            element.click();
        } catch (org.openqa.selenium.ElementClickInterceptedException e) {
            // Retry clicking the element
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
            element.click();
        }
    }
}