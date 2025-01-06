
import java.util.Objects;

enum Type {
    AND, NAND, NOT, OR, NOR, XOR, INPUT
}

public class Gatter extends IOElement {

    //Is Simulating
    public Type type;
    
    //Positional

    //identification
    //private static int counter = 0;
    

    //Start Constructor
    public Gatter() {
        super();
    }

    public Gatter(int x, int y, int width, int height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        //this(x, y, width, height, 2, 1);
        this.isActive = false;

        // Initialize the inputs and outputs lists with the required size
        for (int i = 0; i < numInputs; i++) {
            inputs.add(null);
        }
    }

    public Boolean getOutput() {
        return true;
    }

    public Gatter(int x, int y, int width, int height, int numInputs, int numOutputs) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = super.generateId();

        setCanvasBounds();

        update();
    }

    //Input/Output
    /*    void setInputElement(int index, IOElement ioElement, int ioElementIndex) {
        this.inputs.set(index, ioElement);
        Line line = new Line(this, index, ioElement, ioElementIndex);
        Line.lines.add(line);
    } */

 /*  void setOutputElement(int index, IOElement ioElement, int ioElementIndex) {
        this.outputs.set(index, ioElement);
        Line line = new Line(ioElement, ioElementIndex,this, index);
        Line.lines.add(line);
    }  */
    // Move-Method
    //initializiation
    // Check for Canvas size
    int cWidth, cHeight;

    public void setCanvasBounds() {
        this.cWidth = 800;
        this.cHeight = 600;
    }

    //Gatter-Classes
    static class NotGate extends Gatter {

        int numInputs = 1;
        int numOutputs = 1;

        public NotGate(int x, int y, int width, int height) {
            super(x, y, width, height, 1, 1);
            this.type = Type.NOT;
        }

        @Override
        public Boolean getOutput() {
            if (this.inputs.size() < 2) {
                throw new IllegalStateException("NOT-Gate requires one input");
            }

            IOElement input1 = this.inputs.get(0);
            

            if (input1 == null) {
                return null;
            }

            Boolean output1 = input1.getOutput();

            if(output1==null) return null;
            

           

            return !output1;
        }

        @Override
        public int generateHash() {
            // Add input and output
            return Objects.hash(this.id, this.x, this.y, this.width, this.height, this.isActive, this.isHovered);
        }

        public void update() {
            this.inputPos[0][0] = this.x-this.conLength;
            this.inputPos[0][1] = this.y+Math.round(this.height/2);

            this.outputPos[0] = this.x+this.width+this.conLength;
            this.outputPos[1] = this.y+Math.round(this.height/2);

        }

    }

    static class AndGate extends Gatter {

        public AndGate(int x, int y, int width, int height) {
            super(x, y, width, height);
            this.type = Type.AND;
            System.out.println("created");
        }

        @Override
        public Boolean getOutput() {
            if (this.inputs.size() < 2) {
                throw new IllegalStateException("AndGate requires at least two inputs");
            }

            IOElement input1 = this.inputs.get(0);
            IOElement input2 = this.inputs.get(1);

            if (input1 == null || input2 == null) {
                return null;
            }

            Boolean output1 = input1.getOutput();
            Boolean output2 = input2.getOutput();

            if (output1 == null || output2 == null) {
                return null;
            }

            return output1 && output2;
        }
    }

    static class NandGate extends Gatter {

        public NandGate(int x, int y, int width, int height) {
            super(x, y, width, height);
            this.type = Type.NAND;
        }

        @Override
        public Boolean getOutput() {
            if (this.inputs.size() < 2) {
                throw new IllegalStateException("NandGate requires at least two inputs");
            }

            IOElement input1 = this.inputs.get(0);
            IOElement input2 = this.inputs.get(1);

            if (input1 == null || input2 == null) {
                return null;
            }

            Boolean output1 = input1.getOutput();
            Boolean output2 = input2.getOutput();

            if (output1 == null || output2 == null) {
                return null;
            }

            return !(output1 && output2);
        }
    }

    static class OrGate extends Gatter {

        public OrGate(int x, int y, int width, int height) {
            super(x, y, width, height);
            this.type = Type.OR;
        }

        @Override
        public Boolean getOutput() {
            if (this.inputs.size() < 2) {
                throw new IllegalStateException("NandGate requires at least two inputs");
            }

            IOElement input1 = this.inputs.get(0);
            IOElement input2 = this.inputs.get(1);

            if (input1 == null || input2 == null) {
                return null;
            }

            Boolean output1 = input1.getOutput();
            Boolean output2 = input2.getOutput();

            if (output1 == null || output2 == null) {
                return null;
            }

            return (output1 || output2);
        }
    }

    static class NorGate extends Gatter {

        public NorGate(int x, int y, int width, int height) {
            super(x, y, width, height);
            this.type = Type.NOR;
        }

        @Override
        public Boolean getOutput() {
            if (this.inputs.size() < 2) {
                throw new IllegalStateException("NandGate requires at least two inputs");
            }

            IOElement input1 = this.inputs.get(0);
            IOElement input2 = this.inputs.get(1);

            if (input1 == null || input2 == null) {
                return null;
            }

            Boolean output1 = input1.getOutput();
            Boolean output2 = input2.getOutput();

            if (output1 == null || output2 == null) {
                return null;
            }

            return !(output1 || output2);
        }
    }

    static class XorGate extends Gatter {

        public XorGate(int x, int y, int width, int height) {
            super(x, y, width, height);
            this.type = Type.XOR;
        }

        @Override
        public Boolean getOutput() {
            if (this.inputs.size() < 2) {
                throw new IllegalStateException("NandGate requires at least two inputs");
            }

            IOElement input1 = this.inputs.get(0);
            IOElement input2 = this.inputs.get(1);

            if (input1 == null || input2 == null) {
                return null;
            }

            Boolean output1 = input1.getOutput();
            Boolean output2 = input2.getOutput();

            if (output1 == null || output2 == null) {
                return null;
            }

            return output1 ^ output2;
        }
    }

}
