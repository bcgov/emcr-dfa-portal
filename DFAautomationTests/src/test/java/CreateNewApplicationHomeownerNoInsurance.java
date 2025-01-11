import dfa.CustomWebDriverManager;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static dfa.CustomWebDriverManager.getDriver;

public class CreateNewApplicationHomeownerNoInsurance {


    private WebDriver driver;


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

        Login login = new Login();
        login.test();

        Thread.sleep(4000);
        CreateNewApplicationHomeownerNoInsurance createAp = new CreateNewApplicationHomeownerNoInsurance();
        createAp.createAppl(element, driverWait, driver);

        //TO DO - Profile verification
        Thread.sleep(1000);

        //Homeowner
        JavascriptExecutor js1 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='radio' and @value='Homeowner']")));
        js1.executeScript("arguments[0].click();", element);

        JavascriptExecutor js2 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='radio' and @value='No']")));
        js2.executeScript("arguments[0].click();", element);
        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'To qualify for DFA you must have occupied the property as your principal residence')]")));

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

        // Date of damage
//        WebElement dateInput = driverWait.until(ExpectedConditions.elementToBeClickable(
//                By.xpath("//input[@formcontrolname='damageFromDate']")));
//        dateInput.clear();
//        dateInput.sendKeys("10/19/2024");
// // Optional: Send TAB key to trigger any onBlur validation
//        dateInput.sendKeys(Keys.TAB);
//        dateInput.sendKeys(Keys.TAB);

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

        Thread.sleep(2000);


//        JavascriptExecutor js16 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"mat-radio-3\"]/label/span[1]/span[1]")));
//        js16.executeScript("arguments[0].click();", element);
//
//        JavascriptExecutor js17 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"mat-radio-6\"]/label/span[1]/span[1]")));
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
//        Thread.sleep(1000);
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

        JavascriptExecutor js33 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Application Type ')]")));
        js33.executeScript("arguments[0].click();", element);

        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.elementToBeClickable(By.xpath("//*[contains(text(), 'Select an application type')]")));

        //Create Homeowner appl
//        JavascriptExecutor js39 = (JavascriptExecutor) driver;
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.id("canvas")));
//        js39.executeScript("arguments[0].click();", element);
//        Thread.sleep(1000);
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.id("mat-input-1")));
//        element.sendKeys("Test test");
//
//        element = driverWait
//                .until(ExpectedConditions.presenceOfElementLocated(By.id("mat-input-3")));
//        element.sendKeys("Second Name");

        //print name under signature
        // Find all elements with placeholder "Print Name*"
        List<WebElement> elements = driverWait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("input[placeholder='Print Name*']")));

// Loop through each element and input "Tim John"
        for (WebElement elem : elements) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", elem);
            Thread.sleep(500);
            elem.clear();
            elem.sendKeys("Tim John");
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
        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.elementToBeClickable(By.xpath("//*[contains(text(), ' Next - Damaged Property ')]"))).click();

        Thread.sleep(1000);
        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.elementToBeClickable(By.xpath("//*[contains(text(), ' Yes, I have selected the correct')]"))).click();

        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.elementToBeClickable(By.xpath("//*[contains(text(), ' 123 FIRST STREET')]")));


        }

    public void createAppl(WebElement element, WebDriverWait driverWait, WebDriver driver) throws Exception{

        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.elementToBeClickable(By.xpath("//*[contains(text(), ' Create New Application ')]"))).click();

        }
    }
