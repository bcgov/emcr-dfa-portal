import dfa.CustomWebDriverManager;
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

public class PartialPaymentApproveClaim {

    private WebDriver driver;

//    @After
//    public void tearDown() {
//        driver.close();
//        driver.quit();
//    }
//
//    @AfterClass
//    public static void afterClass() {
//        CustomWebDriverManager.instance = null;
//    }

    @Test
    public void test() throws Exception {
        driver = getDriver();
        WebDriverWait driverWait = CustomWebDriverManager.getDriverWait();
        WebElement element;
        CustomWebDriverManager.getElements();
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Actions actions = new Actions(driver);

        SubmitClaimsPublic submitClaimsPublic = new SubmitClaimsPublic();
        submitClaimsPublic.test();

        // Call the processClaimDetails method and capture the ClaimNumber
        String ClaimNumber = VerifySubmitedClaimInRAFT.processClaimDetails(driver, driverWait);

        //Approve Partial Payment
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Approved Partial')]")));
        element.click();
        // Locate the body element
        WebElement bodyElement = driver.findElement(By.tagName("body"));
        // Click on the body element
        bodyElement.click();
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[2]/div/div[3]/div[2]/div/div/div/div/div/div[1]/div[1]/div[2]/div/div/div/section[2]/section[1]/div/div/div/div[7]/div/div/div[2]/div/div[3]/div[2]/div/div[2]/div[1]")));
        String AmountClaimed = element.getText();
        System.out.println("Total being claimed: " + AmountClaimed);

        //To get the fillFormField(driverWait, "[formcontrolname='netInvoiceBeingClaimed'][maxlength='100']", RandomIntGenerator.generateRandomInt(6)); which is the amount added by me in Invoice from SubmitClaimsPublic

    }
}
