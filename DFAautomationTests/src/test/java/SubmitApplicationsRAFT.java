import dfa.CustomWebDriverManager;
import dfa.ElementClickHelper;
import dfa.ElementInteractionHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.*;

public class SubmitApplicationsRAFT {


    private WebDriver driver;
    private static String caseTitleWithTimestamp;
    private static String caseNumber;


    public static String getCaseTitleWithTimestamp() {
        return caseTitleWithTimestamp;
    }

    public static void setCaseTitleWithTimestamp(String caseTitleWithTimestamp) {
        SubmitApplicationsRAFT.caseTitleWithTimestamp = caseTitleWithTimestamp;
    }

    public static String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
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

        // Create application Portal
        CreateNewApplicationPublic createNewApplicationPublic = new CreateNewApplicationPublic();
        createNewApplicationPublic.test();

        // Retrieve randomChars from CreateNewApplicationPublic
        String randomChars = createNewApplicationPublic.getRandomChars();
        System.out.println("Other comments: " + randomChars);

        LoginDynamicsPublic loginDynamicsPublic = new LoginDynamicsPublic();
        loginDynamicsPublic.test();

        // Navigate to "App Applications"
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'App Applications')]"));
        sleep(1000);
        // Interact with "Active AppApplications for Public Sector"
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

        // Interact with "Draft App Applications for Public Sector"
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Draft App Applications for Public Sector')]"));

        // Submitted dates descending
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[tabindex='-1'][title='Submitted Date']")));
        element.click();

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Sort Newest to Oldest')]"));
        sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='LG - '][tabindex='-1']")));
        element.click();

        //Primary contact
        //Assign to
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Assigned To, Lookup'][type='text']")));
        element.click();
        element.sendKeys("test");
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'EMBC DFA Test')]")));
        element.click();

        String ariaLabel = "Primary Contact, Lookup";
        String role = "combobox";

        try {
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='" + ariaLabel + "'][role='" + role + "']")));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
            element.sendKeys("abc");
            element = driverWait.until(ExpectedConditions
                    .elementToBeClickable(By.xpath("//*[contains(text(), 'cde, abc')]")));
            element.click();
            System.out.println("Element with aria-label 'Primary Contact, Lookup' and role 'combobox' clicked.");
        } catch (TimeoutException e) {
            System.out.println("TimeoutException: Element not found with aria-label: " + ariaLabel + " and role: " + role);
            System.out.println("Current URL: " + driver.getCurrentUrl());
            System.out.println("Page Source: " + driver.getPageSource());
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElementException: Element not found with aria-label: " + ariaLabel + " and role: " + role);
            System.out.println("Current URL: " + driver.getCurrentUrl());
            System.out.println("Page Source: " + driver.getPageSource());
        }

        // Check Other contact value exist
        String xpathExpression = String.format("//input[@type='text' and @value='%s']", randomChars);

        try {
            driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpathExpression)));
            System.out.println("Element with randomChars found in the DOM: " + randomChars);
        } catch (TimeoutException e) {
            System.out.println("TimeoutException: Element not found with randomChars: " + randomChars);
            System.out.println("XPath used: " + xpathExpression);
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElementException: Element not found with randomChars: " + randomChars);
            System.out.println("XPath used: " + xpathExpression);
        }
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        sleep(3000);
        //Click Draft
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='Draft'][role='presentation']")));
        element.click();
        sleep(1000);
        //Click Next Stage
        // Utility method to click an element multiple times with a delay
        clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 2, 1000);

        //Click Review details tab and enter details
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Review Details'][role='tab']")));
        element.click();

        // Get the current timestamp in milliseconds
        long timestamp = System.currentTimeMillis();
        // Define the case title
        String caseTitle = "Case Title";
        // Concatenate the timestamp with the case title
        String CaseTitleWithTimestamp = caseTitle + " " + timestamp;
        setCaseTitleWithTimestamp(CaseTitleWithTimestamp);
        // Locate the case title input field and set its value
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Case Title'][type='text']")));
        element.click();
        element.sendKeys(CaseTitleWithTimestamp);
        System.out.println("Case Title with timestamp: " + CaseTitleWithTimestamp);
        Thread.sleep(1000);

        long timestampLegalName = System.currentTimeMillis();
        String legalName = "Legal Name";
        String legalNameWithTimestamp = legalName + " " + timestampLegalName;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div/div[3]/div[2]/div/div/div/div/div/div[1]/div[1]/div[2]/div/div/div[2]/section/section[1]/div/div/div/div[3]/div/div/div[2]/div/div/div[2]/div/div[2]/div[1]/div/input")));
        element.click();
        element.sendKeys(legalNameWithTimestamp);
        System.out.println("Legal Name with timestamp: " + legalNameWithTimestamp);

        //Confirmed event
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Confirmed Event, Lookup'][type='text']")));
        element.click();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '2000-01')]")));
        element.click();
        Thread.sleep(1000);
        //Confirm Effected region
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Confirmed Effected Region/Community, Lookup'][type='text']")));
        element.click();
        element.sendKeys("District Municipality of 100 Mile House");
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'District Municipality of 100 Mile House')]")));
        element.click();
        Thread.sleep(1000);
        clickSaveButton(driver, driverWait);
        Thread.sleep(1000);
        //Confirm Primary Contact
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div/div[3]/div[2]/div/div/div/div/div/div[1]/div[1]/div[2]/div/div/div[2]/section/section[1]/div/div/div/div[6]/div/div/div[2]/div/div/div[2]/div/div[2]/div[1]/div/div[1]/div/input")));
        element.sendKeys("Alexandra Strong");
        //element.sendKeys("Alexandra Strong");
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Alexandra Strong')]")));
        element.click();
        Thread.sleep(1000);
        clickSaveButton(driver, driverWait);
        Thread.sleep(1000);

        //Damaged Property city
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='TO DELETE: Damaged Property: City, Lookup'][type='text']")));
        element.click();
        element.sendKeys("Oak");
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Oak Bay')]")));
        element.click();

        Thread.sleep(1000);
        clickSaveButton(driver, driverWait);
        Thread.sleep(1000);

        //Approve
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[role='presentation'][title^='In-Review']")));
        element.click();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Approved')]")));
        element.click();
        System.out.println("Switched to Approve status");
        //Save
        Thread.sleep(1000);
        clickSaveButton(driver, driverWait);
        Thread.sleep(1000);

        //Review Application
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("MscrmControls.Containers.ProcessBreadCrumb-stageStatusLabel")));
        element.click();
        Thread.sleep(4000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'General')]")));
        element.click();
        Thread.sleep(4000);
        //Review Application
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("MscrmControls.Containers.ProcessBreadCrumb-stageStatusLabel")));
        element.click();

        clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 1, 1000);

        //Click Case title
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + CaseTitleWithTimestamp + "')]")));
        element.click();
        System.out.println("Case title clicked: " + CaseTitleWithTimestamp);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("okButton")));
        element.click();
        clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 2, 1000);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='ID'][type^='text']")));
        String caseNumber = element.getText();
        if (caseNumber.isEmpty()) {
            caseNumber = element.getAttribute("value");
        }
        setCaseNumber(caseNumber);
        System.out.println("Case Number: " + getCaseNumber());

        //Case in progress Save and Close
        Thread.sleep(1000);
        clickSaveButton(driver, driverWait);
        Thread.sleep(1000);

    }

    public static void clickElementMultipleTimes(WebDriver driver, WebDriverWait driverWait, By locator, int times, int delayMillis) throws InterruptedException {
        for (int i = 0; i < times; i++) {
            ElementInteractionHelper.scrollAndClickElement(driver, driverWait, locator);
            sleep(delayMillis);
        }
    }

    public static void clickSaveButton(WebDriver driver, WebDriverWait driverWait) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Save'][title^='Save (CTRL+S)']")));
        element.click();
    }
}



