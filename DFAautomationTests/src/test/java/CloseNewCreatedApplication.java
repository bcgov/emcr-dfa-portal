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

import static dfa.CustomWebDriverManager.getDriver;

public class CloseNewCreatedApplication
{  private static WebDriver driver;



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

        SubmitApplicationsRAFT.navigateAndInteractWithAppApplications(driver, driverWait, randomChars);

        SubmitApplicationsRAFT.clickElementMultipleTimes(driver, driverWait, By.xpath("//*[contains(text(), 'Next Stage')]"), 3, 1000);

        //Take CAS number
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div/div[3]/div[2]/div/div/div/div/div/div[1]/div[1]/div[2]/div/div/div/section/section[1]/div/div/div[2]/div[2]/div/div/div[2]/div/div[3]/div[2]/div/div[2]/div[1]/div/input")));
        String CASNo = element.getText();
        System.out.println("CAS Number is: " + CASNo);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Save')]"));

        // Login portal
        SubmitClaimsPublic.loginToPortal();

        //Check application

    }
}
