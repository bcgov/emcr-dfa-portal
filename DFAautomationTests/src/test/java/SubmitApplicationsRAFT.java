import dfa.Config;
import dfa.Constants;
import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import lombok.Getter;
import lombok.Setter;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.sleep;

public class SubmitApplicationsRAFT {


    private WebDriver driver;
    @Getter
    @Setter
    private static String caseTitleWithTimestamp;
    @Getter
    @Setter
    private static String caseNumber;

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
        String randomChars = CreateNewApplicationPublic.getRandomChars();
        System.out.println("Other comments: " + randomChars);

        //Wait for dashboard
//        element = driverWait.until(ExpectedConditions
//                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Back To Dashboard ')]")));
//        element.click();

        LoginDynamicsPublic loginDynamicsPublic = new LoginDynamicsPublic();
        loginDynamicsPublic.test();

        sleep(2000);
        navigateAndInteractWithAppApplications(driver, driverWait, randomChars);

        sleep(1000);
        clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 2, 1000);

        //Click Summary tab
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Summary')]"));

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='ID'][type^='text']")));
        String caseNumber = element.getText();
        if (caseNumber.isEmpty()) {
            caseNumber = element.getAttribute("value");
        }
        setCaseNumber(caseNumber);
        System.out.println("Case Number: " + getCaseNumber());

        //Case in progress Save and Close
        Thread.sleep(1000);
        clickSaveButton(driverWait);
        Thread.sleep(1000);

    }

    public static void clickElementMultipleTimes(WebDriver driver, WebDriverWait driverWait, By locator, int times, int delayMillis) throws InterruptedException {
        for (int i = 0; i < times; i++) {
            ElementInteractionHelper.scrollAndClickElement(driver, driverWait, locator);
            sleep(delayMillis);
        }
    }

    public static void clickSaveButton(WebDriverWait driverWait) {
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

    public static void navigateAndInteractWithAppApplications(WebDriver driver, WebDriverWait driverWait, String randomChars) throws InterruptedException {
        WebElement element;
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Actions actions = new Actions(driver);

        // Navigate to "App Applications"
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'App Applications')]"));
        sleep(1000);

        // Submitted dates descending
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[tabindex='-1'][title='Created On']")));
        element.click();

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Sort Newest to Oldest')]"));
        sleep(1000);

        // Determine the environment and set the appropriate CSS selector
        String environmentName = Config.ENVIRONMENT_Dynamics; // Use the correct environment variable
        String cssSelector;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentName)) {
            cssSelector = "[title='LG - DFA Dev Automated'][tabindex='-1']";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentName)) {
            cssSelector = "[title='LG - DFA Train Automated'][tabindex='-1']";
        } else if (Constants.TRN_DynamicsPub.equalsIgnoreCase(environmentName)) {
            cssSelector = "[title='LG - DFA Train Automated'][tabindex='-1']";
        } else if (Constants.DEV_SupportDynamicsPub.equalsIgnoreCase(environmentName)) {
            cssSelector = "[title='LG - DFA Dev Automated'][tabindex='-1']";
        } else if (Constants.TST_SupportDynamicsPub.equalsIgnoreCase(environmentName)) {
            cssSelector = "[title='LG - DFA Train Automated'][tabindex='-1']";
        } else if (Constants.TRN_SupportDynamicsPub.equalsIgnoreCase(environmentName)) {
            cssSelector = "[title='LG - DFA Train Automated'][tabindex='-1']";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentName);
        }

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(cssSelector)));
        element.click();

        sleep(1000);

        // scroll to the bottom
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("(//label)[last()]")));
        sleep(1000);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("(//label)[last()]")));
        sleep(1000);

        // Get Other Causes element
        WebElement inputElement = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[contains(@aria-label,'Other Causes')]")));

        // Assert that the actual value matches the expected value
        Assert.assertEquals("The populated cause of damage value is not as expected.", randomChars, inputElement.getAttribute("value"));

        // scroll to the top
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//label[@role='presentation']")));

        // Assign to
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Assigned To, Lookup'][type='text']")));
        element.click();
        //element.sendKeys("test");
        element.sendKeys("EMCR Service Account Dynamics Test");

        // Determine the environment and set the appropriate XPath
        String environmentAssingTo = Config.ENVIRONMENT_Dynamics; // Assume Config.ENVIRONMENT contains the environment name
        String xpathExpressionAssingTo;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMCR DFA Reporting BI Test')]";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMBC DFA Test')]";
        } else if (Constants.TRN_DynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMBC DFA Test')]";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMCR Service Account Dynamics Test')]";
        } else if (Constants.TST_SupportDynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMCR Service Account Dynamics Test')]";
        } else if (Constants.DEV_SupportDynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMCR DFA Reporting BI Test')]";
        } else if (Constants.TST_SupportDynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMCR DFA Reporting BI Test')]";
        } else if (Constants.TRN_SupportDynamicsPub.equalsIgnoreCase(environmentAssingTo)) {
            xpathExpressionAssingTo = "//*[contains(text(), 'EMCR DFA API Service Account')]";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentName);
        }

        // Locate and click the element based on the environment
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpathExpressionAssingTo)));
//        element.click();

        // scroll to the bottom of the page by navigating to the last //label element
        sleep(1000);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("(//label)[last()]")));
        sleep(1000);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("(//label)[last()]")));
        sleep(1000);

        // now primary conatact is filled out by default, but I'll leave this implementation for future
        // Primary Contact
        // element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Primary Contact, Lookup'][role='combobox']")));
        // ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        // ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        // element.sendKeys("DFA Train Automated");
        // sleep(1000);

        // Primary Contact
        // String environmentPrimaryContact = Config.ENVIRONMENT_Dynamics; // Use the correct environment variable
        // String xpathExpressionPrimaryContact;

        // if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentPrimaryContact)) {
        //     xpathExpressionPrimaryContact = "//*[contains(text(), 'EIGHT, PHSAPOC')]";
        // } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentPrimaryContact)) {
        //     xpathExpressionPrimaryContact = "//*[contains(text(), 'DFA Train Automated')]";
        // } else if (Constants.TRN_DynamicsPub.equalsIgnoreCase(environmentPrimaryContact)) {
        //     xpathExpressionPrimaryContact = "//*[contains(text(), 'EIGHT, PHSAPOC')]";
        // } else {
        //     throw new IllegalArgumentException("Unknown environment: " + environmentPrimaryContact);
        // }

        // element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpathExpressionPrimaryContact)));
        // element.click();

        //Mailling add city
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Mailing Address City, Lookup'][type='text']")));
        element.click();
        element.sendKeys("Victoria");
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Victoria')]"));
        sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));
        sleep(3000);

        // Click Review details tab and enter details
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
        sleep(1000);
        element.sendKeys(CaseTitleWithTimestamp);
        System.out.println("Case Title with timestamp: " + CaseTitleWithTimestamp);
        Thread.sleep(1000);

        // Confirm Effected region
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Confirmed Effected Region/Community, Lookup'][type='text']")));
        element.click();
        element.sendKeys("City of Burnaby");
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'City of Burnaby')]")));
        element.click();
        Thread.sleep(1000);
        clickSaveButton(driverWait);
        Thread.sleep(1000);

        // Confirm Primary Contact
        String environmentPrimaryContactConfirm = Config.ENVIRONMENT_Dynamics; // Use the correct environment variable
        String primaryContactValue;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            primaryContactValue = "DFA Dev Automated";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            primaryContactValue = "DFA Train Automated";
        } else if (Constants.TRN_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            primaryContactValue = "DFA Train Automated";
        } else if (Constants.DEV_SupportDynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            primaryContactValue = "DFA Dev Automated";
        } else if (Constants.TST_SupportDynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            primaryContactValue = "DFA Train Automated";
        } else if (Constants.TRN_SupportDynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            primaryContactValue = "DFA Train Automated";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentPrimaryContactConfirm);
        }

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("(//input[@aria-label='Confirmed Primary Contact, Lookup'])[last()]")));

        element = driverWait.until(ExpectedConditions.visibilityOf(element));
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        element.clear();
        element.sendKeys(primaryContactValue);
        String environmentPrimaryContactConfirmSelectPopup = Config.ENVIRONMENT_Dynamics; // Use the correct environment variable
        String xpathExpressionPrimaryContactConfirm;

        if (Constants.DEV_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirmSelectPopup)) {
            xpathExpressionPrimaryContactConfirm = "//span[contains(text(), 'DFA Dev Automated')]";
        } else if (Constants.TST_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            xpathExpressionPrimaryContactConfirm = "//span[contains(text(), 'DFA Train Automated')]";
        } else if (Constants.TRN_DynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            xpathExpressionPrimaryContactConfirm = "//span[contains(text(), 'DFA Train Automated')]";
        } else if (Constants.DEV_SupportDynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            xpathExpressionPrimaryContactConfirm = "//span[contains(text(), 'DFA Dev Automated')]";
        } else if (Constants.DEV_SandboxDynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            xpathExpressionPrimaryContactConfirm = "//span[contains(text(), 'Nitin Joy')]";
        } else if (Constants.TST_SupportDynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            xpathExpressionPrimaryContactConfirm = "//span[contains(text(), 'DFA Train Automated')]";
        } else if (Constants.TRN_SupportDynamicsPub.equalsIgnoreCase(environmentPrimaryContactConfirm)) {
            xpathExpressionPrimaryContactConfirm = "//span[contains(text(), 'DFA Train Automated')]";
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentPrimaryContactConfirmSelectPopup);
        }

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpathExpressionPrimaryContactConfirm)));
        element.click();

        Thread.sleep(1000);
        clickSaveButton(driverWait);
        Thread.sleep(1000);

        Thread.sleep(1000);
        clickSaveButton(driverWait);
        Thread.sleep(1000);

        // Approve
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[erol='presentation'][title^='In-Review']")));
//        element.click(); // In Train environment
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Review Status'][title^='Open']")));
//        element.click(); // Added for Test Environment
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Approved')]")));
        element.click();
        System.out.println("Switched to Approve status");
        // Save
        Thread.sleep(1000);
        clickSaveButton(driverWait);

        for (int i = 0; i < 7; i++) {
            // Click the stage status label
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("MscrmControls.Containers.ProcessBreadCrumb-stageStatusLabel")));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
            Thread.sleep(1000);

            // Click the General tab
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'General')]")));
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
            Thread.sleep(1000);

            // Review Application
            Thread.sleep(1000);
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("MscrmControls.Containers.ProcessBreadCrumb-stageStatusLabel")));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

            // Click Next Stage
            clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 2, 1000);
            sleep(1000);

            // Click Case title
            try {
                String xpath = "(//*[contains(text(), '" + CaseTitleWithTimestamp + "')])[last()]";
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpath)));
                element.click();
                break; // Exit the loop if the element is found
            } catch (TimeoutException | ElementNotInteractableException e) {
                // Continue the loop if the element is not found
            }
        }
        System.out.println("Case title clicked: " + CaseTitleWithTimestamp);
        sleep(1500);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("okButton")));
        element.click();
    }
}




