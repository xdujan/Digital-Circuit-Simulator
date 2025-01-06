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