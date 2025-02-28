package dfa;

public class Config {
    public static final String SELECTED_DRIVER = Constants.CHROME_DRIVER;    //the driver that will be used for the tests

//    // Env to be run
//    public static final String ENVIRONMENT = Constants.DEV_SupportPub;     //the environment that will be used for the tests Portal
//    public static final String ENVIRONMENT_Dynamics = Constants.DEV_SupportDynamicsPub; //the environment that will be used for the tests RAFT


    // Env to be run
    public static final String ENVIRONMENT = Constants.TST_SupportPub;     //the environment that will be used for the tests Portal
    public static final String ENVIRONMENT_Dynamics = Constants.TST_SupportDynamicsPub; //the environment that will be used for the tests RAFT



//
//    // Env to be run
//    public static final String ENVIRONMENT = Constants.TRN_Public;     //the environment that will be used for the tests Portal
//    public static final String ENVIRONMENT_Dynamics = Constants.TRN_DynamicsPub; //the environment that will be used for the tests RAFT


    public static String TEST_SCENARIO = Constants.NOT_SET;
    public static boolean SKIP_SCREENSHOTS_OF_SHOPPING_CART = false;                //not implemented yet

    public static final int TIMEOUT = 30;                            //the time webdriver waits before giving up (in seconds)
    public static final int SLEEP_TIME_FULL_REFRESH = 3500;                            //time used in Thread.sleep() in milliseconds
    public static final int SLEEP_TIME_PART_REFRESH = SLEEP_TIME_FULL_REFRESH / 2;    //time used in Thread.sleep() in milliseconds


}
