import Gatter;

class NorGate extends Gatter {

    public NorGate(int x, int y, int width, int height) {
        super(x, y, width, height);
        this.type = NOR;
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