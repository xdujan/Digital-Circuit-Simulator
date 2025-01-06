
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Element {

    protected int x = 15, y = 15;
    protected int width = 50, height = 50;
    protected int id;
    public static int counter = 1;
    public static List<Element> elements = new ArrayList<>();
    protected boolean isActive = false;
    protected boolean isHovered = false;

    public Element() {
        this.id = generateId();
        elements.add(this);
    }

    public static int generateId() {
        return counter++;
    }

    public static Element search(int index) {
        return elements.stream().filter(e -> e.id == index).findFirst().orElse(null);
    }

    public static void print() {
        elements.forEach(element -> {
            System.out.println(element);
        });
        
    }

    public static Boolean moveMultiple(int[] ids, int offsetX, int offsetY) {
        print();
        //List<Element> elementsToMove = new ArrayList<>();
        for (int id : ids) {
            Element element = search(id);
            System.out.println("Trying to Move Element with ID"+id+" ->"+element);
            if (element != null) {
                System.out.println("moved from"+element.x+"/"+element.y+" to "+element.x+offsetX+"/"+element.y+offsetY);
                element.move(offsetX, offsetY);
            }
        }
        return null;
    }

    public static void deleteElementByID(int id) {
        Element e = search(id);
        
        if (e == null) {
            throw new IllegalArgumentException("No Element with id " + id + " found.");
        }
        elements.remove(e);
    }
    
    public static void deleteElementsByID(int[] gateIDs) {
        for (int id : gateIDs) {
            Element element = search(id);
            
            if (element != null) {
                if(element instanceof IOElement) {
                    System.out.println("awr dings");
                    IOElement ioe = (IOElement) element;
                    ioe.deleteElementByID(id);
                    
                } else {
                    deleteElementByID(id);
                }
                
            } else {
                System.err.println("Element with ID " + id + " not found.");
            }
        }
    }
    boolean isInside(int mouseX, int mouseY) {
        return mouseX >= x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height;
    }
    public boolean move(int valueX, int valueY) {
        if (this.x + valueX >= 0 && this.x + valueX <= LiveView.width && this.y + valueY >= 0 && this.y + valueY <= LiveView.height) {
            this.x += valueX;
            this.y += valueY;
            return true;
        } else {
            System.err.println("Element with ID " + this.id + " can't be moved out of bounds.");
            return false;
        }
    }

    static void checkForOutofBoundsElements() {
        int width, height;
        width = LiveView.width;
        height = LiveView.height;
        System.out.println("checked");
        elements.stream()
            .filter(element -> element.x < 0 || element.x > width || element.y < 0 || element.y > height)
            .forEach(element -> {
                System.out.println("Element with ID " + element.id + " is out of bounds. Resetting Position.");
                element.x = 0;
                element.y = 0;
                element.update();
            });  }

    public void update() {}

    public static void setActiveMultiple(int[] elementIds, int[] value) {
        for (int i = 0; i < elementIds.length; i++) {
            Element element = search(elementIds[i]);
            if (element != null) {
                element.isActive = value[i] == 1;
            }
        }
    }

    static int[] getInsideElements(int mouseX, int mouseY) {
        List<Integer> insideGates = new ArrayList<>();
        for (Element element : elements) {
            if (element.isInside(mouseX, mouseY) == true) {
                insideGates.add(element.id);
            }
        }
            int[] insideGatesArray = insideGates.stream().mapToInt(Integer::intValue).toArray();
            return insideGatesArray;
        }

      public int generateHash() {
        return Objects.hash(this.id, this.x, this.y, this.width, this.height, this.isActive, this.isHovered);
    }


}
