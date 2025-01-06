
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
 enum GateType {
    AND,
    NAND,
    NOT,
    OR,
    NOR,
    XOR
} 

public class IOElement extends Element implements Cloneable{

static int defX=50,defY=50;
static int defWidth = 50,defHeight = 50;

    boolean isSimulating = false;

    int numInputs = 2;
    int numOutputs = 1;

    //Positional

    

    static List<IOElement> elements = new ArrayList<>();

    // I/O Inputs
    protected static int conLength = 35; //Length of the Inputs
    protected List<IOElement> inputs;
    protected List<IOElement> outputs;

    

    

    //Input Output Position
    protected int[][] inputPos;
    protected int[] outputPos;

    Boolean getOutput() {
        return true;
    }

    public IOElement(boolean g) {
        super();
        
        
    }

    public IOElement() {
        super();
        this.inputPos = new int[2][2];
        this.outputPos = new int[2];
        this.inputs = new ArrayList<>(this.numInputs);
        this.outputs = new ArrayList<>();
        for (int i = 0; i < this.numInputs; i++) {
            inputs.add(null);
        }
        update();
        elements.add(this);
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {

        if(this instanceof Gatter) {
            IOElement cloned = (IOElement) super.clone();
        cloned.inputs = new ArrayList<>(); // Neue leere ArrayList für inputs
        cloned.inputs.add(null);
        cloned.inputs.add(null); 
        cloned.outputs = new ArrayList<>();
        return cloned;
        } else if(this instanceof Switch.InputElement) {
            IOElement cloned = (IOElement) super.clone();
            cloned.outputs = new ArrayList<>();
            return cloned;
        } else if(this instanceof Switch.OutputElement) {
            IOElement cloned = (IOElement) super.clone();
            cloned.inputs = new ArrayList<>(); // Neue leere ArrayList für inputs
            cloned.inputs.add(null);
            cloned.inputs.add(null); 
            
            return cloned;
        }
        return null;
        
                
    }

    public void setInputReference(int inputIndex, IOElement outputElement) {
        if (inputIndex < 0 || inputIndex >= this.numInputs) {
            //throw new IndexOutOfBoundsException("Input index " + inputIndex + " is out of bounds for numInputs " + numInputs);
        }

        IOElement previousOutputElement = this.inputs.get(inputIndex);
        if (previousOutputElement != null) {
            previousOutputElement.removeOutputReference(this);
        }

        this.inputs.set(inputIndex, outputElement);

        if (outputElement != null) {
            outputElement.addOutputReference(this);
        }
    }

    public int getInputReferenceID(IOElement output) {
        int index = inputs.indexOf(output);
        if (index == -1) {
            throw new IllegalArgumentException("No Output-Element with this ID was found.");
        }
        return index;
    }

    public IOElement getInputReference(int inputIndex) {
        return inputs.get(inputIndex);
    }

    public void addOutputReference(IOElement inputElement) {
        //if (!outputs.contains(inputElement)) {
        System.out.println("oiweptewpotpwp");
            outputs.add(inputElement);

            outputs.forEach(output -> System.out.println("Output ID: " + output.id));
        //}
    }

    public void deleteOutputReference(IOElement outputElement) {
        this.outputs.remove(outputElement);
    }

    public IOElement getOutputReference(int index) {
        if (outputs.size() == 0) {
            throw new IllegalArgumentException("This Element doesn't have any Outputs connected.");
        }
        if (outputs.size() < index) {
            throw new IllegalArgumentException("Index is larger than the Amount of Outputs connected.");
        }

        if (index < 0 || index >= outputs.size()) {
            throw new IndexOutOfBoundsException("Index " + index + " out of bounds for length " + outputs.size());
        }
        return outputs.get(index);
    }

    public boolean getOutputElement(IOElement inputElement) {
        return outputs.contains(inputElement);
    }

    public void removeOutputReference(IOElement inputElement) {
        outputs.remove(inputElement);
    }

  

    public static IOElement search(int index) {
        for (IOElement element : elements) {
            if (element.id == index) {
                return element;
            }
        }
        return null;
    }






    /* public void moveMultiple(int[] elementIDs, int[] values) {
        for (int i = 0; i < elementIDs.length; i++) {
            //this.search(gateIDs[i]).x+=values[0];
            //this.search(gateIDs[i]).y+=values[1];
            this.search(elementIDs[i]).move(values[0], values[1]);

        }

    } */

    public boolean move(int valueX, int valueY) {
        if (this.x + valueX >= 0 && this.x + valueX <= LiveView.width && this.y + valueY >= 0 && this.y + valueY <= LiveView.height) {
            this.x += valueX;
            this.y += valueY;
            this.update();
            return true;
        } else {
            System.err.println("Element with ID " + this.id + " can't be moved out of bounds.");
            return false;
        }
    }

    public void update() {
        this.calculateIO_pos();
    }
    //Update

    public void calculateIO_pos() {
        // Declaration
        this.inputPos = new int[2][2];
        this.outputPos = new int[2];
        //Inputs
        this.inputPos[0][0] = this.x - this.conLength;
        this.inputPos[0][1] = this.y;

        this.inputPos[1][0] = this.x - this.conLength;
        this.inputPos[1][1] = this.y + this.height;

        //Output
        this.outputPos[0] = this.x + this.width + this.conLength;
        this.outputPos[1] = Math.round((this.height / 2) + this.y);

    }

    public int generateHash() {
        if (this instanceof Switch.InputElement) {
            Switch.InputElement io = (Switch.InputElement) this;
            return Objects.hash(this.id, this.x, this.y, this.width, this.height, this.isActive, this.isHovered, io.state);
        }
        return Objects.hash(this.id, this.x, this.y, this.width, this.height, this.isActive, this.isHovered);
    }

    //Gate Methods
    
    //Create Gate-Methods
    public static IOElement createGate(int type) {
        // GateTypes: 0-AND;1-NAND;2-NOT;-3-OR;4-NOR;5-XOR
        if (type >= 0 && type < 8) {
            return createGate(type, 50, 50);
        }
        return null;
    }

    public static IOElement createGate(String type) {
        if(type==null) throw new IllegalArgumentException("Type is Null");
        switch (type.toUpperCase()) {
            case "AND":
            return createGate(GateType.AND);
            case "NAND":
            return createGate(GateType.NAND);
            case "NOT":
            return createGate(GateType.NOT);
            case "OR":
            return createGate(GateType.OR);
            case "NOR":
            return createGate(GateType.NOR);
            case "XOR":
            return createGate(GateType.XOR);
            default:
            throw new IllegalArgumentException("Invalid gate type: " + type);
        }
    }
    public static IOElement createGate(GateType type) {
        return createGate(type, defX, defY);
    }

    public static IOElement createGate(GateType type, int x, int y) {
        switch (type) {
            case AND:
                Gatter.AndGate and = new Gatter.AndGate(x, y, defWidth, defHeight);
               
            
                return and;

            case NAND:
                Gatter.NandGate nand = new Gatter.NandGate(x, y, defWidth, defHeight);
                return nand;
            case NOT:
                Gatter.NotGate not = new Gatter.NotGate(x, y,defWidth, defHeight);
                return not;
            case OR:
                Gatter.OrGate or = new Gatter.OrGate(x, y, defWidth, defHeight);
                return or;
            case NOR:
                Gatter.NorGate nor = new Gatter.NorGate(x, y, defWidth, defHeight);
                return nor;
            case XOR:
                Gatter.XorGate xor = new Gatter.XorGate(x, y, defWidth, defHeight);
                return xor;
            default:
                break;
        }
        return null;
    }

    public static IOElement createGate(int type, int x, int y) {
        // GateTypes: 0-AND;1-NAND;2-NOT;-3-OR;4-NOR;5-XOR
        Map<Integer, GateType> gateTypes = new HashMap<>();
        gateTypes.put(0, GateType.AND);
        gateTypes.put(1, GateType.NAND);
        gateTypes.put(2, GateType.NOT);
        gateTypes.put(3, GateType.OR);
        gateTypes.put(4, GateType.NOR);
        gateTypes.put(5, GateType.XOR);

        if (type >= 0 && type < 8) {

            return createGate(gateTypes.get(type), x, y);
        }
        return null;
    }

    public static IOElement createSwitch(IOType type, int x, int y) {
        if (type == IOType.INPUT) {
            Switch.InputElement inputElement = new Switch.InputElement(false);
            inputElement.type = IOType.INPUT;
            inputElement.x = x;
            inputElement.y = y;
            return inputElement;
        } else if (type == IOType.OUTPUT) {
            Switch.OutputElement outputElement = new Switch.OutputElement();
            outputElement.type = IOType.OUTPUT;
            outputElement.x = x;
            outputElement.y = y;
            return outputElement;
        }
        return null;
    }

    //Switch methods
    public static IOElement createSwitch(IOType type) {
        return createSwitch(type, defX, defY);
    }

    public static IOElement createSwitch(String type) {
        if(type.equalsIgnoreCase("Input")) {
            return createSwitch(IOType.INPUT);
        } else if(type.equalsIgnoreCase("Output")) {
            return createSwitch(IOType.OUTPUT);
        }
        throw new IllegalArgumentException("Type can either be Input or Output");
    }

    public static void createConnection(IOElement ingoing, int[] indexIngoing, IOElement outgoing, int[] indexOutgoing) {
        //Check for NULL
        if(ingoing==null || outgoing==null) throw new IllegalArgumentException("Either of the Input-Elements are NULL");
        if(indexIngoing==null||indexOutgoing==null) throw new IllegalArgumentException("One or both Indexes are NULL");

        //Check for Correct Indexes
        if(indexIngoing[0]>2||indexIngoing[0]<0 || indexIngoing[1]>2||indexIngoing[1]<0) {
            throw new IllegalArgumentException("Invalid Ingoing-Index (Index is out of Bounds)");
        }
        if(indexOutgoing[0]>2||indexOutgoing[0]<0 || indexOutgoing[1]>2||indexOutgoing[1]<0) {
            throw new IllegalArgumentException("Invalid Outgoing-Index (Index is out of Bounds)");
        }
        //Check if No-Index was set
        if(indexIngoing[0]==indexIngoing[1]&&indexIngoing[0]==0) throw new IllegalArgumentException("Invalid Ingoing-Index(No Index was set)");
        if(indexOutgoing[0]==indexOutgoing[1]&&indexOutgoing[0]==0) throw new IllegalArgumentException("Invalid Outgoing-Index(No Index was set)");

        //Check if both In- and Outputs are set
        if(indexIngoing[0]>0&&indexIngoing[1]>0) throw new IllegalArgumentException("Invalid Ingoing-Index (In- and Output can't be set at the same time)");
        if(indexOutgoing[0]>0&&indexOutgoing[1]>0) throw new IllegalArgumentException("Invalid Outgoing-Index (In- and Output can't be set at the same time)");
        //Check if Output->Output OR Input->Input
        if(indexIngoing[0]>0&&indexOutgoing[0]>0) {
            throw new IllegalArgumentException("The Input can't be connected to another Input");
        } else if(indexIngoing[1]>0&&indexOutgoing[1]>0) {
            throw new IllegalArgumentException("The Output can't be connected to another Output");
        }

        //Check if its the same Ingoing->Outgoing
        if(ingoing==outgoing) {
            throw new IllegalArgumentException("You can't connect the Inputs of the same Gate with the Outputs");
           
        }

        /* int[] gateIds = {ingoing.id,outgoing.id};
        int[] values = {indexIngoing[0],indexIngoing[1],indexOutgoing[0],indexOutgoing[1]};
        createConnection(gateIds, values); */

        //Determine Input
        System.out.println("rüweroüpweroüpewüpo");
        if(indexIngoing[0]>0) {
            ingoing.setInputReference(indexIngoing[0]-1, outgoing);
        } else {
            outgoing.setInputReference(indexOutgoing[0]-1, ingoing);
        }
        Line.updateLines();
    }

    /* public void createConnection(int[] gateIDs, int[] values) {
        if (values == null || values.length != 4) {
            return;
        }
        // Output-> Input
        IOElement input, output;
        int[] valuesInput = null, valuesOutput = null;
        if (values[0] > 0 && values[1] == 0
                && values[2] == 0 && values[3] > 0) {
            input = search(gateIDs[0]);
            output = search(gateIDs[1]);
            valuesInput = new int[]{values[0], values[1]};
            valuesOutput = new int[]{values[2], values[3]};

        } else if (values[0] == 0 && values[1] > 0
                && values[2] > 0 && values[3] == 0) {
            input = search(gateIDs[1]);
            output = search(gateIDs[0]);
            valuesInput = new int[]{values[2], values[3]};
            valuesOutput = new int[]{values[0], values[1]};
        } else {
            throw new IllegalArgumentException("No Data transfered");
        }

        System.out.println("Input values: " + Arrays.toString(valuesInput));
        System.out.println("Output values: " + Arrays.toString(valuesOutput));

        if (input == null || output == null) {
            throw new IllegalArgumentException("Input or output element not found");
        }

        if ((valuesInput[0] > 0 && valuesInput[1] == 0)
                && valuesOutput[0] == 0 && valuesOutput[1] > 0) {
            input.setInputReference(valuesInput[0] - 1, output);

            System.out.println("set");
            System.out.println(input);
            System.out.println(Line.lines.size());
            Line.updateLines();
        } else {
            System.out.println("Invalid connection values");
        }
        Line.updateLines();
    } */

    public static void copyElements(int[] elementIDs) throws CloneNotSupportedException {

        copyElements(elementIDs, new int[]{0,0});
    }
    public static void copyElements(int[] elementIDs, int[] mouseOffsets) throws CloneNotSupportedException {
        Map<Integer, IOElement> originalElements = new HashMap<>();
        Map<Integer, IOElement> copiedElements = new HashMap<>();
    
        // Schritt 1: Originalelemente sammeln
        for (int id : elementIDs) {
            IOElement element = search(id);
            if (element != null) {
                originalElements.put(id, element);
                System.out.println("Number of elements copied: " + originalElements.size());
            } else {
                throw new IllegalArgumentException("No Element found with ID: " + id);
            }
        }
    
        // Schritt 2: Elemente kopieren und neue IDs zuweisen
        for (Map.Entry<Integer, IOElement> entry : originalElements.entrySet()) {
            IOElement original = entry.getValue();
            IOElement copy = (IOElement) original.clone();
            copy.id = generateId(); // Neue ID zuweisen
            copiedElements.put(original.id, copy); // Verwenden Sie die Original-ID als Schlüssel

            //Offset
            copy.move(mouseOffsets[0], mouseOffsets[1]);
            copy.isActive = true;
            elements.add(copy);
            Element.elements.add(copy);    
        }
    
        // Schritt 3: Referenzen zwischen den kopierten Elementen aktualisieren
        for (Map.Entry<Integer, IOElement> entry : originalElements.entrySet()) {
            IOElement original = entry.getValue();
            IOElement copy = copiedElements.get(original.id);
    
            // Eingangsreferenzen aktualisieren
            for (int i = 0; i < original.inputs.size(); i++) {
                IOElement originalInput = original.inputs.get(i);
                if (originalInput != null && copiedElements.containsKey(originalInput.id)) {
                    IOElement copiedInput = copiedElements.get(originalInput.id);
                    //copy.setInputReference(i, copiedInput); Worked before
                    createConnection(copy, new int[]{i+1,0}, copiedInput, new int[]{0,1});
                }
            }
        }
    
        Line.updateLines();
    }

    
    

    public static void deleteElementByID(int gateid) {
        IOElement element = search(gateid);
        if (element == null) {
            throw new IllegalArgumentException("Element with ID " + gateid + " not found.");
        }

        // Clear Outputs and the reference
        for (int i = 0; i < element.outputs.size(); i++) {
            IOElement output = element.outputs.get(i);
            int id = output.getInputReferenceID(element);
            output.setInputReference(id, null);
        }
        element.outputs.clear();

        // Clear Inputs and the reference
        for (int i = 0; i < element.inputs.size(); i++) {
            IOElement input = element.inputs.get(i);
            if (input != null) {
                input.removeOutputReference(element);
            }
        }
        element.inputs.clear();

        elements.remove(element);
        Element.elements.remove(element);
    }



}

