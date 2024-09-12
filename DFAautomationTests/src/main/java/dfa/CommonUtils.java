package dfa;


import org.openqa.selenium.WebDriver;

import java.util.HashMap;
import java.util.Map;

public class CommonUtils {

    public static final Map<String, String> environmentUrls = new HashMap<>();

    static {
        environmentUrls.put(Constants.DEV, "https://dfa-portal-dev.apps.silver.devops.gov.bc.ca/");
        environmentUrls.put(Constants.TST, "https://dfa-portal-test.apps.silver.devops.gov.bc.ca/");
        environmentUrls.put(Constants.DEV_Support, "https://portal.dev.dfa.gov.bc.ca");
        environmentUrls.put(Constants.TST_Support, "https://portal.test.dfa.gov.bc.ca");
        environmentUrls.put(Constants.TRN_Support, "https://portal.training.dfa.gov.bc.ca");
        environmentUrls.put(Constants.DEV_Public, "https://dfa-public-sector-dev.apps.silver.devops.gov.bc.ca/");
        environmentUrls.put(Constants.TST_Public, "https://dfa-public-sector-test.apps.silver.devops.gov.bc.ca/");
        environmentUrls.put(Constants.DEV_DynamicsPub, "https://embc-dfa2.dev.jag.gov.bc.ca/main.aspx?appid=3d27a86f-57c6-ec11-b832-00505683fbf4&pagetype=dashboard&id=87bd5bc9-6d29-ed11-b834-00505683fbf4&type=system&_canOverride=true");
        environmentUrls.put(Constants.TST_DynamicsPub, "https://embc-dfa2.test.jag.gov.bc.ca/main.aspx?appid=02c4ab7f-accc-ec11-b82a-005056832896&pagetype=dashboard&id=87bd5bc9-6d29-ed11-b834-00505683fbf4&type=system&_canOverride=true");
    }

    public static void login() throws Exception {
        WebDriver driver = CustomWebDriverManager.getDriver();
        String url = environmentUrls.get(Config.ENVIRONMENT);

        if (url != null) {
            driver.get(url);
            driver.navigate().to(url);
            driver.navigate().refresh();
        } else {
            throw new IllegalArgumentException("Unknown environment: " + Config.ENVIRONMENT);
        }
    }
    public static void loginDynamics() throws Exception {
        WebDriver driver = CustomWebDriverManager.getDriver();
        String url = environmentUrls.get(Config.ENVIRONMENT_Dynamics);

        if (url != null) {
            driver.get(url);
            driver.navigate().to(url);
            driver.navigate().refresh();
        } else {
            throw new IllegalArgumentException("Unknown environment: " + Config.ENVIRONMENT_Dynamics);
        }
    }
}
