import dfa.Config;
import dfa.Constants;
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
        // Usage example in your test method
        clickElementWithJS(driverWait, js, actions, By.cssSelector("[aria-haspopup='true'][title='Select a view']"));

        // Interact with "Draft App Applications for Public Sector"
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Draft App Applications for Public Sector')]"));

        // Submitted dates descending
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[tabindex='-1'][title='Submitted Date']")));
        element.click();

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Sort Newest to Oldest')]"));
        sleep(1000);

        // Determine the environment and set the appropriate CSS selector
        String environmentName = Config.ENVIRONMENT_Dynamics; // Use the correct environment variable
        String cssSelector;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentName)) {
            cssSelector = "[title='LG - BC Provincial Gov DFA DEV Testing'][tabindex='-1']";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentName)) {
            cssSelector = "[title='LG - DFA_C'][tabindex='-1']";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentName);
        }

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(cssSelector)));
        element.click();

        //Assign to
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Assigned To, Lookup'][type='text']")));
        element.click();
        element.sendKeys("test");

        // Determine the environment and set the appropriate XPath
        String environmentAssingTo = Config.ENVIRONMENT_Dynamics; // Assume Config.ENVIRONMENT contains the environment name
        String xpathExpressionAssingTo = null;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMCR DFA Reporting BI Test')]";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMBC DFA Test')]";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentName);
        }

// Locate and click the element based on the environment
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpathExpressionAssingTo)));
        element.click();

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Primary Contact, Lookup'][role='combobox']")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        element.sendKeys(" PHSAPOC");
        sleep(1000);

        //Primary Contact
        String environmentPrimaryContact = Config.ENVIRONMENT_Dynamics; // Use the correct environment variable
        String xpathExpressionPrimaryContact;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentPrimaryContact)) {
            xpathExpressionPrimaryContact = "//*[contains(text(), 'EIGHT, PHSAPOC')]";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentPrimaryContact)) {
            xpathExpressionPrimaryContact = "//*[contains(text(), 'EIGHT, PHSAPOC')]";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentPrimaryContact);
        }

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpathExpressionPrimaryContact)));
        element.click();

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
        //Confirm Effected region
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Confirmed Effected Region/Community, Lookup'][type='text']")));
        element.click();
        element.sendKeys("City of Burnaby");
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'City of Burnaby')]")));
        element.click();
        Thread.sleep(1000);
        clickSaveButton(driver, driverWait);
        Thread.sleep(1000);
        //Confirm Primary Contact
        //To discuss
        String environmentPrimaryContactConfirm = Config.ENVIRONMENT_Dynamics; // Use the correct environment variable
        String primaryContactValue;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            primaryContactValue = " test";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            primaryContactValue = " PHSAPOC";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentPrimaryContactConfirm);
        }

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div/div[3]/div[2]/div/div/div/div/div/div[1]/div[1]/div[2]/div/div/div[2]/section/section[1]/div/div/div/div[6]/div/div/div[2]/div/div[3]/div[2]/div/div[2]/div[1]/div/div[1]/div/input")));
        element = driverWait.until(ExpectedConditions.visibilityOf(element));
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        element.sendKeys(primaryContactValue);
        String environmentPrimaryContactConfirmSelectPopup = Config.ENVIRONMENT_Dynamics; // Use the correct environment variable
        String xpathExpressionPrimaryContactConfirm;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirmSelectPopup)) {
            xpathExpressionPrimaryContactConfirm = "//*[contains(text(), 'Allen Jim')]";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            xpathExpressionPrimaryContactConfirm = "//*[contains(text(), 'GREGORY PHSAPOC')]";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentPrimaryContactConfirmSelectPopup);
        }

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpathExpressionPrimaryContactConfirm)));
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
    public static void clickElementWithJS(WebDriverWait driverWait, JavascriptExecutor js, Actions actions, By locator) {
        WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(locator));
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
    }
}



