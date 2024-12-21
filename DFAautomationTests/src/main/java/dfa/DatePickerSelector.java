package dfa;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class DatePickerSelector {
    private WebDriver driver;
    private WebDriverWait driverWait;

    public DatePickerSelector(WebDriver driver, int timeoutSeconds) {
        this.driver = driver;
        this.driverWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
    }

    /**
     * Select a date from Material Date Picker based on label text
     * @param labelText The label text of the date picker (e.g. "From date")
     * @param dateArray Array containing [year, month, day] (e.g. ["2024", "OCT", "19"])
     * @throws Exception if date picker or date elements not found
     */
    public void selectDateByLabel(String labelText, String[] dateArray) throws Exception {
        if (dateArray.length != 3) {
            throw new IllegalArgumentException("Date array must contain [year, month, day]");
        }

        try {
            // 1. Find and scroll to the date picker based on label
            WebElement datePickerToggle = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                    By.xpath("//mat-label[contains(text(), '" + labelText + "')]" +
                            "/ancestor::mat-form-field//mat-datepicker-toggle/button")));

            // Scroll into view
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", datePickerToggle);
            Thread.sleep(500); // Wait for scroll to settle

            // Click the date picker toggle
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", datePickerToggle);

            // 2. Wait for calendar to be visible
            driverWait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.cssSelector("mat-calendar")));

            // 3. Click the month-year button to open month selection view
            WebElement periodButton = driverWait.until(ExpectedConditions.elementToBeClickable(
                    By.cssSelector(".mat-calendar-period-button")));
            periodButton.click();

            // 4. Select year
            WebElement yearElement = driverWait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//span[contains(@class, 'mat-calendar-body-cell-content') and contains(text(), ' "
                            + dateArray[0] + " ')]")));
            yearElement.click();

            // 5. Select month
            WebElement monthElement = driverWait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//span[contains(@class, 'mat-calendar-body-cell-content') and contains(text(), ' "
                            + dateArray[1] + " ')]")));
            monthElement.click();

            // 6. Select day
            WebElement dayElement = driverWait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//span[contains(@class, 'mat-calendar-body-cell-content') and contains(text(), ' "
                            + dateArray[2] + " ')]")));
            dayElement.click();

        } catch (Exception e) {
            throw new Exception("Failed to select date: " + e.getMessage());
        }
    }

    /**
     * Checks if the date was successfully selected by verifying the input value
     * @param labelText The label text of the date picker
     * @param expectedDate Expected date in MM/DD/YYYY format
     * @return boolean indicating if date was selected correctly
     */
    public boolean verifyDateSelection(String labelText, String expectedDate) {
        try {
            WebElement dateInput = driver.findElement(
                    By.xpath("//mat-label[contains(text(), '" + labelText + "')]" +
                            "/ancestor::mat-form-field//input"));
            return dateInput.getAttribute("value").equals(expectedDate);
        } catch (Exception e) {
            return false;
        }
    }
}
