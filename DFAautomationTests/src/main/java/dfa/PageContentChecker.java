package dfa;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import java.util.List;

public class PageContentChecker {

    public static boolean isValuePresentInBody(WebDriver driver, String value) {
        WebElement bodyElement = driver.findElement(By.tagName("body"));
        String bodyText = bodyElement.getText();
        if (bodyText.contains(value)) {
            return true;
        }

        // Check within span elements
        List<WebElement> spanElements = driver.findElements(By.tagName("span"));
        for (WebElement span : spanElements) {
            if (span.getText().contains(value)) {
                return true;
            }
        }

        return false;
    }
}