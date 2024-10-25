import dfa.Config;
import dfa.Constants;
import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static dfa.ElementInteractionHelper.scrollAndClickElement;
import static java.lang.Thread.sleep;

public class ValidateDraftApplicationRAFT {


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
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Actions actions = new Actions(driver);

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

        // Interact with "Active AppApplications for Public Sector"
        SubmitApplicationsRAFT.clickElementWithJS(driverWait, js, actions, By.cssSelector("[aria-haspopup='true'][title='Select a view']"));

        // Interact with "Draft App Applications for Public Sector"
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Draft App Applications for Public Sector')]"));

        // Submitted dates descending
        // Submitted dates descending
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[tabindex='-1'][title='Date Received']")));
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

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(cssSelector)));
        element.click();

        sleep(1000);

        // scroll to the bottom
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("(//label)[last()]")));
        sleep(1000);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("(//label)[last()]")));
        sleep(1000);

        // Get Other Causes element
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[contains(@aria-label,'Other Causes')]")));

        // Assert that the actual value matches the expected value
        Assert.assertEquals("The populated cause of damage value is not as expected.", CreateNewApplicationPublic.getRandomChars(), element.getAttribute("value"));

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[contains(@aria-label,'Doing Business As (DBA) Name')]")));
        Assert.assertEquals("The populated cause of damage value is not as expected.", CreateNewApplicationPublic.getDBAName(), element.getAttribute("value"));

        System.out.println("The draft application was created from the Public Portal and validated on the DRAFT tab successfully.");
    }
}



