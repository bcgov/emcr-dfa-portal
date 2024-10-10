import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class TestRunner {
	public static void main(String[] args) {
		Result result;

		boolean genericResponse = true;

		// Process the command-line arguments
		for (String arg : args) {
			String[] pairs = arg.split(",");
			for (String pair : pairs) {
				String[] keyValue = pair.split("=");
				if (keyValue.length == 2) {
					String key = keyValue[0].trim();
					boolean value = Boolean.parseBoolean(keyValue[1].trim());
					System.out.println("Key: " + key + ", Value: " + value);

					switch (key) {
						case "smoke":
							if (value) {
//								result = JUnitCore.runClasses(DummyTest.class);
								result = JUnitCore.runClasses(TestSuiteSmokeTestPublicPortal.class);
								printResults(result, "TestSuiteSmokeTestPublicPortal");
								if (!result.wasSuccessful()) {
									genericResponse = false;
								}
							} else {
								System.out.println("Smoke Suite skipped");
							}
							break;
						case "login":
							if (value) {
//								result = JUnitCore.runClasses(DummyTest.class);
								result = JUnitCore.runClasses(TestSuiteLoginTestPublicPortal.class);
								printResults(result, "TestSuiteLoginTestPublicPortal");
								if (!result.wasSuccessful()) {
									genericResponse = false;
								}
							} else {
								System.out.println("Login Suite skipped");
							}
							break;
						case "fullRegression":
							if (value) {
								result = JUnitCore.runClasses(TestSuiteAllTestPublicPortal.class);
								printResults(result, "TestSuiteAllTestPublicPortal");
								if (!result.wasSuccessful()) {
									genericResponse = false;
								}
							} else {
								System.out.println("All Tests Public Portal skipped");
							}
							break;
					}
				}
			}
		}

		//Set the exist code based on all tests.
		if (genericResponse)
			System.exit(0);  // good
		else
			System.exit(1);  // fail
	}

	private static void printResults(Result result, String testName) {
		for (Failure failure : result.getFailures()) {
			System.out.println(failure.toString());
		}
		System.out.println("'" + testName + "' Test successful: " + result.wasSuccessful());
	}
}
