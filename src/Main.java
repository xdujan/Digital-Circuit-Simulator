
import java.io.IOException;

public class Main {

    public static void main(String[] args) {
        System.out.println("test");

        try {
            LiveView liveView = new LiveView();
            liveView.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
