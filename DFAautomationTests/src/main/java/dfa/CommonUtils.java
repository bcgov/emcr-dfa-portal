package dfa;


import org.openqa.selenium.WebDriver;

import java.util.HashMap;
import java.util.Map;

public class CommonUtils {

    private static final Map<String, String> environmentUrls = new HashMap<>();

    static {
        environmentUrls.put(Constants.DEV, "https://dfa-portal-dev.apps.silver.devops.gov.bc.ca/");
        environmentUrls.put(Constants.TST, "https://dfa-portal-test.apps.silver.devops.gov.bc.ca/");
        environmentUrls.put(Constants.DEV_Support, "https://portal.dev.dfa.gov.bc.ca");
        environmentUrls.put(Constants.TST_Support, "https://portal.test.dfa.gov.bc.ca");
        environmentUrls.put(Constants.TRN_Support, "https://portal.training.dfa.gov.bc.ca");
        environmentUrls.put(Constants.DEV_Public, "https://dfa-public-sector-dev.apps.silver.devops.gov.bc.ca/");
        environmentUrls.put(Constants.TST_Public, "https://dfa-portal-test.apps.silver.devops.gov.bc.ca/");
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
}
