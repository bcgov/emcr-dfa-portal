import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class DateUtils {

    private String yesterdayAsString;
    private String todayAsString;
    private String inOneYearAsString;

    public static Map<String, String> getFormattedDates() {
        Calendar calendar = Calendar.getInstance();
        Date today = calendar.getTime();

        calendar.add(Calendar.DAY_OF_YEAR, -1);
        Date yesterday = calendar.getTime();

        calendar.add(Calendar.DAY_OF_YEAR, 266); // Adjusted to get the correct date in one year
        Date inOneYear = calendar.getTime();

        DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");

        String todayAsString = dateFormat.format(today);
        String yesterdayAsString = dateFormat.format(yesterday);
        String inOneYearAsString = dateFormat.format(inOneYear);

        Map<String, String> formattedDates = new HashMap<>();
        formattedDates.put("today", todayAsString);
        formattedDates.put("yesterday", yesterdayAsString);
        formattedDates.put("inOneYear", inOneYearAsString);

        return formattedDates;
    }

    public String getYesterdayAsString() {
        return yesterdayAsString;
    }

    public void setYesterdayAsString(String yesterdayAsString) {
        this.yesterdayAsString = yesterdayAsString;
    }

    public String getTodayAsString() {
        return todayAsString;
    }

    public void setTodayAsString(String todayAsString) {
        this.todayAsString = todayAsString;
    }

    public String getInOneYearAsString() {
        return inOneYearAsString;
    }

    public void setInOneYearAsString(String inOneYearAsString) {
        this.inOneYearAsString = inOneYearAsString;
    }

    public static void main(String[] args) {
        Map<String, String> dates = getFormattedDates();
        System.out.println("Today: " + dates.get("today"));
        System.out.println("Yesterday: " + dates.get("yesterday"));
        System.out.println("In One Year: " + dates.get("inOneYear"));
    }
}