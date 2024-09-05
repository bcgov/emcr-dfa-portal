package dfa;


import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.logging.Logger;

public class CommonUtils {

    private static Logger log = Logger.getLogger("CommonUtils.class");

    public static void login() throws Exception {

        WebDriver driver = CustomWebDriverManager.getDriver();
        WebElement element = CustomWebDriverManager.getElement();

        if (Config.ENVIROMENT.equals(Constants.DEV)) {
            driver.get("https://dfa-portal-dev.apps.silver.devops.gov.bc.ca/");
            driver.navigate().to("https://dfa-portal-dev.apps.silver.devops.gov.bc.ca/");
            driver.navigate().refresh();

        } else if (Config.ENVIROMENT.equals(Constants.TST)) {
            driver.get("https://dfa-portal-test.apps.silver.devops.gov.bc.ca/");
            driver.navigate().to("https://dfa-portal-test.apps.silver.devops.gov.bc.ca/");
            driver.navigate().refresh();


        } else if (Config.ENVIROMENT.equals(Constants.DEV_Support)) {
            driver.get("https://portal.dev.dfa.gov.bc.ca");
            driver.navigate().to("https://portal.dev.dfa.gov.bc.ca");
            driver.navigate().refresh();

        } else if (Config.ENVIROMENT.equals(Constants.TST_Support)) {
            driver.get("https://portal.test.dfa.gov.bc.ca");
            driver.navigate().to("https://portal.test.dfa.gov.bc.ca");
            driver.navigate().refresh();

        } else if (Config.ENVIROMENT.equals(Constants.TRN_Support)) {
            driver.get("https://portal.training.dfa.gov.bc.ca");
            driver.navigate().to("https://portal.training.dfa.gov.bc.ca");
            driver.navigate().refresh();

        } else if (Config.ENVIROMENT.equals(Constants.DEV_Public)) {
            driver.get("https://dfa-public-sector-dev.apps.silver.devops.gov.bc.ca/");
            driver.navigate().to("https://dfa-public-sector-dev.apps.silver.devops.gov.bc.ca/");
            driver.navigate().refresh();

        } else if (Config.ENVIROMENT.equals(Constants.TST_Public)) {
            driver.get("https://dfa-portal-test.apps.silver.devops.gov.bc.ca/");
            driver.navigate().to("https://dfa-portal-test.apps.silver.devops.gov.bc.ca/");
            driver.navigate().refresh();

        }
    }


}
