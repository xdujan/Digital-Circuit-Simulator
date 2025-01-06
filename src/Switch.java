
enum IOType {
    INPUT, OUTPUT
}

public class Switch extends IOElement {

    boolean state;
    IOType type;
    
    

    public Switch(int x, int y, int width, int height) {
        super();
        //this.id = super.generateId();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        

    }
    public void calculatePos() {

    }
    public void update() {
        calculatePos();
    }

    public Switch(int x, int y) {
        this(x, y, 50, 50);
    }

    public Switch() {
        this(50, 50, 50, 50);
    }

    @Override
    public Boolean getOutput() {
        return state;
    }

    public void setState(boolean state) {
        this.state = state;
    }

    /* public void createSwitch(IOType type, int x, int y) {
        this.type = type;
        if (type == IOType.INPUT) {
            InputElement inputElement = new InputElement(false);
            inputElement.x = x;
            inputElement.y = y;
        } else if (type == IOType.OUTPUT) {
            OutputElement outputElement = new OutputElement();
            outputElement.x = x;
            outputElement.y = y;
        }
    } */

    public static class OutputElement extends Switch {

        /* public IOElement input; */
        
       //int[] inputPos;
        int numOutputs = 0;
 

        public OutputElement() {
            super();
            this.x = 50; // or any default value
            this.y = 50; // or any default value
            //inputPos = new int[2];
            calculatePos();
        }

        public Boolean getOutput() {
            if(inputs.get(0)==null || inputs.get(0).getOutput()==null) return null;
            return inputs.get(0).getOutput();
        }

        
        @Override
        public void calculatePos() {
            inputPos[0][0] = this.x - this.conLength;
            inputPos[0][1] = this.y+Math.round(this.height/2);//+ Math.round(this.height / 2);
        }

    }

    public static class InputElement extends Switch {

       /*  IOElement output;
        int[] outputPos; */
        int numInputs = 0;
        

        public InputElement(boolean state) {
            
            this(state, 50, 50);
            
            
            
        }

        public InputElement(boolean state, int x, int y) {
            super();
            this.state = state;
            this.x = x;
            this.y = y;
            
            calculatePos();
        }

        public void toggleState() {
            this.state = !state;
        }

        public void update() {
            this.calculatePos();
            //System.out.println("updated");
        }

        public Boolean getOutput() {
            return state;
        }

        public void setState(boolean state) {
            this.state = state;
        }

        @Override
        public void calculatePos() {

            this.outputPos[0] = this.x + this.width + this.conLength;
            this.outputPos[1] = this.y + Math.round(this.height / 2);
            //System.out.println("worked"+outputPos[0]+"|"+outputPos[1]);
        }

    }

}
