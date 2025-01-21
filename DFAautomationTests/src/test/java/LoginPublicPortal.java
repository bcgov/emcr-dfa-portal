import dfa.CommonUtils;
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

import java.time.Duration;

public class LoginPublicPortal {

    private WebDriver driver;
    private static final String  bceidUSERNAME = System.getenv("USERNAME_BCEID");
    private static final String bceidPASSWORD = System.getenv("PASSWORD_BCEID");


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
        WebElement element;
        CustomWebDriverManager.getElements();

        CommonUtils.login();
        JavascriptExecutor js = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), 'Log in with Business BCeID')]")));
        js.executeScript("arguments[0].click();", element);

        //To be added as sys variables
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("user")));
        element.sendKeys(bceidUSERNAME);
        //Pass
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("password")));
        element.sendKeys(bceidPASSWORD);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.name("btnSubmit")));
        element.click();
        //Thread.sleep(30000);
        // element = driverWait
               // .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='submit' and @value='Continue']")));
        // element.click();
        //element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='checkbox']"))); // sometime it display the page with the login history
        //element.click();
        //element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='submit']")));
        //element.click();
        //Display notice of Collention
        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                //ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Disaster Financial Assistance')]")));
                ExpectedConditions.presenceOfElementLocated(By.xpath("//span[text()=' Create a New Application ']")));

    }

}
