package dfa;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class TextInputHelper {
    private WebDriver driver;
    private WebDriverWait driverWait;

    public TextInputHelper(WebDriver driver, int timeoutSeconds) {
        this.driver = driver;
        this.driverWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
    }

    /**
     * Enter text into an input field or textarea using formcontrolname
     * @param formControlName The formcontrolname attribute value
     * @param text Text to enter
     * @throws Exception if element not found or interaction fails
     */
    public void enterTextByFormControl(String formControlName, String text) throws Exception {
        try {
            // Find element by formcontrolname
            WebElement element = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("[formcontrolname='" + formControlName + "']")));

            // Scroll element into view
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            Thread.sleep(500); // Wait for scroll to settle

            // Clear existing text
            element.clear();

            // Enter new text
            element.sendKeys(text);
            Thread.sleep(500); // Wait for text entry to complete

        } catch (Exception e) {
            throw new Exception("Failed to enter text in " + formControlName + ": " + e.getMessage());
        }
    }

    /**
     * Verify if text was entered correctly
     * @param formControlName The formcontrolname attribute value
     * @param expectedText Text that should be in the field
     * @return boolean indicating if text matches
     */
    public boolean verifyTextEntry(String formControlName, String expectedText) {
        try {
            WebElement element = driver.findElement(
                    By.cssSelector("[formcontrolname='" + formControlName + "']"));
            return element.getAttribute("value").equals(expectedText);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if the field is required and validate it's not empty
     * @param formControlName The formcontrolname attribute value
     * @return boolean indicating if field is valid
     */
    public boolean validateRequiredField(String formControlName) {
        try {
            WebElement element = driver.findElement(
                    By.cssSelector("[formcontrolname='" + formControlName + "']"));

            // Check if field is required
            boolean isRequired = element.getAttribute("required") != null;

            if (isRequired) {
                String value = element.getAttribute("value");
                return value != null && !value.trim().isEmpty();
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}