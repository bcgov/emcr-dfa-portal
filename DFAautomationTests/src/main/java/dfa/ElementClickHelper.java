package dfa;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.ElementClickInterceptedException;

public class ElementClickHelper {

    public static void clickElement(WebDriver driver, WebElement element) {
        try {
            element.click();
        } catch (ElementClickInterceptedException e) {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("arguments[0].click();", element);
        }
    }
}