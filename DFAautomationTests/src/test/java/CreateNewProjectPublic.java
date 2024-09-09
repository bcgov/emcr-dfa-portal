import dfa.CustomWebDriverManager;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;
import static org.junit.Assert.fail;

public class CreateNewProjectPublic {

    private WebDriver driver;


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

        CreateNewApplicationPublic createNewApplicationPublic = new CreateNewApplicationPublic();
        createNewApplicationPublic.test();

        //Submit project
        element = driverWait.until(ExpectedConditions
                .presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Projects ')]")));
        element.click();

        //Check Dashboard
       // createNewApplicationPublic.checkBodyContainsRandomChars(randomChars);

    }


}
