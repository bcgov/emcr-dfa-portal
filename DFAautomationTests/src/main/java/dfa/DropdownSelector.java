package dfa;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class DropdownSelector {
    private WebDriver driver;
    private WebDriverWait driverWait;

    public DropdownSelector(WebDriver driver, int timeoutSeconds) {
        this.driver = driver;
        this.driverWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
    }

    /**
     * Select the first option from a dropdown by its label text
     * @param labelText The text in mat-label
     * @throws Exception if dropdown or option not found
     */
    public void selectFirstOptionByLabel(String labelText) throws Exception {
        try {
            // Wait a bit for any previous actions to complete
            Thread.sleep(1000);

//            // Find and click the dropdown trigger by label
//            WebElement dropdownTrigger = driverWait.until(ExpectedConditions.presenceOfElementLocated(
//                    By.xpath("//*[contains(text(), '" + labelText + "')]")));

            // Find and click the dropdown trigger using an improved XPath
            WebElement dropdownTrigger = driverWait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//mat-label[normalize-space()='" + labelText.replace("*", "").trim() + "']" +
                            "/ancestor::mat-form-field//mat-select")));

            // Scroll into view
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", dropdownTrigger);
            Thread.sleep(500); // Wait for scroll

            // Click using JavaScript
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", dropdownTrigger);

            // Wait for and click the first option in the dropdown
            WebElement firstOption = driverWait.until(ExpectedConditions.elementToBeClickable(
                    By.cssSelector("mat-option:first-of-type")));
            firstOption.click();

        } catch (Exception e) {
            throw new Exception("Failed to select first option from dropdown '" + labelText + "': " + e.getMessage());
        }
    }

    /**
     * Select a specific option from dropdown by its text
     * @param labelText The text in mat-label
     * @param optionText The text of the option to select
     * @throws Exception if dropdown or option not found
     */
    public void selectOptionByText(String labelText, String optionText) throws Exception {
        try {
            // Wait a bit for any previous actions to complete
            Thread.sleep(1000);

            // Find and click the dropdown trigger by label
            WebElement dropdownTrigger = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                    By.xpath("//mat-label[contains(text(), '" + labelText + "')]" +
                            "/ancestor::mat-form-field")));

            // Scroll into view
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", dropdownTrigger);
            Thread.sleep(500); // Wait for scroll

            // Click using JavaScript
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", dropdownTrigger);
            Thread.sleep(500); // Wait for scroll

            // Wait for and click the specific option
            WebElement option = driverWait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//mat-option//span[contains(text(), '" + optionText + "')]")));
            option.click();

        } catch (Exception e) {
            throw new Exception("Failed to select option '" + optionText + "' from dropdown '" + labelText + "': " + e.getMessage());
        }
    }

    /**
     * Verify selected option in dropdown
     * @param labelText The text in mat-label
     * @param expectedText Expected selected text
     * @return boolean indicating if correct option is selected
     */
    public boolean verifySelectedOption(String labelText, String expectedText) {
        try {
            WebElement selectedValue = driver.findElement(
                    By.xpath("//mat-label[contains(text(), '" + labelText + "')]" +
                            "/ancestor::mat-form-field//mat-select//span[contains(@class, 'mat-select-value-text')]"));
            return selectedValue.getText().trim().equals(expectedText);
        } catch (Exception e) {
            return false;
        }
    }
}
