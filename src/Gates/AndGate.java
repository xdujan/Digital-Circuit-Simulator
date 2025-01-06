package Gates;

import Gatter;

class AndGate extends Gatter {

    public AndGate(int x, int y, int width, int height) {
        super(x, y, width, height);
        this.type = AND;
        System.out.println("created");
    }
    @Override
    public boolean getOutput() {

        // Assuming inputs list contains two elements
        if (this.inputs.size() < 2) {
            throw new IllegalStateException("AndGate requires at least two inputs");
        }

        IOElement input1 = (IOElement) this.inputs.get(0);
        IOElement input2 = (IOElement) this.inputs.get(1);

        return input1.getOutput() && input2.getOutput();
    }

}