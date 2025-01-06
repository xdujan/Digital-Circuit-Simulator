import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ElementImportExporter {

    static IOElement ioElementInstance;

    public ElementImportExporter(IOElement ioElementInstance) {
        this.ioElementInstance = ioElementInstance;
    }

    public static void importElements(String filepath) throws IOException {
        // Clear all Elements
        ioElementInstance.elements.clear();
        try (BufferedReader reader = new BufferedReader(new FileReader(filepath))) {
            String line;
            IOElement e = null;
            while ((line = reader.readLine()) != null) {
                // Map Attributes and Values into a Map
                Map<String, String> attributes = new HashMap<>();
                String[] parts = line.split(";");
                for (String part : parts) {
                    String[] keyValue = part.split(":");
                    if (keyValue.length == 2) {
                        attributes.put(keyValue[0], keyValue[1]);
                    }
                }

                String elementType = attributes.get("ElementType");

                if (elementType == null) {
                    return;
                }
                if (attributes.get("ElementType").compareTo("Connection") == 0) {
                    int outputElementID = Integer.parseInt(attributes.get("OutputElement"));
                    int inputElementID = Integer.parseInt(attributes.get("InputElement"));

                    IOElement outputElement = ioElementInstance.search(outputElementID);
                    outputElement.update();
                    IOElement inputElement = ioElementInstance.search(inputElementID);
                    inputElement.update();
                    int inputID = Integer.parseInt(attributes.get("InputID"));
                    ioElementInstance.createConnection(inputElement, new int[]{0, 1}, outputElement, new int[]{inputID + 1, 0});

                    break;
                }
                if (attributes.get("ElementType").compareTo("Gatter") == 0) {
                    e = ioElementInstance.createGate(attributes.get("type"));
                } else if (elementType.compareTo("Switch") == 0) {
                    e = ioElementInstance.createSwitch(attributes.get("type"));
                    Switch s = (Switch) e;
                    s.state = Boolean.parseBoolean(attributes.get("state"));
                }

                if (e != null) {
                    e.id = Integer.parseInt(attributes.get("ID"));
                    e.x = Integer.parseInt(attributes.get("X"));
                    e.y = Integer.parseInt(attributes.get("Y"));
                    e.width = Integer.parseInt(attributes.get("Width"));
                    e.height = Integer.parseInt(attributes.get("Height"));
                    e.isActive = Boolean.parseBoolean(attributes.get("isActive"));
                    // e.isActive = Boolean.parseBoolean(attributes.get("isHovered"));
                    e.conLength = Integer.parseInt(attributes.get("conLength"));
                    e.numInputs = Integer.parseInt(attributes.get("numInputs"));
                    e.numOutputs = Integer.parseInt(attributes.get("numOutputs"));
                }

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void exportElements(List<Element> elements, String filePath) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            for (Element element : elements) {
                writer.write(elementToString(element));
                writer.newLine();
            }
            // Filter and convert the list of Element to a list of IOElement
            List<IOElement> ioElements = elements.stream()
                    .filter(e -> e instanceof IOElement)
                    .map(e -> (IOElement) e)
                    .collect(Collectors.toList());
            writer.write(connectionsToString(ioElements));
            System.out.println("wrote");
        }
    }

    public static String connectionsToString(List<IOElement> elements) {
        StringBuilder sb = new StringBuilder();

        for (IOElement ioElement : elements) {
            int counter = 0;
            for (IOElement input : ioElement.inputs) {
                if (input != null) {
                    sb.append("ElementType:Connection;").append("OutputElement:").append(ioElement.id).append(";InputElement:").append(input.id).append(";InputID:").append(counter++).append(";");
                    sb.append(System.lineSeparator());
                }
            }
        }
        return sb.toString();
    }

    private static String elementToString(Element element) {
        StringBuilder sb = new StringBuilder();
        if (element instanceof IOElement) {
            IOElement ioElement = (IOElement) element;

            if (ioElement instanceof Gatter) {
                sb.append("ElementType:").append("Gatter;");
                sb.append("type:").append(((Gatter) ioElement).type).append(";");
            } else if (ioElement instanceof Switch.InputElement) {
                sb.append("ElementType:").append("Switch.InputElement;");
                sb.append("state:").append(((Switch.InputElement) ioElement).state).append(";");
                sb.append("type:").append(((Switch.InputElement) ioElement).type).append(";");
            } else if (ioElement instanceof Switch.OutputElement) {
                sb.append("ElementType:").append("Switch.OutputElement;");
                sb.append("state:").append(((Switch.OutputElement) ioElement).state).append(";");
                sb.append("type:").append(((Switch.OutputElement) ioElement).type).append(";");
            }

            sb.append("ID:").append(ioElement.id).append(";");
            sb.append("X:").append(ioElement.x).append(";");
            sb.append("Y:").append(ioElement.y).append(";");
            sb.append("Width:").append(ioElement.width).append(";");
            sb.append("Height:").append(ioElement.height).append(";");
            sb.append("State:").append(ioElement.getOutput()).append(";");
            sb.append("isActive:").append(ioElement.isActive).append(";");
            sb.append("isHovered:").append(ioElement.isHovered).append(";");
            sb.append("conLength:").append(ioElement.conLength).append(";");
            sb.append("numInputs:").append(ioElement.numInputs).append(";");
            sb.append("numOutputs:").append(ioElement.numOutputs).append(";");
        } else {
            sb.append("ElementType:").append("Element;");
            sb.append("ID:").append(element.id).append(";");
            sb.append("X:").append(element.x).append(";");
            sb.append("Y:").append(element.y).append(";");
            sb.append("Width:").append(element.width).append(";");
            sb.append("Height:").append(element.height).append(";");
            sb.append("isActive:").append(element.isActive).append(";");
            sb.append("isHovered:").append(element.isHovered).append(";");
        }
        // Fügen Sie hier weitere Attribute hinzu, die exportiert werden sollen
        return sb.toString();
    }
}