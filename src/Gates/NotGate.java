
class NotGate extends Gatter {
    int numInputs = 1;
    int numOutputs = 1;
    public NotGate(int x, int y, int width, int height) {
        super(x, y, width, height, 1, 1);
        this.type = Type.NOT;
    }

    @Override
    public boolean getOutput() {
        // Assuming inputs list contains two elements
        if (inputs.size() < 1) {
            throw new IllegalStateException("AndGate requires at least two inputs");
        }

        IOElement input1 = (IOElement) inputs.get(0);

        return !input1.getOutput();
    }

    @Override
    public int generateHash() {
        // Add input and output
        return Objects.hash(this.id, this.x, this.y, this.width, this.height, this.isActive, this.isHovered);
    }

}

class AndGate extends Gatter {

    public AndGate(int x, int y, int width, int height) {
        super(x, y, width, height);
        this.type = Type.AND;
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

class NandGate extends Gatter {

    public NandGate(int x, int y, int width, int height) {
        super(x, y, width, height);
        this.type = Type.NAND;
    }
    @Override
    public boolean getOutput() {
        if (inputs.size() < 2) {
            throw new IllegalStateException("AndGate requires at least two inputs");
        }

        IOElement input1 = (IOElement) inputs.get(0);
        IOElement input2 = (IOElement) inputs.get(1);

        return !(input1.getOutput() && input2.getOutput());
    }
}
class OrGate extends Gatter {

    public OrGate(int x, int y, int width, int height) {
        super(x, y, width, height);
        this.type = Type.OR;
    }
    @Override
    public boolean getOutput() {
        if (inputs.size() < 2) {
            throw new IllegalStateException("AndGate requires at least two inputs");
        }

        IOElement input1 = (IOElement) inputs.get(0);
        IOElement input2 = (IOElement) inputs.get(1);

        return input1.getOutput() || input2.getOutput();
    }
}

class NorGate extends Gatter {

    public NorGate(int x, int y, int width, int height) {
        super(x, y, width, height);
        this.type = Type.NOR;
    }
    @Override
    public boolean getOutput() {
        if (inputs.size() < 2) {
            throw new IllegalStateException("AndGate requires at least two inputs");
        }

        IOElement input1 = (IOElement) inputs.get(0);
        IOElement input2 = (IOElement) inputs.get(1);

        return !(input1.getOutput() || input2.getOutput());
    }
}

class XorGate extends Gatter {

    public XorGate(int x, int y, int width, int height) {
        super(x, y, width, height);
        this.type = Type.XOR;
    }
    @Override
    public boolean getOutput() {
        if (inputs.size() < 2) {
            throw new IllegalStateException("AndGate requires at least two inputs");
        }

        IOElement input1 = (IOElement) inputs.get(0);
        IOElement input2 = (IOElement) inputs.get(1);

        return (input1.getOutput() && !input2.getOutput()) || (!input1.getOutput() && input2.getOutput());
    }
}