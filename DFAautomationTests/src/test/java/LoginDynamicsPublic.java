import dfa.CommonUtils;
import dfa.CustomWebDriverManager;
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

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class LoginDynamicsPublic {

    private WebDriver driver;
    private static String dynamicsUSERNAME = System.getenv("USERNAME_DYNAMICS");
    private static String dynamicsPASSWORD = System.getenv("PASSWORD_DYNAMICS");

    static {
        Properties properties = new Properties();
        try {
            properties.load(new FileInputStream("config.properties"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        dynamicsUSERNAME = System.getenv("USERNAME_DYNAMICS");
        dynamicsPASSWORD = System.getenv("PASSWORD_DYNAMICS");

        if (dynamicsUSERNAME == null) {
            dynamicsUSERNAME = properties.getProperty("USERNAME_DYNAMICS");
        }
        if (dynamicsPASSWORD == null) {
            dynamicsPASSWORD = properties.getProperty("PASSWORD_DYNAMICS");
        }
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
        driver = CustomWebDriverManager.getDriver();
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        WebElement element = CustomWebDriverManager.getElement();
        CustomWebDriverManager.getElements();

        CommonUtils.loginDynamics();
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Actions actions = new Actions(driver);

        // Log in to Dynamics
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("userNameInput")));
        element.sendKeys(dynamicsUSERNAME);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("passwordInput")));
        element.sendKeys(dynamicsPASSWORD);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("submitButton")));
        element.click();

        // Navigate to "App Applications"
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'App Applications')]")));

    }
}