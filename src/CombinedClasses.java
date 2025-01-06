
enum GateType {
    AND,
    NAND,
    NOT,
    OR,
    NOR,
    XOR
}

enum IOType {
    INPUT,
    OUTPUT
}

    public class IOElement extends Element implements Cloneable{
    protected List<IOElement> inputs;
    protected List<IOElement> outputs; 

    static List<IOElement> elements;

    int numInputs,numOutputs;

    int conLength;

    protected int[][] inputPos;
    protected int[] outputPos;
    public Boolean getOutput() {
        
        return true;
    }
    public IOElement() {

    }

    public IOElement(boolean b) {}
    public int generateHash() {
        return 1;
    }
    public static void createSwitch(IOType input, int i, int j) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createSwitch'");
    }
}   




public class LiveView {

    static int width, height;
}

public class Line {

}

public class Gatter extends IOElement {

    static class AndGate extends Gatter {

        public AndGate(int x, int y, int width, int height) {
        }
    }

    static class OrGate extends Gatter {

        public OrGate(int x, int y, int width, int height) {
        }
    }

    static class NandGate extends Gatter {

        public NandGate(int x, int y, int width, int height) {
        }
    }

    static class NorGate extends Gatter {

        public NorGate(int x, int y, int width, int height) {
        }
    }

    static class NotGate extends Gatter {

        public NotGate(int x, int y, int width, int height) {
        }
    }

    static class XorGate extends Gatter {

        public XorGate(int x, int y, int width, int height) {
        }
    }
}

public class Switch extends IOElement {

    public static class OutputElement extends Switch {

        public OutputElement() {

        }
    }

    public static class InputElement extends Switch {

        public InputElement(Boolean state) {

        }
    }
}

public class Annotation extends Element {

}



/o src/Element.java
/o src/Gatter.java
/o src/Switch.java
/o src/Line.java
/o src/IOElement.java
/o src/ElementImportExporter.java
/o src/Annotation.java
/o src/LiveView.java
  