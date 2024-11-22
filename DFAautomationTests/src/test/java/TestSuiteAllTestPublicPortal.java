import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({

        LoginPublicPortal.class, CreateNewApplicationPublic.class, CreateNewApplicationPublicNeg.class, CreateNewProjectPublic.class, SubmitApplicationsRAFT.class,
        SubmitClaimsPublic.class, VerifySubmitedClaimInRAFT.class, LoginDynamicsPublic.class, DenyClaimAmountPublic.class, AddMultipleInvoices.class, PartialPaymentApproveClaim.class,
        ValidateDraftApplicationRAFT.class, ValidateDraftApplicationNegRAFT.class, CheckDocAttachProject.class
})





public class TestSuiteAllTestPublicPortal {


    @Test
    public void test() throws Exception {

    }

}
