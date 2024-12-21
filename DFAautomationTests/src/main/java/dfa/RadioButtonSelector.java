package dfa;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class RadioButtonSelector {
    private final WebDriver driver;

    public RadioButtonSelector(WebDriver driver) {
        this.driver = driver;
    }

    /**
     * Selects a radio button based on partial question text and option text
     * @param questionContains Partial text of the question to match
     * @param optionContains Text of the option to select
     * @throws Exception if question or option not found
     */
    public void selectRadioButtonByQuestionAndOption(String questionContains, String optionContains) throws Exception {
        // First find the question container that has the specific question text
        WebElement questionContainer = driver.findElement(By.xpath(
                "//p[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '"
                        + questionContains.toLowerCase() + "')]/parent::div"));
        // Scroll to the element
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", questionContainer);

        // Within that container, find the radio group
        WebElement radioGroup = questionContainer.findElement(By.tagName("mat-radio-group"));

        // Find all radio buttons within the group
        List<WebElement> radioButtons = radioGroup.findElements(By.tagName("mat-radio-button"));

        // Look through each radio button to find matching option
        boolean found = false;
        for (WebElement radioButton : radioButtons) {
            String labelText = radioButton.findElement(By.tagName("label")).getText().trim();
            if (labelText.toLowerCase().contains(optionContains.toLowerCase())) {
                // Click the input element within the radio button
                WebElement input = radioButton.findElement(By.tagName("input"));
                if (!input.isSelected()) {
                    // Use JavaScript click for better reliability
                    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", input);
                }
                found = true;
                break;
            }
        }

        if (!found) {
            throw new Exception("Could not find radio button option containing text: " + optionContains);
        }
    }

    /**
     * Waits for radio buttons to be clickable before attempting selection
     * @param questionContains Partial text of the question
     * @param optionContains Text of the option to select
     * @param timeoutSeconds Maximum time to wait
     */
    public void selectRadioButtonWithWait(String questionContains, String optionContains, int timeoutSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
        wait.until(ExpectedConditions.elementToBeClickable(By.tagName("mat-radio-button")));

        try {
            selectRadioButtonByQuestionAndOption(questionContains, optionContains);
        } catch (Exception e) {
            throw new RuntimeException("Failed to select radio button: " + e.getMessage());
        }
    }
}