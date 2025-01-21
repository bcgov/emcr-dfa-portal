import dfa.CommonUtils;
import dfa.Config;
import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import lombok.Getter;
import lombok.Setter;
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

public  class CreateNewProjectPublic {

    private static WebDriver driver;
    @Getter
    @Setter
    private static String randomProjectNumber;

    @AfterClass
    public static void afterClass() {
        CustomWebDriverManager.instance = null;
    }

    @After
    public void tearDown() {
        driver.close();
        driver.quit();
    }


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
        String xpathSubmitProjectByCaseNumber = "//span[contains(text(),'" + SubmitApplicationsRAFT.getCaseNumber() + "')]/../../div//button[contains(text(), 'Submit Projects')]";
        driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath(xpathSubmitProjectByCaseNumber)));
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath(xpathSubmitProjectByCaseNumber));

        Thread.sleep(1000);
        // Check case number
        String caseNumberDisplayPortal = SubmitApplicationsRAFT.getCaseNumber();
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

    static void clickElementWithRetry(WebDriverWait driverWait, By locator) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        try {
            element.click();
        } catch (org.openqa.selenium.ElementClickInterceptedException e) {
            // Retry clicking the element
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("arguments[0].scrollIntoView(true);", element);
            js.executeScript("arguments[0].click();", element);
        }
    }

    public static void uploadFile(WebDriverWait driverWait, String elementId, String filePath) throws InterruptedException {
        WebElement fileInput = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id(elementId)));
        fileInput.sendKeys(filePath);
        Thread.sleep(1000);
    }

    public static void clickElementWithRetryforDocSave(WebDriverWait driverWait, By locator) throws InterruptedException {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        int attempts = 0;
        while (attempts < 3) {
            try {
                element.click();
                break;
            } catch (org.openqa.selenium.ElementClickInterceptedException |
                     org.openqa.selenium.StaleElementReferenceException e) {
                Thread.sleep(500); // Adjust the sleep time as necessary
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(locator));
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
            }
            attempts++;
        }
    }

}