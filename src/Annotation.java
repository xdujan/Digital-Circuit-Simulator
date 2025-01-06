import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Annotation extends Element{
    static int id_counter = 0;
    int id;
    String text;
    int fontSize = 15;
    static List<Annotation> annotations = new ArrayList<>();

    public Annotation(String text, int x, int y) {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.id = id_counter++;
        annotations.add(this);
        calculate();
    }

    public void calculate() {
        this.width = this.text.length() * this.fontSize;
        this.height = this.fontSize;
    
    }
    public boolean move(int xOffset, int yOffset) {
        int newX = this.x + xOffset;
        int newY = this.y + yOffset;
        if (newX >= 0 && newX <= LiveView.width && newY >= 0 && newY <= LiveView.height) {
            this.x = newX;
            this.y = newY;
            return true;
        }
        return false;
    }

    public boolean changeText(String text) {
        if(!text.isEmpty()) {
            this.text=text;
            this.calculate();
            return true;
        }
        return false;
    }

    public boolean changeFontSize(int fontSize) {
        if(fontSize>0) {
            this.fontSize = fontSize;
            this.calculate();
        }
        return false;
    }

      public int generateHash() {
        return Objects.hash(this.id, this.x, this.y, this.width, this.height, this.isActive, this.isHovered, this.text);
    }

}
