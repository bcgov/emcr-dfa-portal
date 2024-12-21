package dfa;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class CheckboxSelector {
    private WebDriver driver;

    public CheckboxSelector(WebDriver driver) {
        this.driver = driver;
    }

    /**
     * Selects multiple checkboxes based on question text and array of options
     * @param questionContains Partial text of the question to match
     * @param optionsToSelect Array of option texts to select
     * @throws Exception if question or any option not found
     */
    public void selectCheckboxesByQuestionAndOptions(String questionContains, String[] optionsToSelect) throws Exception {
        // Find the question container with the specific question text
        WebElement questionContainer = driver.findElement(By.xpath(
                "//p[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '"
                        + questionContains.toLowerCase() + "')]/parent::div"));

        // Scroll to the element
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", questionContainer);

        // Find all checkboxes within the container
        List<WebElement> checkboxes = questionContainer.findElements(By.tagName("mat-checkbox"));

        // Keep track of which options we've found
        Set<String> foundOptions = new HashSet<>();

        // Go through each checkbox
        for (WebElement checkbox : checkboxes) {
            String labelText = checkbox.findElement(By.tagName("label")).getText().trim();

            // Check if this checkbox matches any of our desired options
            for (String optionText : optionsToSelect) {
                if (labelText.toLowerCase().contains(optionText.toLowerCase())) {
                    // Get the input element
                    WebElement input = checkbox.findElement(By.tagName("input"));

                    // Only click if not already selected
                    if (!input.isSelected()) {
                        // Use JavaScript click for better reliability
                        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", input);
                    }

                    foundOptions.add(optionText);
                    break;
                }
            }
        }

        // Check if we found all options
        if (foundOptions.size() < optionsToSelect.length) {
            Set<String> missingOptions = new HashSet<>(Arrays.asList(optionsToSelect));
            missingOptions.removeAll(foundOptions);
            throw new Exception("Could not find checkbox options: " + String.join(", ", missingOptions));
        }
    }

    /**
     * Handle "Other" checkbox with text input when needed
     * @param otherOptionText Text to enter in the "Other" input field
     * @throws Exception if Other checkbox or input field not found
     */
    public void selectOtherCheckboxWithText(String otherOptionText) throws Exception {
        // Find and click the "Other" checkbox
        WebElement otherCheckbox = driver.findElement(By.xpath(
                "//mat-checkbox//label[contains(text(), 'Other')]"));

        WebElement input = otherCheckbox.findElement(By.xpath("../.."))
                .findElement(By.tagName("input"));

        if (!input.isSelected()) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", input);
        }

        // Find and fill the associated text input
        WebElement textInput = driver.findElement(By.xpath(
                "//input[@formcontrolname='otherDamageText']"));
        textInput.clear();
        textInput.sendKeys(otherOptionText);
    }

    /**
     * Waits for checkboxes to be clickable before attempting selection
     * @param questionContains Partial text of the question
     * @param optionsToSelect Array of option texts to select
     * @param timeoutSeconds Maximum time to wait
     */
    public void selectCheckboxesWithWait(String questionContains, String[] optionsToSelect, int timeoutSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
        wait.until(ExpectedConditions.elementToBeClickable(By.tagName("mat-checkbox")));

        try {
            selectCheckboxesByQuestionAndOptions(questionContains, optionsToSelect);
        } catch (Exception e) {
            throw new RuntimeException("Failed to select checkboxes: " + e.getMessage());
        }
    }
}