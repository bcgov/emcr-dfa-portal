import dfa.*;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static dfa.CustomWebDriverManager.getDriver;

public class CharitableOrganizationNoInsurance {

    private WebDriver driver;

//commented to maintain the browser after test run
//    @After
//    public void tearDown() {
//        driver.close();
//        driver.quit();
//    }
//    @AfterClass
//    public static void afterClass() {
//        CustomWebDriverManager.instance = null;
//    }


    @Test
    public void test() throws Exception {
        driver = getDriver();
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        WebElement element = CustomWebDriverManager.getElement();
        CustomWebDriverManager.getElements();

        // Create an instance of the radio button selector
        RadioButtonSelector radioselector = new RadioButtonSelector(driver);
        // Create an instance of the selector
        CheckboxSelector chkselector = new CheckboxSelector(driver);

        // Create an instance of the selector with 10 second timeout
        DatePickerSelector dateSelector = new DatePickerSelector(driver, 10);

        // Create an instance of the helper with 10 second timeout
        TextInputHelper textHelper = new TextInputHelper(driver, 10);
        FileUploadHelper fileUploader = new FileUploadHelper(driver);

        // Create an instance of the helper with 20 second timeout
        DropdownSelector dropdownHelper = new DropdownSelector(driver, 20);

        /// ///

        Login login = new Login();
        login.test();

        Thread.sleep(4000);
        CreateNewApplicationHomeownerNoInsurance createAp = new CreateNewApplicationHomeownerNoInsurance();
        createAp.createAppl(element, driverWait, driver);

        //TO DO - Profile verification
        Thread.sleep(1000);

        //Small business
        JavascriptExecutor js1 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='radio' and @value='CharitableOrganization']")));
        js1.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor js2 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='radio' and @value='No']")));
        js2.executeScript("arguments[0].click();", element);

        //What is the damaged property address?
        JavascriptExecutor js12 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Same as my profile address')]")));
        js12.executeScript("arguments[0].click();", element);

        Thread.sleep(1000);
//        JavascriptExecutor js13 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-prescreening/div/app-component-wrapper/prescreening/mat-card/mat-card-content/form/div[2]/div/mat-form-field[1]/div/div[1]/div[4]/mat-datepicker-toggle/button")));
//        js13.executeScript("arguments[0].click();", element);
//
//        JavascriptExecutor js14 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div[2]/div/mat-datepicker-content/div[2]/mat-calendar/div/mat-month-view/table/tbody/tr[1]/td[3]/button/div[1]")));
//        js14.executeScript("arguments[0].click();", element);

        // Scroll the date picker into view before clicking
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("mat-datepicker-toggle button")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        Thread.sleep(500); // Give the page a moment to settle after scrolling

// Now try to click
        element = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("mat-datepicker-toggle button")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

// 2. Wait for calendar to be visible
        driverWait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("mat-calendar")));

// 3. Click the month-year button to open month selection view
        element = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".mat-calendar-period-button")));
        element.click();

// 3. Select year 2024
        element = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[contains(@class, 'mat-calendar-body-cell-content') and contains(text(), ' 2024 ')]")));
        element.click();

// 4. Select month OCT
        element = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[contains(@class, 'mat-calendar-body-cell-content') and contains(text(), ' OCT ')]")));
        element.click();

// 5. Select date 19
        element = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[contains(@class, 'mat-calendar-body-cell-content') and contains(text(), ' 19 ')]")));
        element.click();

        Thread.sleep(1000);
        JavascriptExecutor js15 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Matching Disaster Event')]")));
        js15.executeScript("arguments[0].click();", element);

        // Wait for and click the first option in the dropdown
        element = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("mat-option:first-of-type")));
        element.click();

//        JavascriptExecutor js16 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"mat-option-0\"]/span")));
//        js16.executeScript("arguments[0].click();", element);
//
//        JavascriptExecutor js17 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"mat-radio-3\"]/label/span[1]/span[1]")));
//        js17.executeScript("arguments[0].click();", element);
//
//        JavascriptExecutor js18 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"mat-radio-6\"]/label/span[1]/span[1]")));
//        js18.executeScript("arguments[0].click();", element);



        // 1. Select "Yes" for "Are the damages and losses to your property caused by the disaster event?"
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("label[for='mat-radio-3-input']")));
        ((JavascriptExecutor) driver).executeScript("document.querySelector('label[for=\"mat-radio-3-input\"]').click()");

// 2. Select "Yes" for "Excluding luxury/non-essential items & landscaping, do your losses total more than $1,000?"
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("label[for='mat-radio-6-input']")));
        ((JavascriptExecutor) driver).executeScript("document.querySelector('label[for=\"mat-radio-6-input\"]').click()");

// 3. Select "No" for "Did your insurance company cover any or all damages caused by the event?"
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("label[for='mat-radio-19-input']")));
        ((JavascriptExecutor) driver).executeScript("document.querySelector('label[for=\"mat-radio-19-input\"]').click()");

        Thread.sleep(1000);
        JavascriptExecutor js3 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit Answers ')]")));
        js3.executeScript("arguments[0].click();", element);

        JavascriptExecutor js31 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to apply now ')]")));
        js31.executeScript("arguments[0].click();", element);

        //Notice
        Thread.sleep(1000);
        JavascriptExecutor js32 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Verify Your Profile ')]")));
        js32.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
//        JavascriptExecutor js36 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-start/div/mat-horizontal-stepper/div/div[2]/div[2]/app-component-wrapper/app-profile-verification/mat-card/mat-card-content/form/mat-card-content[3]/div[2]/mat-radio-group/mat-radio-button[1]/label/span[1]/span[1]")));
//        js36.executeScript("arguments[0].click();", element);
//        Thread.sleep(1000);
//        JavascriptExecutor js35 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-start/div/mat-horizontal-stepper/div/div[2]/div[2]/app-component-wrapper/app-profile-verification/mat-card/mat-card-content/form/mat-card-content[5]/div[2]/div[2]/div[2]/mat-form-field/div/div[1]/div[3]/input")));
//        js35.executeScript("arguments[0].click();", element);
//        js35.executeScript("arguments[0].value='test@test.com'", element);
//        element.clear();
//        element.sendKeys("test@test.com");

        // Enter email in first input field
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("input[formcontrolname='email']")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        Thread.sleep(500);
        element.clear();
        element.sendKeys("test@test.com");

// Enter same email in confirmation field
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("input[formcontrolname='confirmEmail']")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        Thread.sleep(500);
        element.clear();
        element.sendKeys("test@test.com");

        Thread.sleep(1000);
        JavascriptExecutor js33 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Application Type ')]")));
        js33.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.elementToBeClickable(By.xpath("//*[contains(text(), 'Select an application type')]")));
        Thread.sleep(1000);
        //Create Char org appl

//        JavascriptExecutor js39 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.id("canvas")));
//        js39.executeScript("arguments[0].click();", element);
//        Thread.sleep(1000);

        //print name under signature
        // Find all elements with placeholder "Print Name*"
        List<WebElement> elements = driverWait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("input[placeholder='Print Name*']")));

// Loop through each element and input "Geethu"
        for (WebElement elem : elements) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", elem);
            Thread.sleep(500);
            elem.clear();
            elem.sendKeys("Geethu");
        }

        List<WebElement> canvasElements = driverWait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.id("canvas")));

        for (WebElement elem : canvasElements) {
            elem.click();
        }

        Thread.sleep(1000);

        ((JavascriptExecutor) driver)
                .executeScript("window.scrollTo(0, document.body.scrollHeight)");
        Thread.sleep(1000);

        JavascriptExecutor jse = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Damaged Property ')]")));
        jse.executeScript("arguments[0].click();", element);

        Thread.sleep(1000);

        JavascriptExecutor jsf = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I have selected the correct')]")));
        jsf.executeScript("arguments[0].click();", element);
        Thread.sleep(2000);
        ((JavascriptExecutor) driver)
                .executeScript("window.scrollTo(0, document.body.scrollHeight)");
        Thread.sleep(1000);

        JavascriptExecutor jse2 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Damaged Property ')]")));
        jse2.executeScript("arguments[0].click();", element);

        // TODO: Remove comment - Completed until this

        // wait for address to be populated
//        SmallBusinessNoInsurance addQuestion = new SmallBusinessNoInsurance();
//        addQuestion.addressAndQuestion(element, driverWait, driver);

        // wait for address to be populated
        // TODO: Later change it to check the question as address is dynamic
        Thread.sleep(1000);
        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '4000 SEYMOUR PLACE')]")));
//radio button
        Thread.sleep(1000);
        // Does the charitable/non-profit organization provide a benefit or service to the community?* - Yes
        radioselector.selectRadioButtonByQuestionAndOption("Does the charitable", "Yes");
        Thread.sleep(500);
        // Has the charitable/non-profit organization been in existence for at least 12 months?* - Yes
        radioselector.selectRadioButtonByQuestionAndOption("Has the charitable", "Yes");
        Thread.sleep(500);
        // Is the charitable/non-profit organization registered under the BC Societies Act?* - Yes
        radioselector.selectRadioButtonByQuestionAndOption("Is the charitable/non-profit", "Yes");
        Thread.sleep(500);

        // Enter name input field
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("input[formcontrolname='businessLegalName']")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        Thread.sleep(500);
        element.clear();
        element.sendKeys("Final Charitable Org One");
        Thread.sleep(500);

        // Is this address on a First Nations reserve?* - No
        radioselector.selectRadioButtonByQuestionAndOption("Is this address", "No");



        JavascriptExecutor jsw = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Cause of Damage ')]")));
        jsw.executeScript("arguments[0].click();", element);

        Thread.sleep(2000);

        // checkbox selection
        try {
            String[] options = {"Flood", "Storm"};
            chkselector.selectCheckboxesByQuestionAndOptions("Select the cause", options);
        } catch (Exception e) {
            System.out.println("Failed to select checkboxes: " + e.getMessage());
        }

        // Date of Damage to date selection
        String[] date = {"2024", "OCT", "20"};
        dateSelector.selectDateByLabel("To date", date);

        // Enter text in the brief description textarea
        textHelper.enterTextByFormControl("briefDescription", "Damage caused by flood affecting the ground floor...");

        Thread.sleep(1000);
        // Does the charitable/non-profit organization provide a benefit or service to the community?* - Yes
        radioselector.selectRadioButtonByQuestionAndOption("In the past, have you submitted a DFA application ", "No");
//        //Damage property
//        SmallBusinessNoInsurance damage = new SmallBusinessNoInsurance();
//        damage.damgeProp(element, driverWait, driver);

        JavascriptExecutor js6 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Occupants ')]")));
        js6.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);

        //Add secondary applicant
        // Wait for the button to be clickable
        WebElement addButton5 = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[@class='mdc-button__label' and contains(text(), ' + Add secondary applicant ')]")));

        // Scroll into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addButton5);
        Thread.sleep(500); // Wait for scroll

        // Click using JavaScript for reliability
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", addButton5);
        // Enter name input field
        Thread.sleep(1000); // Wait for scroll
        dropdownHelper.selectFirstOptionByLabel("Applicant type*");

        textHelper.enterTextByFormControl("firstName", "Geethu");
        textHelper.enterTextByFormControl("lastName", "Nair");
        textHelper.enterTextByFormControl("phoneNumber", "1232343456");
        textHelper.enterTextByFormControl("email", "text@gmail.com");


        // Wait for the Save button using multiple identifying classes
        WebElement saveButton5 = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(@class, 'family-button') and contains(@class, 'save-button')]")));

// Scroll the button into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", saveButton5);
        Thread.sleep(500); // Wait for scroll to complete

// Click using JavaScript for reliability
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", saveButton5);

// Wait for any post-save operations to complete
        Thread.sleep(1000);

// Wait for any post-save operations to complete
        Thread.sleep(1000);



        // Wait for the button to be clickable
        WebElement addButton = driverWait.until(ExpectedConditions.elementToBeClickable(
         By.xpath("//span[@class='mdc-button__label' and contains(text(), ' + Add Other Contact ')]")));

        // Scroll into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addButton);
        Thread.sleep(500); // Wait for scroll

        // Click using JavaScript for reliability
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", addButton);
        // Enter name input field

        textHelper.enterTextByFormControl("firstName", "Geethu");
        textHelper.enterTextByFormControl("lastName", "Nair");
        textHelper.enterTextByFormControl("phoneNumber", "1232343456");
        textHelper.enterTextByFormControl("email", "text@gmail.com");


        // Wait for the Save button using multiple identifying classes
        WebElement saveButton = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(@class, 'family-button') and contains(@class, 'save-button')]")));

// Scroll the button into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", saveButton);
        Thread.sleep(500); // Wait for scroll to complete

// Click using JavaScript for reliability
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", saveButton);

// Wait for any post-save operations to complete
        Thread.sleep(1000);

// Wait for any post-save operations to complete
        Thread.sleep(1000);

        //add occupant for business
//        SmallBusinessNoInsurance ocupantsSmall = new SmallBusinessNoInsurance();
//        ocupantsSmall.ocupants(element, driverWait, driver);

        JavascriptExecutor js7 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Clean Up Log ')]")));
        js7.executeScript("arguments[0].click();", element);

        //Add to clean up log
        // Wait for the Add to clean up log button to be clickable
        WebElement addToLogButton = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[@class='mdc-button__label' and contains(text(), ' + Add to clean up log ')]")));

        // Scroll into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addToLogButton);
        Thread.sleep(500); // Wait for scroll to complete

        // Click using JavaScript for reliability
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", addToLogButton);

        // Wait for any post-click operations to complete
        Thread.sleep(1000);

        //select the date // Create array for the date

        String[] date1 = {"2024", "OCT", "20"};


        // Find and interact with the date picker - just make sure you have the correct label text
        dateSelector.selectDateByLabel("Date", date1);
        Thread.sleep(1000);

        // name of family member

        textHelper.enterTextByFormControl("name", "Tom smith");

        // hours
        textHelper.enterTextByFormControl("hours", "6");
        // description
        textHelper.enterTextByFormControl("description", "Relocation");

        // Wait for the Save button using its classes
        WebElement saveButton3 = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(@class, 'addcleanup-button') and contains(@class, 'save-button')]")));

// Scroll into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", saveButton3);
        Thread.sleep(500); // Wait for scroll to complete

// Click using JavaScript for reliability
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", saveButton3);

// Wait for any post-save operations to complete
        Thread.sleep(1000);

        JavascriptExecutor js30 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Damaged Items By Room ')]")));
        js30.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);

        // Wait for the Add Room & Items button to be clickable
        WebElement addRoomButton = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[@class='mdc-button__label' and contains(text(), ' + Add Room & Items ')]")));

// Scroll into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addRoomButton);
        Thread.sleep(500); // Wait for scroll to complete

// Click using JavaScript for reliability
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", addRoomButton);

// Wait for any post-click operations to complete
        Thread.sleep(1000);

        // Select the first option from the Full-time occupant dropdown
        dropdownHelper.selectFirstOptionByLabel("Select a room type");
//        JavascriptExecutor js16 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Select a room type')]")));
//        js16.executeScript("arguments[0].click();", element);
//
//        // Wait for and click the first option in the dropdown
//        element = driverWait.until(ExpectedConditions.elementToBeClickable(
//                By.cssSelector("mat-option:first-of-type")));
//        element.click();

        // enter the text for damaged item
        textHelper.enterTextByFormControl("description", "bathroom accessories");

        // Wait for the Save button using multiple identifying classes, same as previous pattern
        WebElement saveButton2 = driverWait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(@class, 'family-button') and contains(@class, 'save-button')]")));

        // Scroll the button into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", saveButton2);
        Thread.sleep(500); // Wait for scroll to complete

        // Click using JavaScript for reliability
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", saveButton2);

        // Wait for any post-save operations to complete
        Thread.sleep(1000);

//        // Date of clean up log
//        String[] dateArray = {"2024", "OCT", "19"};
//        dateSelector.selectDateByLabel("date", dateArray);  // Using the formcontrolname instead of label text
//
//        // Name of the family
//        try {
//            String name = "John Smith"; // The data you want to enter
//            textHelper.enterTextByFormControl("familyMemberName", "John Smith");
//        } catch (Exception e) {
//            System.out.println("Failed to enter family member name: " + e.getMessage());
//        }

//        //CleanUp logs
//        SmallBusinessNoInsurance cleanLogSmall = new SmallBusinessNoInsurance();
//        cleanLogSmall.cleanUpLogSmallBusiness(element, driverWait, driver);

        //Damaged Items by Room
//        SmallBusinessNoInsurance damageItem = new SmallBusinessNoInsurance();
//        damageItem.damageItemRoomSmall(element, driverWait, driver);

        JavascriptExecutor js37 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Supporting Documents ')]")));
        js37.executeScript("arguments[0].click();", element);

//        WebElement addButton2 = driverWait.until(ExpectedConditions.elementToBeClickable(
//                By.xpath("//span[@class='mdc-button__label' and contains(text(), ' + Add Directors Listing ')]")));
//
//// Scroll into view
//        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addButton2);
//        Thread.sleep(500); // Wait for scroll to complete
//
//// Click using JavaScript for reliability
//        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", addButton2);
//
//// Wait for any post-click operations to complete
//        Thread.sleep(1000);
//
//        // Find and click the browse link
//        WebElement browseLink = driverWait.until(ExpectedConditions.elementToBeClickable(
//                By.xpath("//span[contains(@class, 'browse-link') or contains(text(), 'browse')]")));
//
//        // Scroll into view
//        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", browseLink);
//        Thread.sleep(500); // Wait for scroll
//
//        // Find the hidden file input element
//        WebElement fileInput = driver.findElement(By.xpath("//input[@type='file']"));
//
//        // Send the file path to the input element
//        String filePath = "C:\\Users\\GeethuN.QSL\\OneDrive - Quartech Systems Limited\\Desktop\\quartech\\emcr-dfa-portal\\DFAautomationTests\\dummy.pdf"
//        fileInput.sendKeys(filePath);

        String filePath = System.getProperty("user.dir") + '/' + "dummy";
        fileUploader.uploadFile(
                "+ Add Directors Listing",
                filePath+".pdf",
                20  // wait up to 15 seconds for success notification
        );
        Thread.sleep(2000);
        fileUploader.uploadFile(
                "+ Add Registration Proof",
                filePath+"2.pdf",
                20  // wait up to 15 seconds for success notification
        );
        Thread.sleep(2000);
        fileUploader.uploadFile(
                "+ Add Structure and Purpose",
                filePath+"3.pdf",
                20  // wait up to 15 seconds for success notification
        );
        Thread.sleep(2000);
        fileUploader.uploadFile(
                "+ Add Lease Agreement (if applicable)",
                filePath+"4.pdf",
                20  // wait up to 15 seconds for success notification
        );



//// Wait for file to be uploaded
//        Thread.sleep(1000);
//
//        //Add insurance template docs
//        Thread.sleep(2000);
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Insurance Template ')]")));
//        element.click();
//
//        Thread.sleep(1000);
//        WebElement uploadInsur = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("fileDrop")));
//        uploadInsur.sendKeys(System.getProperty("user.dir") + '/' + "dummy.pdf");
//
//        //Save
//        JavascriptExecutor js38= (JavascriptExecutor) driver;
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[6]/app-component-wrapper/app-supporting-documents/mat-card/mat-card-content/div[3]/div/app-dfa-attachment/form/div/mat-card/div[2]/div[2]/button")));
//        js38.executeScript("arguments[0].click();", element);
//        Thread.sleep(2000);
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Directors Listing ')]")));
//        element.click();
//
//        Thread.sleep(1000);
//        WebElement uploadRent = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("fileDrop")));
//        uploadRent.sendKeys(System.getProperty("user.dir") + '/' + "testDFA.xlsx");
//
//        //Save
//        JavascriptExecutor js381= (JavascriptExecutor) driver;
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[6]/app-component-wrapper/app-supporting-documents/mat-card/mat-card-content/div[4]/div/app-dfa-attachment/form/div/mat-card/div[2]/div[2]/button/span[1]")));
//        js381.executeScript("arguments[0].click();", element);
//
//        Thread.sleep(2000);
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Registration Proof ')]")));
//        element.click();
//
//        Thread.sleep(1000);
//        WebElement uploadIdentif = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("fileDrop")));
//        uploadIdentif.sendKeys(System.getProperty("user.dir") + '/' + "testPPXDFA.pptx");
//
//        //Save
//        Thread.sleep(1000);
//        JavascriptExecutor js382= (JavascriptExecutor) driver;
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[6]/app-component-wrapper/app-supporting-documents/mat-card/mat-card-content/div[5]/div/app-dfa-attachment/form/div/mat-card/div[2]/div[2]/button")));
//        js382.executeScript("arguments[0].click();", element);
//        Thread.sleep(2000);
//
//        JavascriptExecutor jsa= (JavascriptExecutor) driver;
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Structure and Purpose ')]")));
//        jsa.executeScript("arguments[0].click();", element);
//
//        Thread.sleep(1000);
//        WebElement uploadStr = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("fileDrop")));
//        uploadStr.sendKeys(System.getProperty("user.dir") + '/' + "AddStructureAndPurpose.docx");
//
//        //Save
//        Thread.sleep(1000);
//        JavascriptExecutor js383= (JavascriptExecutor) driver;
//        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[6]/app-component-wrapper/app-supporting-documents/mat-card/mat-card-content/div[6]/div/app-dfa-attachment/form/div/mat-card/div[2]/div[2]/button")));
//        js383.executeScript("arguments[0].click();", element);
//        Thread.sleep(2000);

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Review Submission ')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

        Thread.sleep(3000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Sign & Submit ')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

        Thread.sleep(3000);
        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Declaration')]")));
        Thread.sleep(1500);

        //print name under signature
        // Find all elements with placeholder "Print Name*"
        List<WebElement> nameElements = driverWait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("input[placeholder='Print Name*']")));

// Loop through each element and input "Geethu"
        for (WebElement elem : nameElements) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", elem);
            Thread.sleep(500);
            elem.clear();
            elem.sendKeys("Geethu");
        }

        List<WebElement> canvas2Elements = driverWait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.id("canvas")));

        for (WebElement elem : canvas2Elements) {
            elem.click();
        }

        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Submit ')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

        Thread.sleep(1000);
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I want to submit my application. ')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

//        //Sign and Submit
//        HomeOwnerApplicationDetails signSubmit = new HomeOwnerApplicationDetails();
//        signSubmit.submit(element, driverWait, driver);

    }
}
