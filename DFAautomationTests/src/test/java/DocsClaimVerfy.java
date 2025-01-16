import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static java.lang.Thread.sleep;

public class DocsClaimVerfy {   private WebDriver driver;

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

        SubmitClaimsPublic submitClaimsPublic = new SubmitClaimsPublic();
        submitClaimsPublic.test();

        // Locate the element using the provided XPath
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-claim-dashboard/div/div[3]/mat-tab-nav-panel/app-dfadashboard-claim/div/div[2]/mat-card/div[1]/div[1]/span[2]")));

        // Retrieve the text content of the located element
        String ClaimNumber = element.getText();

        // Print the text content
        System.out.println("Claim Number is: " + ClaimNumber);

        // Login RAFT
        SubmitClaimsPublic.getUrls();

        // Search for Claim no and switch to Submitted claims
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Recovery Claims')]"));
        sleep(1000);

        // Search for Claim no
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[type='text'][placeholder='Search this view']")));
        element.sendKeys(ClaimNumber);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("quickFind_button_icon_1")));
        element.click();
        int attempts = 0;
        while (attempts < 3) {
            try {
                element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + ClaimNumber + "')]")));
                element.click();
                break; // Exit the loop if successful
            } catch (StaleElementReferenceException e) {
                attempts++;
                Thread.sleep(1000); // Wait for 1 second before retrying
            }
        }
        // Click Related
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("related_tab_4")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Project Document Locations')]"));

        //Check if the document is attached
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'dummy.pdf')]")));
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'testDFA.xlsx')]")));
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'testPPXDFA.pptx')]")));
    }
}
