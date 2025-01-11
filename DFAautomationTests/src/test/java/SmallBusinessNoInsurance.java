import dfa.CustomWebDriverManager;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import static dfa.CustomWebDriverManager.getDriver;

public class SmallBusinessNoInsurance {

    private WebDriver driver;


    @After
    public void tearDown() {
        driver.close();
        driver.quit();
    }
    @AfterClass
    public static void afterClass() {
        CustomWebDriverManager.instance = null;
    }


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

        //Small business
        JavascriptExecutor js1 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='radio' and @value='SmallBusinessOwner']")));
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
        JavascriptExecutor js13 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-prescreening/div/app-component-wrapper/prescreening/mat-card/mat-card-content/form/div[2]/div/mat-form-field[1]/div/div[1]/div[4]/mat-datepicker-toggle/button")));
        js13.executeScript("arguments[0].click();", element);

        JavascriptExecutor js14 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div[2]/div/mat-datepicker-content/div[2]/mat-calendar/div/mat-month-view/table/tbody/tr[1]/td[3]/button/div[1]")));
        js14.executeScript("arguments[0].click();", element);

        JavascriptExecutor js15 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Matching Disaster Event')]")));
        js15.executeScript("arguments[0].click();", element);

        JavascriptExecutor js16 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"mat-option-0\"]/span")));
        js16.executeScript("arguments[0].click();", element);

        JavascriptExecutor js17 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"mat-radio-3\"]/label/span[1]/span[1]")));
        js17.executeScript("arguments[0].click();", element);

        JavascriptExecutor js18 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"mat-radio-6\"]/label/span[1]/span[1]")));
        js18.executeScript("arguments[0].click();", element);

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
        JavascriptExecutor js36 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-start/div/mat-horizontal-stepper/div/div[2]/div[2]/app-component-wrapper/app-profile-verification/mat-card/mat-card-content/form/mat-card-content[3]/div[2]/mat-radio-group/mat-radio-button[1]/label/span[1]/span[1]")));
        js36.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor js35 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-start/div/mat-horizontal-stepper/div/div[2]/div[2]/app-component-wrapper/app-profile-verification/mat-card/mat-card-content/form/mat-card-content[5]/div[2]/div[2]/div[2]/mat-form-field/div/div[1]/div[3]/input")));
        js35.executeScript("arguments[0].click();", element);
        js35.executeScript("arguments[0].value='test@test.com'", element);
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
        //Crear Small business apl
        //General or Sole Proprietorship or DBA name
        JavascriptExecutor jsab = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='radio' and @value='General']")));
        Thread.sleep(1000);
        jsab.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor js39 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.id("canvas")));
        js39.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor jsa = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-start/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/apptype-insurance/mat-card/mat-card-content/form/div[3]/div[1]/app-signature/div/div[2]/div/mat-form-field/div/div[1]/div[3]/input")));
        jsa.executeScript("arguments[0].click();", element);
        element.sendKeys("Test test");
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.id("mat-input-9")));
        element.sendKeys("Second Name");
        Thread.sleep(1000);

        Thread.sleep(1000);
        ((JavascriptExecutor) driver)
                .executeScript("window.scrollTo(0, document.body.scrollHeight)");
        Thread.sleep(2000);
        JavascriptExecutor jse = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Damaged Property ')]")));
        jse.executeScript("arguments[0].click();", element);

        JavascriptExecutor jsf = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Yes, I have selected the correct')]")));
        jsf.executeScript("arguments[0].click();", element);

        //wait for address to be popolated
        SmallBusinessNoInsurance addQuestion = new SmallBusinessNoInsurance();
        addQuestion.addressAndQuestion(element, driverWait, driver);

        JavascriptExecutor jsw = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Cause of Damage ')]")));
        jsw.executeScript("arguments[0].click();", element);

        //Damage property
        SmallBusinessNoInsurance damage = new SmallBusinessNoInsurance();
        damage.damgeProp(element, driverWait, driver);

        JavascriptExecutor js6= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Occupants ')]")));
        js6.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);

        //add occupant for business
        SmallBusinessNoInsurance ocupantsSmall = new SmallBusinessNoInsurance();
        ocupantsSmall.ocupants(element, driverWait, driver);

        JavascriptExecutor js7= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Clean Up Log ')]")));
        js7.executeScript("arguments[0].click();", element);

        //CleanUp logs
        SmallBusinessNoInsurance cleanLogSmall = new SmallBusinessNoInsurance();
        cleanLogSmall.cleanUpLogSmallBusiness(element, driverWait, driver);

        JavascriptExecutor js30= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Damaged Items By Room ')]")));
        js30.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);


        //Damaged Items by Room
        SmallBusinessNoInsurance damageItem = new SmallBusinessNoInsurance();
        damageItem.damageItemRoomSmall(element, driverWait, driver);

        JavascriptExecutor js37= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Supporting Documents ')]")));
        js37.executeScript("arguments[0].click();", element);

        //Add insurance template
        SmallBusinessNoInsurance docsSamll = new SmallBusinessNoInsurance();
        docsSamll.documentsSmallBusiness(element, driverWait, driver);

        JavascriptExecutor jsb= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' Next - Review Submission ')]")));
        jsb.executeScript("arguments[0].click();", element);

        //Sign and Submit
        HomeOwnerApplicationDetails signSubmit = new HomeOwnerApplicationDetails();
        signSubmit.submit(element, driverWait, driver);


    }

    public void addressAndQuestion(WebElement element, WebDriverWait driverWait, WebDriver driver) throws Exception{

//        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
//                ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' 123 FIRST STREET')]")));
        // TODO: Later change it to check the question as address is dynamic
        new WebDriverWait(driver, Duration.ofSeconds(60)).until(
                ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '4000 SEYMOUR PLACE')]")));

        //Select No
        Thread.sleep(2000);
        JavascriptExecutor js100 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[1]/div/mat-radio-group/mat-radio-button[2]/label/span[1]/span[1]")));
        js100.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor js5 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[1]/div/mat-radio-group/div[2]/app-bc-address/div/div[1]/div[1]/mat-form-field/div/div[1]/div[3]/input")));
        js5.executeScript("arguments[0].scrollIntoView(true);", element);
        element.sendKeys("3220 Quadra");
        Thread.sleep(1000);
        JavascriptExecutor js110 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' 3220 Quadra St, Victoria, BC, V8X 1G3 ')]")));
        js110.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
/*        JavascriptExecutor jsa1 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[1]/div/mat-radio-group/div[2]/app-bc-address/div/div[3]/div/mat-form-field/div/div[1]/div[3]/input")));
        jsa1.executeScript("arguments[0].scrollIntoView(true);", element);
        element.sendKeys("Victoria");
        Thread.sleep(1000);
        JavascriptExecutor jsa2 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[1]/div/mat-radio-group/div[2]/app-bc-address/div/div[5]/div/mat-form-field/div/div[1]/div[3]/input")));
        jsa2.executeScript("arguments[0].scrollIntoView(true);", element);
        element.sendKeys("V8X1G4");*/
        //Questions
        Thread.sleep(1000);
        JavascriptExecutor js22 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[2]/div/mat-radio-group/mat-radio-button[1]/label/span[1]/input")));
        js22.executeScript("arguments[0].click();", element);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[3]/div/mat-radio-group/mat-radio-button[1]/label/span[1]/input")));
        js.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor jsg = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[4]/div/mat-radio-group/mat-radio-button[1]/label/span[1]/span[1]")));
        jsg.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor jsg1 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[5]/div/mat-radio-group/mat-radio-button[1]/label/span[1]/span[1]")));
        jsg1.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor jsh1 = (JavascriptExecutor) driver;
        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[6]/div/mat-form-field/div/div[1]/div[3]/input")));
        jsh1.executeScript("arguments[0].value='Lorem ipsum dolor sit amet'", element);
        //Is your home a manufactured home?
        JavascriptExecutor js21 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[7]/div/mat-radio-group/mat-radio-button[1]/label/span[1]/span[1]")));
        js21.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor js41 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-component-wrapper/app-damaged-property-address/mat-card/mat-card-content/form/div[8]/div/mat-form-field/div/div[1]/div[3]/input")));
        js41.executeScript("arguments[0].click();", element);
        element.sendKeys("Lorem ipsum dolor sit amet, consectetuer adipiscin");
        Thread.sleep(1000);
    }
    public void damgeProp(WebElement element, WebDriverWait driverWait, WebDriver driver) throws Exception {

        //Cause of Damage Small business
        Thread.sleep(1000);
        JavascriptExecutor js311 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#mat-checkbox-1 .mat-checkbox-inner-container")));
        js311.executeScript("arguments[0].click();", element);
        JavascriptExecutor js312 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#mat-checkbox-2 .mat-checkbox-inner-container")));
        js312.executeScript("arguments[0].click();", element);
        JavascriptExecutor js313 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#mat-checkbox-3 .mat-checkbox-inner-container")));
        js313.executeScript("arguments[0].click();", element);
        JavascriptExecutor js314 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#mat-checkbox-4 .mat-checkbox-inner-container")));
        js314.executeScript("arguments[0].click();", element);
        JavascriptExecutor js315 = (JavascriptExecutor) driver;

        Thread.sleep(1000);
        JavascriptExecutor js316 = (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[2]/app-component-wrapper/app-property-damage/mat-card/mat-card-content/form/div[1]/div/mat-form-field/div/div[1]/div[3]/input")));
        js316.executeScript("arguments[0].click();", element);
        element.sendKeys("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m");

        //today date
        LocalDateTime ldt = LocalDateTime.now();
        System.out.println(DateTimeFormatter.ofPattern("MM-dd-yyyy", Locale.ENGLISH).format(ldt));
        String currentDateString = ldt.toString();
        System.out.println(currentDateString);

        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[2]/app-component-wrapper/app-property-damage/mat-card/mat-card-content/form/div[2]/div[2]/mat-form-field/div/div[1]/div[3]/input")));
        element.clear();
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[2]/app-component-wrapper/app-property-damage/mat-card/mat-card-content/form/div[2]/div[2]/mat-form-field/div/div[1]/div[3]/input")));
        element.sendKeys(currentDateString);



        element = driverWait
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[2]/app-component-wrapper/app-property-damage/mat-card/mat-card-content/form/div[3]/mat-form-field/div/div[1]/div[3]/textarea")));
        element.sendKeys("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestib");
        Thread.sleep(1000);
    }

    public void ocupants(WebElement element, WebDriverWait driverWait, WebDriver driver) throws Exception {

        JavascriptExecutor js61= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add secondary applicant ')]")));
        js61.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor js8= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[1]/div[1]/mat-form-field/div/div[1]/div[3]")));
        js8.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor js81= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div[2]/div/div/div/mat-option[2]/span")));
        js81.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("Lorem ipsum dolor si");
        Thread.sleep(1000);
        JavascriptExecutor js9= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[1]/div[3]/mat-form-field/div/div[1]/div[3]/input")));
        js9.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[1]/div[3]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("Lorem ipsum dolor si");
        Thread.sleep(1000);
        JavascriptExecutor js10= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[1]/div[4]/mat-form-field/div/div[1]/div[3]/input")));
        js10.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[1]/div[4]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("999-999-9999");
        Thread.sleep(1000);
        js10.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[1]/div[5]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("abc@test.com");
        Thread.sleep(1000);
        JavascriptExecutor js11= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"cdk-step-content-1-2\"]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[2]/div[2]/button/span[1]")));
        js11.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);

        //Add other contact
        JavascriptExecutor jsaa= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add other contact ')]")));
        jsaa.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor jsbb= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[1]/div[1]/mat-form-field/div/div[1]/div[3]/input")));
        jsbb.executeScript("arguments[0].click();", element);
        JavascriptExecutor jso= (JavascriptExecutor) driver;
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[1]/div[1]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("First Name");

        JavascriptExecutor jsac= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/input")));
        jsac.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("Lorem ipsum dolor si");

        JavascriptExecutor jsad= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[1]/div[3]/mat-form-field/div/div[1]/div[3]/input")));
        jsad.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[1]/div[3]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("999-999-9999");

        JavascriptExecutor jsaf= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[1]/div[4]/mat-form-field/div/div[1]/div[3]/input")));
        jsaf.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[3]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[1]/div[4]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("test@test.com");
        Thread.sleep(1000);
        //Save
        JavascriptExecutor js40= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"cdk-step-content-1-2\"]/app-component-wrapper/app-occupants/mat-card/mat-card-content/form[2]/div/div/div/mat-card/div[2]/div[2]/button")));
        js40.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
    }
    public void cleanUpLogSmallBusiness(WebElement element, WebDriverWait driverWait, WebDriver driver) throws Exception {

        Thread.sleep(1000);
        JavascriptExecutor js161= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add to clean up log ')]")));
        js161.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        JavascriptExecutor js117= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-component-wrapper/app-clean-up-log/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[1]/mat-form-field/div/div[1]/div[3]/input")));
        js117.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-component-wrapper/app-clean-up-log/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[1]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("7/5/2023");
        Thread.sleep(1000);
        JavascriptExecutor js181= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-component-wrapper/app-clean-up-log/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/input")));
        js181.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-component-wrapper/app-clean-up-log/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("Lorem ipsum dolor si");
        Thread.sleep(1000);
        JavascriptExecutor js19= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-component-wrapper/app-clean-up-log/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[3]/mat-form-field/div/div[1]/div[3]/input")));
        js19.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-component-wrapper/app-clean-up-log/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[3]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("20");
        Thread.sleep(1000);
        JavascriptExecutor js191= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-component-wrapper/app-clean-up-log/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[4]/mat-form-field/div/div[1]/div[3]/input")));
        js191.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[4]/app-component-wrapper/app-clean-up-log/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[4]/mat-form-field/div/div[1]/div[3]/input")).sendKeys("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m");
        Thread.sleep(1000);
        JavascriptExecutor js20= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".addcleanup-button:nth-child(1) > .mat-button-wrapper")));
        js20.executeScript("arguments[0].click();", element);
        Thread.sleep(2000);
    }
    public void damageItemRoomSmall(WebElement element, WebDriverWait driverWait, WebDriver driver) throws Exception {

        JavascriptExecutor js321= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Room & Items ')]")));
        js321.executeScript("arguments[0].click();", element);

        Thread.sleep(1000);
        JavascriptExecutor js351= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("mat-select-4")));
        js351.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Bathroom')]")));
        element.click();
        Thread.sleep(1000);

        JavascriptExecutor js331= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[5]/app-component-wrapper/app-damaged-items-by-room/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/textarea")));
        js331.executeScript("arguments[0].click();", element);
        driver.findElement(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[5]/app-component-wrapper/app-damaged-items-by-room/mat-card/mat-card-content/form/div/div/div/mat-card/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/textarea")).sendKeys("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestib");

        JavascriptExecutor js34= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"cdk-step-content-1-4\"]/app-component-wrapper/app-damaged-items-by-room/mat-card/mat-card-content/form[1]/div/div/div/mat-card/div[2]/div[2]/button")));
        js34.executeScript("arguments[0].click();", element);
        Thread.sleep(2500);
        //add photo
        JavascriptExecutor js344= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Damage photo ')]")));
        js344.executeScript("arguments[0].click();", element);

        Thread.sleep(1000);
        WebElement upload = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("fileDrop")));
        upload.sendKeys(System.getProperty("user.dir") + '/' + "NewTicket.png");

        //Save
        JavascriptExecutor js36= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[5]/app-component-wrapper/app-damaged-items-by-room/mat-card/mat-card-content/div[1]/div/app-dfa-attachment/form/div/mat-card/div[2]/div[2]/button")));
        js36.executeScript("arguments[0].click();", element);
        Thread.sleep(1000);

    }
    public void documentsSmallBusiness(WebElement element, WebDriverWait driverWait, WebDriver driver) throws Exception {

        Thread.sleep(2000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Insurance Template ')]")));
        element.click();

        Thread.sleep(1000);
        WebElement uploadInsur = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("fileDrop")));
        uploadInsur.sendKeys(System.getProperty("user.dir") + '/' + "dummy.pdf");

        //Save
        JavascriptExecutor js38= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[6]/app-component-wrapper/app-supporting-documents/mat-card/mat-card-content/div[3]/div/app-dfa-attachment/form/div/mat-card/div[2]/div[2]/button")));
        js38.executeScript("arguments[0].click();", element);
        Thread.sleep(2000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Income Tax Return ')]")));
        element.click();

        Thread.sleep(1000);
        WebElement uploadRent = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("fileDrop")));
        uploadRent.sendKeys(System.getProperty("user.dir") + '/' + "testDFA.xlsx");

        //Save
        JavascriptExecutor js381= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[6]/app-component-wrapper/app-supporting-documents/mat-card/mat-card-content/div[4]/div/app-dfa-attachment/form/div/mat-card/div[2]/div[2]/button/span[1]")));
        js381.executeScript("arguments[0].click();", element);

        Thread.sleep(2000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), ' + Add Financial Statements ')]")));
        element.click();

        Thread.sleep(1000);
        WebElement uploadIdentif = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("fileDrop")));
        uploadIdentif.sendKeys(System.getProperty("user.dir") + '/' + "testPPXDFA.pptx");

        //Save
        Thread.sleep(1000);
        JavascriptExecutor js382= (JavascriptExecutor) driver;
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/app-root/div/main/div/app-dfa-application-main/div/mat-horizontal-stepper/div/div[2]/div[6]/app-component-wrapper/app-supporting-documents/mat-card/mat-card-content/div[5]/div/app-dfa-attachment/form/div/mat-card/div[2]/div[2]/button")));
        js382.executeScript("arguments[0].click();", element);
        Thread.sleep(2000);

    }
}
