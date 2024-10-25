import dfa.Config;
import dfa.Constants;
import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static dfa.ElementInteractionHelper.scrollAndClickElement;
import static java.lang.Thread.sleep;

public class ValidateDraftApplicationNegRAFT {


    private WebDriver driver;

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

        // Create application Portal
        CreateNewApplicationPublic.createApplication(true);

        scrollAndClickElement(driver, driverWait, By.xpath("(//span[contains(text(),'Save Application')])[last()]"));

        // validate that dashboard opened
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'This page is for Indigenous communities or local governments')]")));

        LoginDynamicsPublic loginDynamicsPublic = new LoginDynamicsPublic();
        loginDynamicsPublic.test();

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
        } else {
            throw new IllegalArgumentException("Unknown environment: " + environmentName);
        }

        boolean isFound = true;
        try {
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(cssSelector)));
            element.click();


            sleep(2000);

            // scroll to the bottom
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("(//label)[last()]")));
            sleep(1000);
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("(//label)[last()]")));
            sleep(1000);

            // Get Other Causes element
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[contains(@aria-label,'Other Causes')]")));

            // Validate that cause is not the same as created and name is not the same as created
            if (!CreateNewApplicationPublic.getRandomChars().equals(element.getAttribute("value"))) isFound = false;

            // Get Doing Business As (DBA) Name
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[contains(@aria-label,'Doing Business As (DBA) Name')]")));

            // Validate that it's not the same as created draft
            if (!CreateNewApplicationPublic.getDBAName().equals(element.getAttribute("value")))  isFound = false;

        } catch (TimeoutException e) {
            isFound = false;
        }
        Assert.assertFalse("The application was created as a draft (not submitted but saved), but was found on the active tab on RAFT. " +
                "ticket: https://jag.gov.bc.ca/jira/browse/EMCRI-833", isFound);
        System.out.println("Draft application was created from the Public Portal and validated that it didn't appear on the Active tab on RAFT successfully.");
    }
}



