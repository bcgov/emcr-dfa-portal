import dfa.CustomWebDriverManager;
import lombok.Getter;
import lombok.Setter;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static dfa.CustomWebDriverManager.getDriver;

public class AddMultipleInvoices {

    private static WebDriver driver;
    @Getter
    @Setter
    private static String vendorName;

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
        WebElement element;
        CustomWebDriverManager.getElements();
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Actions actions = new Actions(driver);

        CreateNewProjectPublic createNewProjectPublic = new CreateNewProjectPublic();
        createNewProjectPublic.test();

        //Login RAFT
        SubmitClaimsPublic.getUrls();

        //Navigate to Submitted projects
        SubmitClaimsPublic.navigateToSubmittedProjects(driver, driverWait, js, actions);

        //Login Portal
        SubmitClaimsPublic.loginToPortal();

        SubmitClaimsPublic.submitProjectAndAddInvoice(driver, driverWait, js, actions);

        //Add new invoice

        for (int i = 0; i < 4; i++) {
            // Add invoice details
            DateUtils dateUtils = new DateUtils();
            dateUtils.setTodayAsString(DateUtils.getFormattedDates().get("today"));
            setVendorName(RandomStringGenerator.generateRandomAlphanumericWithSpaces(100));

            // Ensure vendorName is not null
            String vendorName = SubmitClaimsPublic.getVendorName();
            if (vendorName == null) {
                vendorName = RandomStringGenerator.generateRandomAlphanumericWithSpaces(100);
                setVendorName(vendorName);
            }
            // Click add invoices
            Thread.sleep(3000);
            SubmitClaimsPublic.clickElementWithRetry(driverWait, By.xpath("//*[contains(text(), ' + Add Invoice ')]"));
            // Use the getter method to retrieve and use the vendorName value
            SubmitClaimsPublic.fillFormField(driverWait, "[formcontrolname='vendorName'][maxlength='100']", vendorName);
            System.out.println("Vendor name is: " + vendorName);
            SubmitClaimsPublic.fillFormField(driverWait, "[formcontrolname='invoiceNumber'][maxlength='100']", RandomIntGenerator.generateRandomInt(100));
            SubmitClaimsPublic.fillFormField(driverWait, "[formcontrolname='invoiceDate'][aria-haspopup='dialog']", dateUtils.getTodayAsString());
            SubmitClaimsPublic.fillFormField(driverWait, "[formcontrolname='purposeOfGoodsServiceReceived'][maxlength='200']", RandomStringGenerator.generateRandomAlphanumericWithSpaces(200));
            SubmitClaimsPublic.fillFormField(driverWait, "[formcontrolname='netInvoiceBeingClaimed'][maxlength='100']", RandomIntGenerator.generateRandomInt(6));
            SubmitClaimsPublic.fillFormField(driverWait, "[formcontrolname='pst'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));
            SubmitClaimsPublic.fillFormField(driverWait, "[formcontrolname='grossGST'][maxlength='100']", RandomIntGenerator.generateRandomInt(1));

            // Check rdo buttons
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div[2]/div/mat-dialog-container/div/div/app-invoice/mat-card/mat-card-content/form/div[1]/div[1]/div[3]/div/mat-radio-group/mat-radio-button[1]/div/div/input")));
            element.click();
            element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div[2]/div/mat-dialog-container/div/div/app-invoice/mat-card/mat-card-content/form/div[1]/div[1]/div[6]/div/mat-radio-group/mat-radio-button[2]/div/div/input")));
            element.click();

            // Click Add
            SubmitClaimsPublic.clickElementWithRetry(driverWait, By.cssSelector(".button-p.add-invoice.ng-star-inserted"));
        }

    }
}
