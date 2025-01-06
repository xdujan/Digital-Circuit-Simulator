layer1 = document.getElementById("layer1");
ctx1 = layer1.getContext("2d");

layer2 = document.getElementById("layer2");
ctx2 = layer2.getContext("2d");

//For Move Preview
layer3 = document.getElementById("layer3");
ctx3 = layer3.getContext("2d");

//For Lines
layer4 = document.getElementById("layer4");
ctx4 = layer4.getContext("2d");

//For LineDrawingPreview
layer5 = document.getElementById("layer5");
ctx5 = layer5.getContext("2d");

//Other
//ctx1.fillStyle = "pink";
//ctx1.fillRect(0,0,400,400);

// Constant Width and Height
const width = window.innerWidth - 15;
const height = window.innerHeight - 300;

// Set Canvas Width to variables
layer1.width = width;
layer1.height = height;

// Center Variables
const centerX = layer1.width / 2;
const centerY = layer1.height / 2;

layer2.width = width;
layer2.height = height;

layer3.width = width;
layer3.height = height;

layer4.width = width;
layer4.height = height;

layer5.width = width;
layer5.height = height;

let isSelecting = false;

//public Variables
let connectionObjectInput;
let connectionObjectOutput;

let input1Hovered = false;
let input2Hovered = false;

let outputHovered = false;

let selectedIO = null;

let isLineDrawing = false;


let movePrev = [];

let elements = [];
class InputOutputElement {
  activeIO = null;
  isActive = false;
  isHovered = false;

  id;

  
  input = [[0, 0], [0, 0]]; // Initialize input array with default values
  output = [0, 0]; 
  inputState;

  //Positional
  x = 15;
  y = 15;
  width = 50;
  height = 50;


  static addElement(element) {
    InputOutputElement.elements.push(element);
  }

  static getElements() {
    return InputOutputElement.elements;
  }

 
  constructor(x, y) {
    this.x = x;
    this.y = y;
    elements.push(this);

    if (x != null && y != null) {
      this.x = x;
      this.y = y;
    }
  }
  
  
    updateIOPos() {
      this.input[0][0] = this.x - this.conLength;
      this.input[0][1] = this.y;
  
      this.input[1][0] = this.x - this.conLength;
      this.input[1][1] = this.y + this.height;
  
      this.output[0] = this.x + this.width + this.conLength;
      this.output[1] = this.y + Math.round(this.height / 2);
    }
    isInside(x, y) {
      return (
        x > this.x &&
        x < this.x + this.width &&
        y > this.y &&
        y < this.y + this.height
      );
  

      


}
getHoveredIO_ID() {
  
}
}

class GateMove {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.startX = x;
    this.startY = y;
  }

  move(offsetX, offsetY) {
    //
    this.x = this.startX + offsetX;
    this.y = this.startY + offsetY;
    //console.log("X:"+this.offsetX+"Y:"+this.offsetY);
    this.draw(ctx3);
  }

  draw(ctx3) {
    ctx3.strokeStyle = "orange";
    ctx3.lineWidth = 2;
    ctx3.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Line {
  inputPos = [];
  outputPos = [];

  inputElement;
  outputElement;

  inputIndex;
  outputIndex;

  constructor(inputElement, inputIndex, outputElement) {
    this.inputElement = inputElement;
    this.outputElement = outputElement;
    this.inputIndex = inputIndex;
    //this.outputIndex = outputIndex;
  }

  updatePos() {
    this.inputPos = this.inputElement.getInput(this.inputIndex);
    this.outputPos = this.outputElement.getOutput();
  }

  draw(ctx4) {
    ctx4.beginPath();
    ctx4.moveTo(this.inputPos[0], this.inputPos[1]);
    ctx4.lineTo(this.outputPos[0], this.outputPos[1]);

    ctx.fillStyle = "coral";
    ctx.stroke();
  }
}

class Switch extends InputOutputElement {
  static Type = Object.freeze({
    INPUT: "Input",
    OUTPUT: "Output",
  });

  constructor(type, x,y) {
    super(x,y);
    this.type = type;
  }
}

class Gatter extends InputOutputElement {


  id;
  type;
  isActive = false;
  isHovered = false;

  conLength = 15;

  static GatterType = Object.freeze({
    AND: "AND",
    OR: "OR",
    NOT: "NOT",
    NAND: "NAND",
    NOR: "NOR",
    XOR: "XOR",
    XNOR: "XNOR", //vllt weg
  });

  //IO Positions
  input = [
    [0, 0],
    [0, 0],
  ]; // Correctly initialize as a 2D array
  output = [0, 0];

  activeIO = [[], []];

  constructor(x, y) {
    super(x,y);
    
    
    this.updateIOPos();
  }

  draw(ctx1) {
 
    ctx1.strokeStyle = "grey";
    ctx1.fillStyle = "grey";

    //Draw Base Rectangle
    ctx1.fillRect(this.x, this.y, this.width, this.height);

    //input 1
    if (this.input1Hovered == true) ctx1.strokeStyle = "yellow";
    ctx1.beginPath();
    ctx1.moveTo(this.x, this.y);
    ctx1.lineTo(this.x - this.conLength, this.y);
    ctx1.stroke();

    ctx1.strokeStyle = "grey";
    //input 2
    if (this.input2Hovered == true) ctx1.strokeStyle = "yellow";
    ctx1.beginPath();
    ctx1.moveTo(this.x, this.y + this.height);
    ctx1.lineTo(this.x - this.conLength, this.y + this.height);
    ctx1.stroke();

    ctx1.strokeStyle = "grey";
    //Output
    if (this.outputHovered == true) ctx1.strokeStyle = "yellow";
    ctx1.beginPath();
    ctx1.moveTo(this.x + this.width, this.y + this.height / 2);
    ctx1.lineTo(this.x + this.width + this.conLength, this.y + this.height / 2);
    ctx1.stroke();

    //Check for Highlighting
    //ctx1.strokeStyle = "darkgrey";
    if (this.isActive == true) {
      ctx1.strokeStyle = "yellow";
    } else if (this.isHovered == true) {
      ctx1.strokeStyle = "white";
    } else {
      ctx1.strokeStyle = "darkgrey";
    }

    //Draw Highlighting
    ctx1.lineWidth = 2.1;
    ctx1.strokeRect(this.x, this.y, this.width, this.height);

    //Draw Text
    ctx1.fillStyle = "black";
    // Measure the text width
    const text = this.type;
    const textWidth = ctx1.measureText(text).width;

    // Adjust the x and y coordinates to center the text
    const textX = this.x + this.width / 2 - textWidth / 2;
    const textY = this.y + this.height / 2 + 5; // Adjust y to vertically center the text

    ctx1.fillText(text, textX, textY);
  }

  threshold = 15;
  drawLineHighlight(ctx4) {
    const inputX1 = this.inputPos[0][0];
    const inputY1 = this.inputPos[0][1];
    const inputX2 = this.inputPos[1][0];
    const inputY2 = this.inputPos[1][1];

    const outputX = this.outputPos[0];
    const outputY = this.outputPos[1];

    //console.log(this.outputPos[0]+" "+this.outputPos[1]+" Currentmouse: X:"+mouseX+" Y:"+mouseY);

    /*  if (
      Math.abs(mouseX - inputX1) <= this.threshold &&
      Math.abs(mouseY - inputY1) <= this.threshold
    ) {
      this.input1Hovered = true;
    } else if (
      Math.abs(mouseX - inputX2) <= this.threshold &&
      Math.abs(mouseY - inputY2) <= this.threshold
    ) {
      this.input2Hovered = true;
    } else {
      this.input1Hovered = false;
      this.input2Hovered = false;
    } */

    if (
      Math.abs(mouseX - outputX) <= this.threshold &&
      Math.abs(mouseY - outputY) <= this.threshold
    ) {
      this.outputHovered = true;
    } else {
      this.outputHovered = false;
    }

    this.ioID = this.getHoveredIO_ID();
    //console.log("ID: "+this.ioID);

    switch (this.ioID) {
      case 0:
        this.input1Hovered = true;
        break;
      case 1:
        this.input2Hovered = true;
        break;
      case 2:
        this.outputHovered = true;

      default:
        this.input1Hovered = false;
        this.input2Hovered = false;
        this.out;
        break;
    }
    /* if(mouseX<(this.inputPos[0][0]+this.threshold)&&(mouseX>(this.inputPos[0][0]-this.threshold))&&(mouseY<(this.inputPos[0][1]+this.threshold))&&(mouseY>(this.inputPos[0][1]-this.threshold))) {
      this.input1Hovered = true;
    } else if((mouseX<(this.inputPos[1][0]+this.threshold))&&(mouseX>(this.inputPos[1][0]-this.threshold))&&(mouseY<(this.inputPos[1][1]+this.threshold))&&(mouseY>(this.inputPos[1][1]-this.threshold))) {
      this.input2Hovered=true;
    } else {
      this.input1Hovered = false;
      this.input2Hovered = false;
    } */
    //ctx4.strokeRect(this.inputPos[0][0],this.inputPos[0][1],5,5);
  }
  
  
  getHoveredIO() {
    const inputX1 = this.input[0][0];
    const inputY1 = this.input[0][1];
    const inputX2 = this.input[1][0];
    const inputY2 = this.input[1][1];

    const outputX = this.output[0];
    const outputY = this.output[1];
    if (
      Math.abs(mouseX - inputX1) <= this.threshold &&
      Math.abs(mouseY - inputY1) <= this.threshold
    ) {
      return true;
    } else if (
      Math.abs(mouseX - inputX2) <= this.threshold &&
      Math.abs(mouseY - inputY2) <= this.threshold
    ) {
      return true;
    } else
    if (
      Math.abs(mouseX - outputX) <= this.threshold &&
      Math.abs(mouseY - outputY) <= this.threshold) {
        return true;
      }
  }

  getHoveredIO_ID() {
    const inputX1 = this.input[0][0];
    const inputY1 = this.input[0][1];
    const inputX2 = this.input[1][0];
    const inputY2 = this.input[1][1];

    const outputX = this.output[0];
    const outputY = this.output[1];
    if (
      Math.abs(mouseX - inputX1) <= this.threshold &&
      Math.abs(mouseY - inputY1) <= this.threshold
    ) {
      this.activeIO[0]=1;
      return this.activeIO;
    } else if (
      Math.abs(mouseX - inputX2) <= this.threshold &&
      Math.abs(mouseY - inputY2) <= this.threshold
    ) {
      this.activeIO[0]=2;
      return this.activeIO;
    }
    if (
      Math.abs(mouseX - outputX) <= this.threshold &&
      Math.abs(mouseY - outputY) <= this.threshold
    ) {
      this.activeIO[1]=1;
      return this.activeIO;
    }

    return null;
  }

  getInput(index) {
    return this.input[index];
  }
  getOutput() {
    return this.output;
  }
  /* isInsideAnyIO() {
    const inputX1 = this.inputPos[0][0];
    const inputY1 = this.inputPos[0][1];
    const inputX2 = this.inputPos[1][0];
    const inputY2 = this.inputPos[1][1];

    const outputX = this.outputPos[0];
    const outputY = this.outputPos[1];
    if (
      (Math.abs(mouseX - inputX1) <= this.threshold &&
      Math.abs(mouseY - inputY1) <= this.threshold) ||  (Math.abs(mouseX - inputX2) <= this.threshold &&
      Math.abs(mouseY - inputY2) <= this.threshold) || (Math.abs(mouseX - outputX) <= this.threshold &&
      Math.abs(mouseY - outputY) <= this.threshold)
    ) {
      return true;
    } 
    return false;
  } */
}

function drawElements() {
  ctx1.clearRect(0, 0, layer1.width, layer1.height);

  elements.forEach((element) => {
    element.draw(ctx1);
  
    element.drawLineHighlight(ctx3);
  });
}
function drawMovePrev(ctx3) {
  //ctx3.clearRect(0,0,width,height);
  movePrev = createMovePreview();
  movePrev.forEach((gm) => {
    gm.draw(ctx3);
  });
}
let outgoingLine = null;
let state = null;
function lineDrawingPreview() {
  //console.log(color);
  //if (outgoingLine != null && (outgoingLine instanceof Gatter || outgoingLine instanceof InputOutputElements)) {
  console.log("current state:"+state);
  switch (state) {
    case "0":
      ctx5.strokeStyle = "grey";
      console.log("tweo");
      break;
    case "1":
      ctx5.strokeStyle = "red";
    break;
    case "2":
      ctx5.strokeStyle = "white";
      break;
    default:
      break;
  }
  if (isLineDrawing == true) {
    ctx5.clearRect(0, 0, layer5.width, layer5.height);
    ctx5.lineWidth = 3;
    ctx5.beginPath();
    ctx5.moveTo(outgoingLinePOS[0], outgoingLinePOS[1]);
    ctx5.lineTo(mouseX, mouseY);
    ctx5.stroke();
  }
  //}
}

function update() {
  document.getElementById("amtGates").innerText = elements.length;
  //fetchChanges();
  requestAnimationFrame(update);
  drawElements();
  if (isDragging) drawMovePrev(ctx3);

  if (isSelecting == true) {
    drawSelectionRectangle();
  }
  if(isLineDrawing==true) {
    //lineDrawing_checkForInGoingLine();
    lineDrawingPreview();
  }

  /* if(isLineDrawing==true) {
    lineDrawingPreview();
  } */
}

function checkHover() {
  elementIds = [];
  elements.forEach((element) => {
    if (element.isInside(mouseX, mouseY)) {
      //setHoverForGates(0);
      elementIds.push(element.id);
    }
  });
  if (elementIds.length > 0) {
    sendPostOperation(5, elementIds, 1);
  } else setHoverForElements(0);

  //if(idArray!="") sendPostOperation(5,idArray,true)
}

function drawSelectionRectangle() {
  ctx2.clearRect(0, 0, width, height);
  ctx2.lineWidth = 2;
  ctx2.strokeStyle = "white";
  ctx2.strokeRect(
    selectRectangleStartX,
    selectRectangleStartY,
    mouseX - selectRectangleStartX,
    mouseY - selectRectangleStartY
  );
}

gateHash = 0;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchChanges() {
  while (true) {
    const temp = await sendfetchChanges();

    //await GetGatesRequest();
    //console.log("Temp: "+temp+" hash:"+gateHash);
    if (temp !== gateHash) {
      gateHash = temp;
      //console.log("Loading new");
      //await GetGatesRequest();
      await getElementsRequest();
    }
    //console.log("refreshed");

    // Sleep for 0.5 seconds before sending the next request
    await sleep(50);
  }
}

//HTTP
async function sendfetchChanges() {
  try {
    const response = await fetch("http://localhost:50001/fetchChanges", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseText = await response.text();
    //console.log("Response from server:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function checkLegalConnection(data) {
  // Operation: setStart-Element 1
  // 


  
  try {
    const response = await fetch("http://localhost:50001/checkLegalConnection", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=UTF-8"
      },
      body: data
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    
    return responseText;
    console.log("Response from server:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getElementsRequest() {
  fetch("http://localhost:50001/getElements", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((responseText) => {
      //console.log("Response from server:", responseText);
      parseElementString(responseText);
      //console.log("yippie");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
async function GetGatesRequest() {
  fetch("http://localhost:50001/getGates", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((responseText) => {
      //console.log("Response from server:", responseText);
      elements = parseGatterString(responseText);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function sendPostRequest(data) {
  fetch("http://localhost:50001/operation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((responseText) => {
      //console.log("Response from server:", responseText);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function sendConnectionOperation(output, outputCon, input, inputCon) {
  const data = outputID + ";" + inputID + ";" + inputConnectionID;
  
  try {
    const response = await fetch("http://localhost:50001/createConnection", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=UTF-8"
      },
      body: data
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    
    return responseText;
    console.log("Response from server:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error:", error);
  }
}
function sendPostOperation(operation, gateID, values) {
  let response = "";

  response += operation + ";";
  //console.log("count");
  counter = 0;
  if (Array.isArray(gateID)) {
    gateID.forEach((gateId) => {
      if (counter++ < gateID.length) response += gateId + ":";
    });
    response += ";";
  } else if (gateID != null) {
    response += gateID + ";";
  } else {
    response += "NULL;";
  }

  counter = 0;
  if (Array.isArray(values)) {
    values.forEach((value) => {
      if (counter++ < values.length) response += value + ":";
    });
    response += ";";
  } else if (values != null) {
    //response += values + ";";

    if (Array.isArray(gateID)) {
      for (let index = 0; index < gateID.length; index++) {
        response += values + ":";
      }
    } else {
      response += values;
    }

    response += ";";
  } else {
    response += "NULL;";
  }

  if (operation == 2 || operation == 0) console.log(response); //alert("OUTGOING: "+response);
  sendPostRequest(response);
}
function sendCheckLegalConnection(outputID, outputConnectionID,inputID, inputConnectionID) {
  data = outputID + ";"+outputConnectionID[0]+":"+outputConnectionID[1]+";" + inputID + ";" + inputConnectionID[0]+":"+inputConnectionID[1];
  console.log(data);
  return checkLegalConnection(data);
}
//sendPostRequest(data);

function parseElementString(elementString) {
  elements = [];
  console.log("Response:" + elementString);
  //Clear the Element Arrays
  //gate.elements = [];

  elementStringArray = elementString.split("`");
  console.log("Gatter String:" + elementStringArray[0]);
  parseGatterString(elementStringArray[0]);
  //parseGatterString(elementStringArray[0]);
  //console.log(elementStringArray.length);
  elementStringArray.forEach((el) => {
    //console.log(el);
  });
}
function parseSwitchString(switchString) {}
function parseGatterString(gatterString) {
  
  //console.log(gatterString);
  const gatterArray = gatterString.split("|");

  gatterArray.forEach((gatterString) => {
    const attributes = gatterString.split(";");
    const gatterData = {};

    attributes.forEach((attribute) => {
      const [key, value] = attribute.split(":");
      gatterData[key] = value;
    });

    // Create a new Gatter object using the parsed data
    const newGatter = new Gatter(
      parseInt(gatterData.x),
      parseInt(gatterData.y)
    );
    newGatter.height = parseInt(gatterData.height);
    newGatter.width = parseInt(gatterData.width);
    newGatter.id = parseInt(gatterData.id);
    newGatter.type = gatterData.type;
    newGatter.isActive = gatterData.isActive === "true"; // Ensure boolean
    newGatter.isHovered = gatterData.isHovered === "true"; // Ensure boolean
    //console.log(inputStrings);
    //newGatter.inputPos =

    // Split InputPos into a 2x2 array
    //console.log(gatterData.inputPos);
    if (gatterData.inputPos) {
      const inputPosArray = gatterData.inputPos.split("-");
      const inputPos = [
        [inputPosArray[0], inputPosArray[1]],
        [inputPosArray[2], inputPosArray[3]],
      ];
      newGatter.inputPos = inputPos;
    } else {
      newGatter.inputPos = [
        [0, 0],
        [0, 0],
      ];
    }
    //Output
    if (gatterData.outputPos) {
      const outputPosArray = gatterData.outputPos.split("-");
      //console.log(outputPosArray[0],outputPosArray[1]);

      newGatter.outputPos = outputPosArray;
      //alert(outputPos[0]+" "+outputPos[1]+outputPos.length);
    } else {
      newGatter.outputPos = [0, 0];
    }

    //console.log(newGatter.id + " " + newGatter.isActive);

    //elements.push(newGatter);
  });

  elements.forEach((gate) => {
    //console.log(gate.type + "\n");
  });

  return elements;
}

rect = layer1.getBoundingClientRect();
let mouseX;
let mouseY;

let selectRectangleStartX, selectRectangleStartY;

let gateMoves = [];
let mouseDownX, mouseDownY;

outgoingLinePOS = [];
//Event-Actions
layer1.addEventListener("mousedown", (event) => {
  //console.log(mouseX + " : " + mouseY);

  if (isInsideAnyElements() == false && isInsideAnyIO() == false) {
    isSelecting = true;

    selectRectangleStartX = mouseX;
    selectRectangleStartY = mouseY;

    values = [];
    values[0] = mouseX;
    values[1] = mouseY;
  }
  //console.log(isInsideAnyElements());

  if (
    isInsideAnyIO() == true &&
    isInsideAnyElements() == false &&
    isSelecting == false &&
    isDragging == false &&
    isLineDrawing == false
  ) {
    isLineDrawing = true;

    elements.forEach((gate) => {
      if (gate.getHoveredIO_ID() != null) {
        lineDrawing_SetOutgoingLine(gate);
        //console.log(outgoingLine);
        let id = outgoingLine.getHoveredIO_ID();
        //console.log("id:" + id);

        if (id != null) {
          if (id < 2) {
            outgoingLinePOS = outgoingLine.getInput(id);
            //console.log(outgoingLinePOS[0]+":"+outgoingLinePOS[1]);
          } else if (id == 2) {
            outgoingLinePOS = outgoingLine.getOutput();
          }
        }
        //console.log("decl");
      }
    });
  }

  function lineDrawing_SetOutgoingLine(gatter) {
    if (
      gatter != null &&
      (gatter instanceof Switch || gatter instanceof Gatter)
    ) {
      outgoingLine = gatter;
    }
  }

  if (isInsideAnyElements() == false && isDragging == false) {
    setActiveForGates(0);
  }
  if (
    isInsideAnyElements() == true &&
    !event.ctrlKey &&
    isDragging == false &&
    isLineDrawing == false
  ) {
    //setActiveForGates(0);
    isDragging = true;
    gate = selectElementByMouse();

    sendPostOperation(4, gate.id, 1);
    //console.log(gate.isActive);
  }

  mouseDownX = mouseX;
  mouseDownY = mouseY;

  if (isInsideAnyElements() == true) {
    gateMoves = createMovePreview();
  }

  /* if(sendPostOperation(6,null,values)!=null) {
    console.log("test");
  } */
  //Sect Active Current
  //setActiveMouse();
  //Move Preview
});

let isDragging = false;
layer1.addEventListener("mousemove", (event) => {
  rect = layer1.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;

  if (isSelecting) {
    drawSelectionRectangle();
  }

  

  // Check for Hover
  checkHover();

  if (isDragging && !isSelecting) {
    const offsetX = mouseX - mouseDownX;
    const offsetY = mouseY - mouseDownY;

    ctx3.clearRect(0, 0, layer3.width, layer3.height);
    gateMoves.forEach((gateMove) => {
      gateMove.move(offsetX, offsetY);
    });
  }
});

layer1.addEventListener("mouseup", (event) => {
  //console.log(mouseX + " : " + mouseY);
  if (isLineDrawing == true) {
    isLineDrawing = false;
    ctx5.clearRect(0, 0, width, height);
  }
  isLineDrawing = false;

  //outgoingLine = null;
  if (isSelecting == true) {
    setActiveWithSelectionRectangle();
  }

  //Clear the Remaining selectRectangle
  ctx2.clearRect(0, 0, width, height);
  ctx3.clearRect(0, 0, width, height);

  //Finish Moving
  gid = [];
  pos = [];

  actives = getActiveGates();
  actives.forEach((gm) => {
    gid.push(gm.id);
  });

  if (isDragging == true) {
    pos[0] = (mouseX - mouseDownX);
    pos[1] = (mouseY - mouseDownY);

    if (gid.length > 0) sendPostOperation(2, gid, pos);
  }

  isSelecting = false;

  isDragging = false;

  outgoingLine = null;
  //GetGatesRequest();
});

layer1.addEventListener("click", (event) => {
  //fetchChanges();
  //GetGatesRequest();

  //Select/Deselect Gates
  if (!event.ctrlKey && isInsideAnyElements() == true) {
  }

  //console.log(isInsideAnyElements());
  if (isInsideAnyElements() == true && !event.ctrlKey) {
    element = selectElementByMouse();
    element.isActive = true;
  }
});

update();
fetchChanges();

function setActiveMouse() {
  elements.forEach((gate) => {
    if (gate.isInside(mouseX, mouseY) == true) {
      gate.isActive = !gate.isActive; // Toggle active state
      sendPostOperation(4, gate.id, gate.isActive ? 1 : 0);
    }
  });
}
function printAllGates() {
  counter = 0;
  elements.forEach((gate) => {
    //console.log(counter++ + ": " + gate.id);
  });
}

function createGate(typeID) {
  pos = [];
  if (mouseX == null || mouseY == null) {
    pos[0] = Math.round(width / 2); // Rounds down
    pos[1] = Math.round(height / 2); // Rounds down
  } else {
    pos[0] = mouseX;
    pos[1] = mouseY;
  }

  console.log(typeID.length + "ye");
  sendPostOperation(0, typeID, pos);
  //console.log("sent");
}

function setHoverForElements(value) {
  elementIds = [];
  values = [];
  elements.forEach((element) => {
    elementIds.push(element.id);
    values.push(value);
  });

  sendPostOperation(5, elementIds, values);
}

function setActiveForGates(value) {
  gateIds = [];
  values = [];
  elements.forEach((gate) => {
    gateIds.push(gate.id);
    values.push(value);
  });

  sendPostOperation(4, gateIds, values);
}
function getActiveGates() {
  activeGates = [];
  elements.forEach((gate) => {
    if (gate.isActive == true) {
      activeGates.push(gate);
    }
  });

  return activeGates;
}
function createMovePreview() {
  activeGates = getActiveGates();
  movePrev = [];
  activeGates.forEach((gate) => {
    let gm = new GateMove(gate.x, gate.y, gate.width, gate.height);
    movePrev.push(gm);
  });

  return movePrev;
}

function setActiveWithSelectionRectangle() {
  selectRectangleGates = [];

  // Normalize the selection rectangle coordinates
  const startX = Math.min(selectRectangleStartX, mouseX);
  const endX = Math.max(selectRectangleStartX, mouseX);
  const startY = Math.min(selectRectangleStartY, mouseY);
  const endY = Math.max(selectRectangleStartY, mouseY);

  elements.forEach((gate) => {
    if (
      gate.x >= startX &&
      gate.x + gate.width <= endX &&
      gate.y >= startY &&
      gate.y + gate.height <= endY
    ) {
      gate.isActive = true; // Update isActive value
      selectRectangleGates.push(gate.id);
    }
  });

  if (selectRectangleGates.length > 0)
    sendPostOperation(
      4,
      selectRectangleGates,
      Array(selectRectangleGates.length).fill(1)
    );

  selectRectangleGates.forEach((gateId) => {
    const gate = elements.find((g) => g.id === gateId);
    console.log(gate.id + ": " + gate.isActive);
  });
}

function selectElementByMouse() {
  for (let index = elements.length - 1; index >= 0; index--) {
    if (elements[index].isInside(mouseX, mouseY) == true) {
      elements[index].isActive = true;
      return elements[index];
    }
  }
  return null;
}

function isInsideAnyElements() {
  elements.forEach(element => {
    if(element.isInside()==true) {
      return true;
  }});
  return false;
}


function isInsideAnyIO() {
  //Mit elements ausstauschen
  elements.forEach(gate=>{
    if(gate.getHoveredIO()==true) return true;
  });
  return false;
}



//Global Variable if Context Menu is Open
contextMenuOpen = false;
document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
  contextMenuOpen = false;
  document.getElementById("contextMenu").style.display = "none";
}

function showContextMenu(event) {
  const rect = layer1.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  contextMenu.style.display = "block";
  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;
}

function rightClick(e) {
  console.log("Request:" + getElementsRequest());
  
  e.preventDefault();
  contextMenuOpen = true;
  if (document.getElementById("contextMenu").style.display == "block") {
    hideMenu();
  } else {
    var menu = document.getElementById("contextMenu");
    menu.style.display = "block";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
  }
}

function updateCurrentSelected() {
  const currentSelectedElement = document.getElementById("currentSelected");
  const activeGates = getActiveGates();
  const activeGateIds = activeGates.map((gate) => gate.id).join(", ");
  currentSelectedElement.innerText = `Current Selected Gates: ${activeGateIds}`;


}

setInterval(updateCurrentSelected, 1000);

setInterval(() => {
  if (isLineDrawing==true) {
    if(!isInsideAnyElements()&&(!isInsideAnyIO())) state = "0";
    
    lineDrawing_checkForInGoingLine();
  }
}, 100);

//let io1 = new InputOutputElements(InputOutputElements.Type.INPUT, 500, 50);
//io1.draw();
