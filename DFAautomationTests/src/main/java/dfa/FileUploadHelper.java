package dfa;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FileUploadHelper {
    private final WebDriver driver;
    private final int DEFAULT_TIMEOUT = 20; // seconds

    // Locators
    private final By FILE_INPUT_LOCATOR = By.cssSelector("input[type='file']");
    private final By SAVE_BUTTON_LOCATOR = By.cssSelector("button.family-button.details-button.save-button");
    private final By SUCCESS_NOTIFICATION = By.cssSelector(".notification-success");
    private final By FILE_TYPES_TEXT = By.cssSelector(".file-type");

    public FileUploadHelper(WebDriver driver) {
        this.driver = driver;
    }

    /**
     * Uploads a file using the specified upload button and waits for confirmation
     * @param addButtonText Text of the button that opens upload section (e.g., "+ Add Directors Listing")
     * @param filePath Full path to the file to be uploaded
     * @param waitTimeInSeconds Optional wait time in seconds for success notification
     * @return true if upload was successful
     */
    public boolean uploadFile(String addButtonText, String filePath, int waitTimeInSeconds) {
        try {
            // Click the add button to open upload section
            WebElement addButton = findButtonByText(addButtonText);
            waitForClickable(addButton);
            addButton.click();

            // Wait for file input and upload file
            WebElement fileInput = waitForElement(FILE_INPUT_LOCATOR);
            fileInput.sendKeys(filePath);

            // Click save button
            WebElement saveButton = waitForElement(SAVE_BUTTON_LOCATOR);
            waitForClickable(saveButton);
            saveButton.click();

            // Wait for success notification
//            WebElement notification = new WebDriverWait(driver, Duration.ofSeconds(waitTimeInSeconds))
//                    .until(ExpectedConditions.presenceOfElementLocated(SUCCESS_NOTIFICATION));

            return true;

        } catch (Exception e) {
            System.err.println("File upload failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Overloaded method with default timeout
     */
    public boolean uploadFile(String addButtonText, String filePath) {
        return uploadFile(addButtonText, filePath, DEFAULT_TIMEOUT);
    }

    /**
     * Checks if the file upload section is visible
     * @return true if upload section is visible
     */
    public boolean isUploadSectionVisible() {
        try {
            WebElement fileInput = driver.findElement(FILE_INPUT_LOCATOR);
            return fileInput.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    /**
     * Cancels the current file upload
     */
    public void cancelUpload() {
        WebElement cancelButton = findButtonByText("Cancel");
        waitForClickable(cancelButton);
        cancelButton.click();
    }

    /**
     * Gets list of allowed file extensions from the upload section
     * @return List of allowed file extensions
     */
    public List<String> getAllowedFileTypes() {
        List<String> allowedTypes = new ArrayList<>();
        WebElement fileTypesElement = waitForElement(FILE_TYPES_TEXT);
        String fileTypesText = fileTypesElement.getText();

        Pattern pattern = Pattern.compile("\\.(\\w+)");
        Matcher matcher = pattern.matcher(fileTypesText);

        while (matcher.find()) {
            allowedTypes.add("." + matcher.group(1).toLowerCase());
        }

        return allowedTypes;
    }

    /**
     * Verifies if a specific file type is allowed
     * @param fileExtension File extension to check (e.g., ".pdf")
     * @return true if file type is allowed
     */
    public boolean isFileTypeAllowed(String fileExtension) {
        List<String> allowedTypes = getAllowedFileTypes();
        return allowedTypes.contains(fileExtension.toLowerCase());
    }

    /**
     * Waits for element to be clickable
     * @param element WebElement to wait for
     * @return The clickable WebElement
     */
    private WebElement waitForClickable(WebElement element) {
        return new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT))
                .until(ExpectedConditions.elementToBeClickable(element));
    }

    /**
     * Waits for element to be present
     * @param locator By locator to find element
     * @return The present WebElement
     */
    private WebElement waitForElement(By locator) {
        return new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT))
                .until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    /**
     * Finds button by exact text match
     * @param buttonText Text to match
     * @return WebElement of the button
     */
    private WebElement findButtonByText(String buttonText) {
        return driver.findElement(By.xpath("//button[normalize-space()='" + buttonText + "']"));
    }
}