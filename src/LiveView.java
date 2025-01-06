
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

public class LiveView {

    private static final String STATIC_FILES_PATH = "src/web/"; // Directory for static files
    private static final String INDEX_FILE_PATH = STATIC_FILES_PATH + "index.html";

    private HttpServer server;
    private Map<String, Integer> intToGate = new HashMap<>();

    //IOElement ioElementinstance;

    public static int  width=1920, height=1080;

    public LiveView() throws IOException {

        
        //this.ioElementinstance = ioElementInstance;
        server = HttpServer.create(new InetSocketAddress(50001), 0);
        server.createContext("/", this::serveIndexHtml);
        server.createContext("/static", this::serveStaticFiles);
        server.createContext("/operation", new OperationHandler());
        server.createContext("/fetchChanges", new fetchChanges());
        server.createContext("/getElements", new getElements());
        server.createContext("/checkLegalConnection", new checkLegalConnection());
        server.createContext("/getLines", new getLines());
        server.createContext("/exportElements", new ExportElements());
        server.createContext("/getResolution", new GetResolution(this));

        //server.createContext("/createIOConnection", new createIOConnection());
        server.setExecutor(Executors.newCachedThreadPool()); // creates a default executor

        //Initialize
        System.out.println("Working Directory = " + System.getProperty("user.dir"));
        //Gatter gatter = new Gatter();
    }

    private void serveIndexHtml(HttpExchange exchange) throws IOException {
        Path filePath = Paths.get(INDEX_FILE_PATH);
        if (Files.exists(filePath)) {
            // Read the content of index.html
            byte[] content = Files.readAllBytes(filePath);

            // Send HTTP response
            exchange.getResponseHeaders().set("Content-Type", "text/html");
            exchange.sendResponseHeaders(200, content.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(content);
            }
        } else {
            // File not found, send 404
            String errorMessage = "404 Not Found: " + INDEX_FILE_PATH;
            exchange.sendResponseHeaders(404, errorMessage.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(errorMessage.getBytes());
            }
        }
    }

    private void serveStaticFiles(HttpExchange exchange) throws IOException {
        String filePathStr = STATIC_FILES_PATH + exchange.getRequestURI().getPath().replace("/static", "");
        Path filePath = Paths.get(filePathStr);
        if (Files.exists(filePath)) {
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Read the content of the file
            byte[] content = Files.readAllBytes(filePath);

            // Send HTTP response
            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, content.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(content);
            }
        } else {
            // File not found, send 404
            String errorMessage = "404 Not Found: " + filePathStr;
            exchange.sendResponseHeaders(404, errorMessage.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(errorMessage.getBytes());
            }
        }
    }

    static class OperationHandler implements HttpHandler {

        //IOElement ioElementInstance;

        public OperationHandler() {
            //this.ioElementInstance = ioElementInstance;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                InputStream inputStream = exchange.getRequestBody();
                String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                // Output the received JSON
                //System.out.println("Received JSON: " + body);
                //convert to JSON operation
                //System.out.println(body);
                int[] output = convertJsonOperation(body);

                String response = "";
                // Send response
                if (body.split(";")[0] == "7" && output != null) {
                    for (int val : output) {
                        response += val + ";";
                    }
                }

                response = "Test";

                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else if ("GET".equals(exchange.getRequestMethod())) {
                // Handle GET request
                String response = "This is the response to your GET request";
                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

        public int[] convertJsonOperation(String data) {
            /*
             * 0: create Gate | gateType | x,y
             * 1: create Line | gate1,gate2 | OutputNumber, InputNumber
             * 2: move Gate | gateID | offsetX, offsetY
             * 3: change Gate Attribute | gateID | attributeName: value[]
             * 4: setActive | gateID[] | boolean[]
             * 5: setHovered | gateID | boolean 
             * 6: isInside | empty | posX,posY -> return gateID
             * 7: delete Gate | gateIDs[] | empty
             * 8:  
             */

            try {
                // Remove all double quotes from the data string
                data = data.replace("\"", ""); //Lösche Übrige Anführungszeichen

                String[] dataArray = data.split(";"); //Teile String in einzelne Arrayabteile

                if (dataArray.length < 3) {
                    throw new IllegalArgumentException("Invalid data format: " + Arrays.toString(dataArray));
                }
                //System.out.println(data);
                int operator = Integer.parseInt(dataArray[0]);

                // Convert Ids to int
                int[] gateIDs = new int[0];
                String[] gateIDStrings = dataArray[1].split(":");
                if (!(gateIDStrings[0].compareTo("NULL") == 0 || gateIDStrings[0].compareTo("NaN") == 0) || gateIDStrings[0].compareTo("undefined") == 0) {
                    gateIDs = new int[gateIDStrings.length];
                    for (int i = 0; i < gateIDStrings.length; i++) {
                        if (gateIDStrings[i].matches("\\d+")) {
                            gateIDs[i] = Integer.parseInt(gateIDStrings[i]);
                        }
                    }
                }
                // Convert values to int

                int[] values = null;

                String[] valueStrings = dataArray[2].split(":");

                if (!(valueStrings[0].compareTo("NULL") == 0)) {
                    values = new int[valueStrings.length];

                    for (int i = 0; i < valueStrings.length; i++) {
                        values[i] = (int) Double.parseDouble(valueStrings[i]);
                        //System.out.println(i + ":" + values[i]);
                    }

                }
                //System.out.println("operator: " + operator + " gateIDs: " + gateIDs + " values: " + values);

                // Surround performJsonOperation with try-catch
                try {
                    performJsonOperation(operator, gateIDs, values);
                } catch (Exception e) {
                    System.err.println("Error performing JSON operation: " + e.getMessage());
                    e.printStackTrace();
                }
            } catch (Exception e) {
                System.err.println("Error processing JSON operation: " + e.getMessage());
                e.printStackTrace();
            }
            return null;
        }


        /* 0: create Gate | gateType | x,y
        * 1: create Line | gate1,gate2 | OutputNumber, InputNumber
        * 2: move Gate | gateID | offsetX, offsetY
        * 3: change Gate Attribute | gateID | attributeName: value[]
        * 4: setActive | gateID[] | boolean[]
        * 5: setHovered | gateID | boolean 
        * 6: isInside | empty | posX,posY -> return gateID
        * 7: delete Gate | gateIDs[] | empty
        * 8: makeConnection | gate1,gate2 | activeIO1, activeIO2
        * 10: create Switch | type
        * 11: toggle InputState | gateID |
        * 12: CopyElements | | gateIds
         */
        public int[] performJsonOperation(int operator, int[] gateIDs, int[] values) {
            //System.out.println(operator);
            if(operator==4) System.out.println("wruairia");
            switch (operator) {
                case 0:
                    System.out.println("gateIDs: " + Arrays.toString(gateIDs) + ", values: " + Arrays.toString(values));
                    IOElement.createGate(gateIDs[0], values[0], values[1]);
                    //System.out.println("parsed");   

                    break;
                case 1:
                    break;
                case 2:
                System.out.println(operator+" "+gateIDs[0]);
                    Element.moveMultiple(gateIDs, values[0],values[1]);
                    break;
                case 3:
                    break;
                case 4:
                    Element.setActiveMultiple(gateIDs, values);

                    break;
                case 5: //Set Hovered
                    //Clear prev Hovered
                    
                    
                    int counter = 0;
                    boolean boolValue = false;
                    if (gateIDs.length == 0) {
                        break;
                    }
                   
                    for (int i : gateIDs) {
                        //System.out.println(i+":");
                        
                        switch (values[counter++]) {
                            case 0 ->
                                boolValue = false;
                            case 1 ->
                                boolValue = true;
                            default -> {
                            }
                        }
                        Element element = Element.search(i);
                        if(element!=null) {
                        element.isHovered = boolValue;
                    }
                }

                    break;
                case 6:
                    return Element.getInsideElements(values[0], values[1]);
                case 7:
                    System.out.println("deleted");
                    Element.deleteElementsByID(gateIDs);
                case 8:
                    //System.out.println(Arrays.toString(gateIDs) + " " + Arrays.toString(values));
                    IOElement.createConnection(IOElement.search(gateIDs[0]), new int[]{values[0], values[1]}, IOElement.search(gateIDs[1]), new int[]{values[2], values[3]});
                    break;
                case 10:
                    if (gateIDs[0] == 0) {
                        IOElement.createSwitch(IOType.INPUT, values[0], values[1]);
                    }
                    if (gateIDs[0] == 1) {
                        IOElement.createSwitch(IOType.OUTPUT, values[0], values[1]);
                    }
                    break;
                case 11:
                    //System.out.println(gateIDs[0] + "yeo");
                    IOElement temp = IOElement.search(gateIDs[0]);
                    if (temp instanceof Switch.InputElement) {
                        Switch.InputElement io = (Switch.InputElement) temp;
                        io.toggleState();
                    }
                case 12:
                System.out.println("copied");
                    if(gateIDs.length>0) {
                        try {
                            for (int gateID : gateIDs) {
                                System.out.println("Gate ID: " + gateID);
                            }
                            int[] mouseOffsets = new int[2];
                            mouseOffsets[0] = values[2]-values[0];
                            mouseOffsets[1] = values[3]-values[1];
                        IOElement.copyElements(gateIDs,mouseOffsets);
                    } catch(Exception e) {
                        System.err.println("Error copying elements: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
                    break;
                default:

                    break;
            }
            return null;
        }
    }

    static class fetchChanges implements HttpHandler {

        //final private IOElement ioElementInstance;

        public fetchChanges() {
            //this.ioElementInstance = ioElement;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                // Compute the hash for gates and lines
                String response = generateHash();

                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

        public String generateHash() {
            List<Element> list = Element.elements;
            int hash = 0;
            int counter = 0;
            for (Element g : list) {
                //System.out.println("Counter:"+ ++counter+" hash:"+hash);
                hash += g.generateHash();
            }
            for (Line l : Line.lines) {
                hash += l.generateHash();
            }

            return String.valueOf(hash);
        }
    }

    static class getLines implements HttpHandler {

        //final private IOElement ioElementInstance;
        //final private Line lineInstance;

        public getLines() {
            
            //this.lineInstance = lineInstance;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                // Compute the hash for gates and lines
                String response = "";
                int counter = 0;
                Line.updateLines();
                for (Line l : Line.lines) {
                    l.update();
                    response += "id:" + l.id + ";inputPos:" + l.pos[0][0] + "-" + l.pos[0][1] + ";outputPos:" + l.pos[1][0] + "-" + l.pos[1][1] + ";state:" + l.state;

                    if (++counter < Line.lines.size()) {
                        response += "|";
                    }
                }

                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

        public String generateHash() {
            List<Element> list = Element.elements;
            int hash = 0;
            int counter = 0;
            for (Element g : list) {
                //System.out.println("Counter:"+ ++counter+" hash:"+hash);
                hash += g.generateHash();
            }

            return String.valueOf(hash);
        }
    }

    static class checkLegalConnection implements HttpHandler {

        //final private IOElement ioElementInstance;

        //3 Ids
        int outputID = 4;
        int inputID = 4;
        int inputConnectionId = 4;

        public checkLegalConnection() {
            //this.ioElementInstance = ioElementInstance;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                // Handle preflight request
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
                exchange.sendResponseHeaders(204, -1); // No Content
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                // Set CORS headers
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

                InputStream inputStream = exchange.getRequestBody();
                String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                //System.out.println(body);
                // Format OutputElementID | InputElementID | InputElementConnectionID
                String[] bodyArray = body.split(";");

                int outputID = Integer.parseInt(bodyArray[0]);
                int[] outputActiveIO = Arrays.stream(bodyArray[1].split(":")).mapToInt(Integer::parseInt).toArray();
                int inputID = Integer.parseInt(bodyArray[2]);
                int[] inputActiveIO = Arrays.stream(bodyArray[3].split(":")).mapToInt(Integer::parseInt).toArray();

                //System.out.println("outputID: " + outputID + " oAIO: " + Arrays.toString(outputActiveIO) + " inputID: " + inputID + " iAIO: " + Arrays.toString(inputActiveIO));
                /* //Determine output and input
                if(outputActiveIO[1]==0) {
                    //Switch ios
                    int tempOutputID = outputID;
                    int[] tempoutputActiveIO = outputActiveIO;
                    outputID = inputID;
                    outputActiveIO = inputActiveIO;
                    inputID = tempOutputID;
                    inputActiveIO = outputActiveIO;
                } */

                String response = "0";

                //Red
                if (inputID == outputID) {
                    response = "1";
                } else if ((outputActiveIO[1] > 0 && inputActiveIO[1] > 0) || outputActiveIO[0] > 0 && inputActiveIO[0] > 0) {
                    response = "1";
                } else if ((outputActiveIO[1] > 0 && inputActiveIO[0] > 0)) {
                    response = "2";
                }

                /*     // Wenn dasselbe Gatter
        if (ids[0] == ids[1]) {
            response = "1";
            // Wenn Gatter mit Input verbunden wird (Richtig)
        } else if (ids[2] < 2) {
            response = "2";
            // Wenn verbunden mit anderem Output (Falsch)
        } else {
            response = "1";
        } */
                // Log the response
                //System.out.println("Response: " + response);
                // Send the response
                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

    }

    static class createIOConnection implements HttpHandler {

        final private Gatter gatter;
        final private Switch switchInstance;

        //3 Ids
        int outputID = 4;
        int inputID = 4;
        int inputConnectionId = 4;

        public createIOConnection(Gatter gatter, Switch switchInstance) {
            this.gatter = gatter;
            this.switchInstance = switchInstance;

        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            if ("POST".equals(exchange.getRequestMethod())) {
                // Set CORS headers
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

                InputStream inputStream = exchange.getRequestBody();
                String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                // Format OutputElementID | InputElementID | InputElementConnectionID
                String[] bodyArray = body.split(";");
                int[] ids = new int[4];
                ids[0] = Integer.parseInt(bodyArray[0]);
                ids[1] = Integer.parseInt(bodyArray[1]);
                ids[2] = Integer.parseInt(bodyArray[2]);
                ids[3] = Integer.parseInt(bodyArray[3]);

                String response = "";
                if ((ids[1] < 2) && (ids[3] == 2) || (ids[1] == 2 && ids[3] < 2)) {
                    response = "2";
                }

                // Log the response
                //System.out.println("Response: " + response);
                // Send the response
                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

    }

    static class GetResolution implements HttpHandler {
        final LiveView liveViewInstance;
        public GetResolution(LiveView liveViewInstance) {
            this.liveViewInstance = liveViewInstance;

        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            if ("POST".equals(exchange.getRequestMethod())) {

                System.out.println("yop");
                // Set CORS headers
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

                InputStream inputStream = exchange.getRequestBody();
                String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                // Format width | height -> ERR/OK
                String response = "";
                String[] bodyArray = body.split(";");
                if(bodyArray[0].isEmpty()||bodyArray[1].isEmpty()) {
                    //throw new IllegalArgumentException("Invalid Resolution. Falling Back to Default 1920x1080");
                    response = "ERR";
                } else {
                    int width = Integer.parseInt(bodyArray[0]);
                int height = Integer.parseInt(bodyArray[1]);

                System.out.println("Sent Width:"+width+" HEight: "+height);
                liveViewInstance.width = width;
                liveViewInstance.height = height;
                response = "OK";

                Element.checkForOutofBoundsElements();
                }

                

                // Log the response
                //System.out.println("Response: " + response);
                // Send the response
                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

    }

    static class ExportElements implements HttpHandler {

       

        //3 Ids
        int outputID = 4;
        int inputID = 4;
        int inputConnectionId = 4;

        //final private IOElement ioElementInstance;
        public ExportElements() {
            //this.ioElementInstance = ioElementInstance;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            if ("GET".equals(exchange.getRequestMethod())) {
                // Compute the hash for gates and lines
                String response = "";
                
                try {
                    String userDir = System.getProperty("user.dir");
                    String filePath = userDir + "/export/elements.txt";
                    ElementImportExporter.exportElements(Element.elements, filePath);
                    //ioElementInstance.importElements(filePath);
                    System.out.println("Elements exported to: " + filePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                

                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

    }

    static class getElements implements HttpHandler {

        //final private IOElement ioElementInstance;
        //final private Line lineInstance;

        public getElements() {
            //this.ioElementInstance = ioElement;
            //this.lineInstance = lineInstance;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                // Compute the hash for gates and lines

                //Gson gson = new GsonBuilder().setPrettyPrinting().create();
                String response = gatesToJson();
                response += switchesToJson();
                response += annotationsToJson();

                //System.out.println(response);
                //response += linesToJson();
                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream outputStream = exchange.getResponseBody()) {
                    outputStream.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

        public String switchesToJson() {
            List<Switch> switches = Element.elements.stream()
                    .filter(element -> element instanceof Switch)
                    .map(element -> (Switch) element)
                    .collect(Collectors.toList());
            String resp = "";
            int counter = 0;

            for (Switch s : switches) {

                //Update switch
                String type = "";
                if (s instanceof Switch.OutputElement) {
                    type = "OUTPUT";
                }
                if (s instanceof Switch.InputElement) {
                    type = "INPUT";
                }
                resp += "type:" + type + ";id:" + s.id + ";x:" + s.x + ";y:" + s.y + ";width:" + s.width + ";height:" + s.height + ";state:" + s.getOutput() + ";isHovered:" + s.isHovered + ";isActive:" + s.isActive;

                if (counter++ < switches.size() - 1) {
                    resp += "|";
                }
            }
            resp += "`";
            //System.out.println(resp);
            return resp;
        }

        public String annotationsToJson() {
            List<Annotation> annotations = Annotation.annotations; 
            String resp = "";
            int counter = 0;

            for (Annotation s : annotations) {

                //Update switch
                String type = "";
                resp += "id:" + s.id+";x:" + s.x +";y:" + s.y + ";text:"+s.text+";width"+s.width+";height:"+s.height+";fontSize:"+s.fontSize+";isActive:"+s.isActive+";isHovered:"+s.isHovered;

                if (counter++ < annotations.size() - 1) {
                    resp += "|";
                }
            }
            resp += "`";
            //System.out.println(resp);
            return resp;
        }

        public String linesToJson() {
            List<Line> lines = Line.lines;
            String resp = "";
            int counter = 0;
            for (Line line : lines) {
                //Update position
                line.update();
                resp += "id:" + line.id + ";pos:" + line.pos[0][0] + "/" + line.pos[0][1] + "/" + line.pos[1][0] + "/" + line.pos[1][1] + ";state:" + line.state;
            }
            resp += "`";
            return resp;

        }

        public String gatesToJson() {
            List<Gatter> gates = Element.elements.stream()
                    .filter(element -> element instanceof Gatter)
                    .map(element -> (Gatter) element)
                    .collect(Collectors.toList());
            String req = "";
            int counter = 0;
            for (Gatter g : gates) {//Optimisierungsmöglichkeit: inputs und outputs werden mit schleifen hinzugefügt, dynamisch
                req += "type:" + g.type + ";id:" + g.id + ";x:" + g.x + ";y:" + g.y + ";width:" + g.width + ";height:" + g.height + ";isActive:" + g.isActive + ";isHovered:" + g.isHovered + ";inputPos:" + g.inputPos[0][0] + "-" + g.inputPos[0][1] + "-" + g.inputPos[1][0] + "-" + g.inputPos[1][1] + ";outputPos:" + g.outputPos[0] + "-" + g.outputPos[1] + ";conLength:"+g.conLength+";";
                if (counter++ < gates.size() - 1) {
                    req += "|";
                }

            }
            req += "`";
            return req;
        }
    }

    public void start() {
        server.start();
        System.out.println("Server started on port 50001");
    }

    void initializeMaps() {
        setupStringToGates();
    }

    void setupStringToGates() {
        // GateTypes: 0-AND;1-NAND;2-NOT;-3-OR;4-NOR;5-XOR
        intToGate.put("AND", 0);
        intToGate.put("NAND", 1);
        intToGate.put("NOT", 2);
        intToGate.put("OR", 3);
        intToGate.put("NOR", 4);
        intToGate.put("XOR", 5);
    }
}
