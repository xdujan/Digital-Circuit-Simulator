import java.util.ArrayList;
import java.util.List;

public class Line {
    int pos[][];
    IOElement input, output;
    static List<Line> lines = new ArrayList<>();
    int inputIndex;
    int state;
    int id;
    static int counter = 0;
    public Line(IOElement output, IOElement input, int inputIndex) {
        this.pos = new int[2][2];
        this.input = input;
        this.output = output;
        this.inputIndex = inputIndex;
        this.id = counter++;
        update();
    }

    //For Instance
    public Line() {

    }
    public void update() {
        calculatePos();
        calculateState();
    }

    public void calculateState() {
        
        Boolean temp = this.output.getOutput();
        //System.out.println(temp+" state");
        if (temp == null) {
            state = 2;
        } else if (temp) {
            state = 1;
        } else {
            state = 0;
        }
        }
        public void calculatePos() {
        if(input!=null && output!=null) {
            /* if(input instanceof Switch.OutputElement) {
                Switch.OutputElement input2 = (Switch.OutputElement) input;
                pos[0] = input2.inputPos[0];
                
                return;
            } else { */

            input.update();
            output.update();
            pos[0] = input.inputPos[inputIndex];
            pos[1] = output.outputPos;
             if(input instanceof Switch.OutputElement) {
                pos[0] = input.inputPos[0];
             } else if(output instanceof Switch.InputElement) {
                pos[1] = output.outputPos;
             } 
        
        }
    }
        

        public static void updateLines() {
            // Clear Lines
            lines.clear();
            
            // Get Elements
            List<IOElement> elements = IOElement.elements;
            
            //GetReferenceID kann weg in IOElement
            // Iterate through all elements
            for (IOElement ioElement : elements) {
                ioElement.update();
                
                // Check if element has outputs
                if (ioElement.outputs.size() > 0) {
                    // Iterate through Outputs
                    for (IOElement output : ioElement.outputs) {
                        // Find out which InputIndex was used
                        for (int inputIndex = 0; inputIndex < output.inputs.size(); inputIndex++) {
                            if (output.inputs.get(inputIndex) == ioElement) {
                                Line line = new Line(ioElement, output, inputIndex);
                                line.calculatePos();
                                System.out.println("Line created with pos: " + line.pos[0][0] + ", " + line.pos[0][1] + " to " + line.pos[1][0] + ", " + line.pos[1][1] + " for element: " + ioElement.getClass().getSimpleName() + " output:" + output.getClass().getSimpleName());
                                lines.add(line);
                            }
                        }
                    }
                }
            }
            //System.out.println("\n");
        }

        public int generateHash() {
            // TODO Auto-generated method stub
            int hash = 7;
            hash = 31 * hash + pos[0][0];
            hash = 31 * hash + pos[0][1];
            hash = 31 * hash + pos[1][0];
            hash = 31 * hash + pos[1][1];
            return hash;
            
        }
        
}