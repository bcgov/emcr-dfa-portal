import dfa.CommonUtils;
import dfa.Config;
import dfa.CustomWebDriverManager;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;

public class SubmitClaimsPublic {

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

        CreateNewProjectPublic createNewProjectPublic = new CreateNewProjectPublic();
        createNewProjectPublic.test();

        //Login RAFT
        getUrls();

    }
    public void getUrls() throws Exception {
        WebDriver driver = CustomWebDriverManager.getDriver();
        String url = CommonUtils.environmentUrls.get(Config.ENVIRONMENT_Dynamics);

        if (url != null) {
            driver.get(url);
            driver.navigate().to(url);
        } else {
            throw new IllegalArgumentException("Unknown environment: " + Config.ENVIRONMENT_Dynamics);
        }
    }
}
