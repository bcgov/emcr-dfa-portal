import dfa.CustomWebDriverManager;
import dfa.ElementInteractionHelper;
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

public class CheckDocAttachProject {



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
        WebElement element;
        CustomWebDriverManager.getElements();
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Actions actions = new Actions(driver);

        CreateNewProjectPublic createNewProjectPublic = new CreateNewProjectPublic();
        createNewProjectPublic.test();

        //Login RAFT
        SubmitClaimsPublic.getUrls();

        // Go to Submitted projects
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Projects')]")));
        element.click();
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-haspopup='true'][title='Select a view']")));
        System.out.println("Element found: " + element.isDisplayed()); // Log element visibility
        element = driverWait.until(ExpectedConditions.visibilityOf(element));
        element = driverWait.until(ExpectedConditions.elementToBeClickable(element));

        if (element.isDisplayed() && element.isEnabled()) {
            js.executeScript("arguments[0].scrollIntoView(true);", element);
            try {
                js.executeScript("arguments[0].click();", element);
            } catch (Exception e) {
                actions.moveToElement(element).click().perform();
            }
        } else {
            System.out.println("Element is not interactable: " + element);
        }
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Submitted Projects')]")));
        element.click();
        // Submitted dates descending
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[tabindex='-1'][title='Date Received (Case)']")));
        element.click();

        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Sort Newest to Oldest')]"));
        // Click on case title
        Thread.sleep(1000);
        String caseTitleWithTimestamp = SubmitApplicationsRAFT.getCaseTitleWithTimestamp();
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='" + caseTitleWithTimestamp + "'][tabindex='-1']")));
        element.click();

        // Click OK
        Thread.sleep(2000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.id("okButton"));
        // Click Recovery plan
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[aria-label='Recovery Plans'][title='Recovery Plans']")));
        element.click();

        // Double-click on Project number
        Thread.sleep(2000);
        System.out.println("Project number: " + CreateNewProjectPublic.getRandomProjectNumber());
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[title='" + CreateNewProjectPublic.getRandomProjectNumber() + "'][role='gridcell']")));
        actions.doubleClick(element).perform();
        Thread.sleep(1000);
        actions.doubleClick(element).perform();
        // Click Related
        Thread.sleep(1000);
        element = driverWait.until(ExpectedConditions.presenceOfElementLocated(By.id("related_tab_4")));
        element.click();
        Thread.sleep(1000);
        ElementInteractionHelper.scrollAndClickElement(driver, driverWait, By.xpath("//*[contains(text(), 'Project Document Locations')]"));

        //Check if the document is attached
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'dummy.pdf')]")));
        driverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'testDFA.xlsx')]")));


    }

    }
