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

//Text Instructions
layer6 = document.getElementById("layer6");
ctx6 = layer6.getContext("2d");

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

layer6.height = height;
layer6.width = width;



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

let ioelement = [];
let lines = [];
let switches = [];
let annotations = [];
let elements = [];




class Element {
  isActive = false;
  isHovered = false;

  id;
  x = 15;
  y = 15;
  width = 50;
  height = 50;

  isInside(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }

  constructor() {
    elements.push(this);
  }

}

class Annotation extends Element{
  id;
  text;
  x;
  y;
  width;
  height;
  isActive = false;
  isHovered = false;
  constructor(text, x, y) {
    super();
    this.text = text;
    this.x = x;
    this.y = y;
    annotations.push(this);
  }
  draw() {
  if(this.isHovered==true){
    ctx6.fillStyle = "yellow";
  }else if(this.isActive==true) {
      ctx6.fillStyle = "red";
      
    } else {
      ctx6.fillStyle = "black";
    }
    
    
    ctx6.font = `${this.fontSize}px Arial`;
    ctx6.fillText(this.text, this.x, this.y);
    
  
    this.width = ctx6.measureText(this.text).width;
    this.height = parseInt(ctx6.font, 10); // Extract the font size from the font property
    ctx6.strokeRect(this.x, this.y,this.width, -this.height);
  }
  isInside(mouseX,mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y - this.height &&
      mouseY <= this.y
    );
  }
  changeText(text) {
    if(text!=null) {
      this.text = text; 
    }
  }
}
class InputOutputElement extends Element{
  activeIO = null;


  input = [
    [0, 0],
    [0, 0],
  ]; // Initialize input array with default values
  output = [0, 0];
  inputState;

  conLength = 15;

  //Positional


  activeIO;

  ioID = [];

  static addElement(element) {
    InputOutputElement.ioelement.push(element);
  }

  static getElements() {
    return InputOutputElement.ioelement;
  }

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;

    ioelement.push(this);

    if (x != null && y != null) {
      this.x = x;
      this.y = y;
    }
  }

  isInside(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }
  drawLineHighlight(ctx4) {}
  getHoveredIO() {}

  getInput(index) {}
  getOutput() {}

  updateIOPos() {
    this.input[0][0] = this.x - this.conLength;
    this.input[0][1] = this.y;

    this.input[1][0] = this.x - this.conLength;
    this.input[1][1] = this.y + this.height;

    this.output[0] = this.x + this.width + this.conLength;
    this.output[1] = this.y + Math.round(this.height / 2);
  }

  getHoveredIO_ID() {
    if (this instanceof Gatter) {
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
        this.activeIO[0] = 1;
        return this.activeIO;
      } else if (
        Math.abs(mouseX - inputX2) <= this.threshold &&
        Math.abs(mouseY - inputY2) <= this.threshold
      ) {
        this.activeIO[0] = 2;
        return this.activeIO;
      }
      if (
        Math.abs(mouseX - outputX) <= this.threshold &&
        Math.abs(mouseY - outputY) <= this.threshold
      ) {
        this.activeIO[1] = 1;
        return this.activeIO;
      }

      return null;
    } else if (this instanceof Switch) {
    }
  }
  drawLineHighlight(ctx4) {}
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
  id;

  state;

  constructor(id, inputPos, outputPos) {
    this.id = id;
    this.inputPos = inputPos;
    this.outputPos = outputPos;
    //console.log("Created new Line with id:"+this.id+" input"+inputPos+" output:"+outputPos);
    //this.outputIndex = outputIndex;
  }

  draw(ctx4) {
    ctx4.beginPath();
    ctx4.moveTo(this.inputPos[0], this.inputPos[1]);
    ctx4.lineTo(this.outputPos[0], this.outputPos[1]);

    //console.log("drew from"+this.inputPos[0]+"/"+this.inputPos[1]+" to "+this.outputPos[0]+"/"+this.outputPos[1]);
    ctx4.lineWidth = 3; // Set the brush size

    //console.log(this.state);
    switch (this.state) {
      case "0":
        ctx4.strokeStyle = "grey";
        break;
      case "1":
        ctx4.strokeStyle = "red";
        break;
      case "2":
        ctx4.strokeStyle = "blue";
        break;
      default:
        ctx4.strokeStyle = "black";
        break;
    }
    ctx4.stroke();
  }
}

class Switch extends InputOutputElement {
  static Type = Object.freeze({
    INPUT: "Input",
    OUTPUT: "Output",
  });
  type;
  //conLength = 15;
  activeIO = [];

  constructor(type, x, y) {
    super(x, y);
    this.type = type;
  }

  getInput() {
    pos = [];
    pos[0] = this.x - this.conLength;
    pos[1] = this.y + this.height / 2;

    return pos;
  }

  getOutput() {
    pos = [];
    pos[0] = this.x + this.width + this.conLength;
    pos[1] = this.y + this.height / 2;

    return pos;
  }
  draw(ctx1) {
    //Draw Base Rectangle
    ctx1.strokeStyle = "grey";
    ctx1.fillStyle = "grey";
    ctx1.fillRect(this.x, this.y, this.width, this.height);

    if (this.isHovered == true) {
      ctx1.strokeStyle = "white";
    } else if (this.isActive == true) {
      ctx1.strokeStyle = "yellow";
    } else {
      ctx1.strokeStyle = "darkgrey";
    }

    //Draw Highlight
    ctx1.strokeRect(this.x, this.y, this.width, this.height);

    ctx1.strokeStyle = "grey";

    if (this.type == "INPUT") {
      if (this.outputHovered == true) {
        ctx1.strokeStyle = "yellow";
      }
      ctx1.beginPath();
      ctx1.moveTo(this.x + this.width, this.y + this.height / 2);
      ctx1.lineTo(
        this.x + this.width + this.conLength,
        this.y + this.height / 2
      );
      ctx1.stroke();
    } else if (this.type == "OUTPUT") {
      if (this.input1Hovered == true) {
        ctx1.strokeStyle = "yellow";
      }
      ctx1.beginPath();
      ctx1.moveTo(this.x, this.y + Math.round(this.height / 2));
      ctx1.lineTo(
        this.x - this.conLength,
        this.y + Math.round(this.height / 2)
      );
      ctx1.stroke();
    }

    ctx1.fillStyle = "black";
    const text = this.state;
    const textWidth = ctx1.measureText(text).width;

    // Adjust the x and y coordinates to center the text
    const textX = this.x + this.width / 2 - textWidth / 2;
    const textY = this.y + this.height / 2 + 5; // Adjust y to vertically center the text

    ctx1.fillText(text, textX, textY);
  }

  threshold = 15;
  getHoveredIO() {
    if (this.type == "OUTPUT") {
      const inputX1 = this.x - this.conLength;
      const inputY1 = this.y + Math.round(this.height / 2);

      if (
        Math.abs(mouseX - inputX1) <= this.threshold &&
        Math.abs(mouseY - inputY1) <= this.threshold
      ) {
        return true;
      }
    } else if (this.type == "INPUT") {
      const outputX = this.x + this.width + this.conLength;
      const outputY = this.y + Math.round(this.height / 2);
      if (
        Math.abs(mouseX - outputX) <= this.threshold &&
        Math.abs(mouseY - outputY) <= this.threshold
      ) {
        return true;
      }
    }
    return false;
  }
  drawLineHighlight(ctx4) {
    const activeIOID = this.getHoveredIO_ID();

    if (this.activeIO != null && activeIOID != null) {
      if (activeIOID[0] == 1) {
        this.input1Hovered = true;
        this.outputHovered = false;
      } else if (activeIOID[1] == 1) {
        this.input1Hovered = false;
        this.outputHovered = true;
      }
    }
  }
  getHoveredIO_ID() {
    if (this.type == "OUTPUT") {
      const inputX1 = this.x - this.conLength;
      const inputY1 = this.y + Math.round(this.height / 2);

      if (
        Math.abs(mouseX - inputX1) <= this.threshold &&
        Math.abs(mouseY - inputY1) <= this.threshold
      ) {
        this.activeIO[0] = 1;
        this.activeIO[1] = 0;
        return this.activeIO;
      }
    } else if (this.type == "INPUT") {
      const outputX = this.x + this.width + this.conLength;
      const outputY = this.y + Math.round(this.height / 2);
      if (
        Math.abs(mouseX - outputX) <= this.threshold &&
        Math.abs(mouseY - outputY) <= this.threshold
      ) {
        this.activeIO[0] = 0;
        this.activeIO[1] = 1;
        return this.activeIO;
      }
    }
    return null;
  }
}

class Gatter extends InputOutputElement {
  type;
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
  conLength = 15;
  constructor(x, y) {
    super(x, y);
    this.updateIOPos();
  }

  draw(ctx1) {
    if (this.type == "NOT") {
      this.updateIOPos();
      ctx1.strokeStyle = "grey";
      ctx1.fillStyle = "grey";

      //Draw Base Rectangle
      ctx1.fillRect(this.x, this.y, this.width, this.height);

      //input 1
      if (this.input1Hovered == true) ctx1.strokeStyle = "yellow";
      ctx1.beginPath();
      ctx1.moveTo(this.x, this.y + this.height / 2);
      ctx1.lineTo(this.x - this.conLength, this.y + this.height / 2);
      ctx1.stroke();

      ctx1.strokeStyle = "grey";

      //Output
      if (this.outputHovered == true) ctx1.strokeStyle = "yellow";
      ctx1.beginPath();
      ctx1.moveTo(this.x + this.width, this.y + this.height / 2);
      ctx1.lineTo(
        this.x + this.width + this.conLength,
        this.y + this.height / 2
      );
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
      return;
    }

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

    this.ioID = this.getHoveredIO_ID();

    this.input2Hovered = false;
    this.input1Hovered = false;
    this.outputHovered = false;

    if (this.ioID != null) {
      if (this.ioID[0] == 1) {
        this.input2Hovered = false;
        this.input1Hovered = true;
      } else if (this.ioID[0] == 2) {
        this.input1Hovered = false;
        this.input2Hovered = true;
      } else if (this.ioID[1] == 1) {
        this.outputHovered = true;
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
    }
    if (
      Math.abs(mouseX - outputX) <= this.threshold &&
      Math.abs(mouseY - outputY) <= this.threshold
    ) {
      return true;
    }

    return false;
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
      this.activeIO[1] = 0;
      this.activeIO[0] = 1;
      return this.activeIO;
    } else if (
      Math.abs(mouseX - inputX2) <= this.threshold &&
      Math.abs(mouseY - inputY2) <= this.threshold
    ) {
      this.activeIO[0] = 2;
      this.activeIO[1] = 0;
      return this.activeIO;
    }
    if (
      Math.abs(mouseX - outputX) <= this.threshold &&
      Math.abs(mouseY - outputY) <= this.threshold
    ) {
      this.activeIO[0] = 0;
      this.activeIO[1] = 1;
      return this.activeIO;
    }

    return null;
  }

  isInside(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }

  getInput(index) {
    return this.input[index];
  }
  getOutput() {
    return this.output;
  }

  updateIOPos() {
    if (this.type == "NOT") {
      this.input[0][0] = this.x - this.conLength;
      this.input[0][1] = this.y + this.height / 2;

      this.input[1][0] = null;
      this.input[1][1] = null;
    } else {
      this.input[0][0] = this.x - this.conLength;
      this.input[0][1] = this.y;

      this.input[1][0] = this.x - this.conLength;
      this.input[1][1] = this.y + this.height;
    }
    this.output[0] = this.x + this.width + this.conLength;
    this.output[1] = this.y + Math.round(this.height / 2);
  }
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

function drawElements() {
  ctx1.clearRect(0, 0, layer1.width, layer1.height);

  ioelement.forEach((element) => {
    element.draw(ctx1);

    element.drawLineHighlight(ctx3);
  });
}

function drawAnnotations() {
  if(annotations.length>0) {
    annotations.forEach((annotation)=> {
      annotation.draw();
    }); 
  }
}
function drawMovePrev(ctx3) {
  //ctx3.clearRect(0,0,width,height);
  movePrev = createMovePreview();
  movePrev.forEach((gm) => {
    gm.draw(ctx3);
  });
}

function drawLines() {
  ctx4.clearRect(0, 0, layer1.width, layer1.height);

  lines.forEach((line) => {
    line.draw(ctx4);
  });
}
let outgoingLine = null;
let state = null;
function lineDrawingPreview() {
  //console.log(color);
  //if (outgoingLine != null && (outgoingLine instanceof Gatter || outgoingLine instanceof InputOutputElements)) {
  //console.log("current state:"+state);
  switch (state) {
    case "0":
      ctx5.strokeStyle = "grey";
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
    //console.log("yop");
  }
  //}
}

async function lineDrawing_checkForInGoingLine() {
  for (const gate of ioelement) {
    let id = gate.getHoveredIO_ID();
    if (id != null) {
      if (outgoingLine.activeIO[0] == 1 || outgoingLine.activeIO[0] == 2) {
        input = outgoingLine;
        output = gate;
        id = outgoingLine.activeIO;
      } else if (outgoingLine.activeIO[1] === 1) {
        input = gate;
        output = outgoingLine;
      }
      try {
        console.log("Output:" + output.activeIO[0] + ":" + output.activeIO[1]);
        state = await sendCheckLegalConnection(
          output.id,
          output.activeIO,
          input.id,
          input.activeIO
        );
        console.log("te" + state);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
}

function update() {
  
  //fetchChanges();
  requestAnimationFrame(update);
  drawElements();
  drawAnnotations();

  drawLines();
  if (isDragging) drawMovePrev(ctx3);

  if (isSelecting == true) {
    drawSelectionRectangle();
  }
  if (isLineDrawing == true) {
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
      console.log(element.id + "Found");
      elementIds.push(element.id);
      //alert("YOP");
      //console.log("Selected ioelement:"+elementIds.length)
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
      await getLinesRequest();
    }
    //console.log("refreshed");

    // Sleep for 0.5 seconds before sending the next request
    await sleep(50);
  }
}

//HTTP
async function exportElements() {
  try {
    const response = await fetch("http://localhost:50001/exportElements", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseText = await response.text();
    //console.log("Response from server:", responseText);
    alert("Elements Exported")
    return responseText;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
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
  try {
    const response = await fetch(
      "http://localhost:50001/checkLegalConnection",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
        },
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const responseText = await response.text();

    return responseText;
    console.log("Response from server:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getLinesRequest() {
  await fetch("http://localhost:50001/getLines", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((responseText) => {
      //console.log("Response from server:", responseText);
      parseLineString(responseText);
      //console.log("yippie");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
      console.log("Response from server:", responseText);
      parseElementString(responseText);
      //console.log("yippie");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
/* async function GetGatesRequest() {
  fetch("http://localhost:50001/getGates", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((responseText) => {
      //console.log("Response from server:", responseText);
      ioelement = parseGatterString(responseText);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} */
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

async function sendResolution(width, height) {
  const data = width + ";" + height + ";";

  try {
    const response = await fetch("http://localhost:50001/getResolution", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const responseText = await response.text();
    console.log("response:"+responseText);
    return responseText;
    console.log("Response from server:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendConnectionOperation(output, outputCon, input, inputCon) {
  const data = outputID + ";" + inputID + ";" + inputConnectionID;

  try {
    const response = await fetch("http://localhost:50001/createConnection", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const responseText = await response.text();

    return responseText;
    console.log("Response from server:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error:", error);
  }
}

//IN PROGRESS
function sendPostOperationAttributes() {
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

  if (operation == 2 || operation == 4 || operation==8) console.log("prwprow"+response); //alert("OUTGOING: "+response);
  sendPostRequest(response);
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

  if (operation == 2 || operation == 4 || operation==8) console.log("prwprow"+response); //alert("OUTGOING: "+response);
  sendPostRequest(response);
}
function sendCheckLegalConnection(
  outputID,
  outputConnectionID,
  inputID,
  inputConnectionID
) {
  data =
    outputID +
    ";" +
    outputConnectionID[0] +
    ":" +
    outputConnectionID[1] +
    ";" +
    inputID +
    ";" +
    inputConnectionID[0] +
    ":" +
    inputConnectionID[1];
  //console.log(data);
  return checkLegalConnection(data);
}
//sendPostRequest(data);

function parseElementString(elementString) {
  ioelement = [];
  //console.log("Response:" + elementString);
  //Clear the Element Arrays
  //gate.ioelement = [];
  elements = [];
  annotations = [];

  elementStringArray = elementString.split("`");
  //console.log("Gatter String:" + elementStringArray[0]);
  parseGatterString(elementStringArray[0]);
  parseSwitchString(elementStringArray[1]);
  parseAnnotationString(elementStringArray[2]);
  //parseGatterString(elementStringArray[0]);
  //console.log(elementStringArray.length);
  elementStringArray.forEach((el) => {
    //console.log(el);
  });
}
function parseAnnotationString(annotationString) {
  annotations = [];
  const annotationStrings = annotationString.split("|");

  annotationStrings.forEach((annotationString) => {
    const attributes = annotationString.split(";");
    const annotationData = {};

    attributes.forEach((attribute) => {
      const [key, value] = attribute.split(":");
      annotationData[key] = value;
    });

    if(annotationData.id=="") return;

    const annotation = new Annotation(
      annotationData.text,
      parseInt(annotationData.x),
      parseInt(annotationData.y)
    );
    annotation.width = parseInt(annotationData.width);
    annotation.height = parseInt(annotationData.height);
    annotation.id = parseInt(annotationData.id);
    annotation.fontSize = parseInt(annotationData.fontSize);
    annotation.isActive = annotationData.isActive === "true";
    annotation.isHovered = annotationData.isHovered === "true";


    
  });

  
}
function parseSwitchString(switchString) {
  //console.log("Switch" + switchString);
  switches = [];
  const switchStrings = switchString.split("|");

  switchStrings.forEach((switchString) => {
    const attributes = switchString.split(";");
    const switchData = {};

    attributes.forEach((attribute) => {
      const [key, value] = attribute.split(":");
      switchData[key] = value;
    });

    // Create a new Switch object using the parsed data
    const newSwitch = new Switch(
      switchData.type,
      parseInt(switchData.x, 10),
      parseInt(switchData.y, 10),
      //console.log("New Switch craeted")
    );

    newSwitch.id = switchData.id;
    //console.log("id g" + newSwitch.id);
    newSwitch.state = switchData.state === "true";
    newSwitch.isActive = switchData.isActive === "true";
    newSwitch.isHovered = switchData.isHovered === "true";
    newSwitch.conLength = parseInt(switchData.conLength);

    // Add the new switch to the switches array
    switches.push(newSwitch);
    //console.log("Switch attributes:", switchData);
  });
  return switches;
}
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

    if (gatterData.id == null) return;
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
    newGatter.conLength = parseInt(gatterData.conLength);
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

    //ioelement.push(newGatter);
  });

  return ioelement;
}
window.onload = function () {
  drawTextInstructions();
  ioelement = [];
  sendResolution(width, height);
};
function drawTextInstructions() {
  ctx6.clearRect(0, 0, width, height);
  ctx6.fillStyle = "white";
  ctx6.font = "14px Arial";
  const text = "Right-Click on Input-Switches to change State";
  ctx6.fillText(text, 10, 30);

  const text2 = "A - Select All Elements";
  ctx6.fillText(text2, 10, 50);
  const text3 = "Del - Delete Active Elements";
  ctx6.fillText(text3, 10, 70);

  const text4 = "CTRL+C - Copy Active Elements";
  ctx6.fillText(text4, 10, 90);

  const text5 = "CTRL+V - Paste Copied Elements";
  ctx6.fillText(text5, 10, 110);
}
function parseLineString(lineString) {
  //console.log(lineString);
  lines = [];
  lineStrings = lineString.split("|");

  lineStrings.forEach((lineString) => {
    const attributes = lineString.split(";");
    const lineData = {};

    attributes.forEach((attribute) => {
      const [key, value] = attribute.split(":");
      lineData[key] = value;
    });
    //console.log(lineData.inputPos);
    inputPos = lineData.inputPos ? lineData.inputPos.split("-") : [0, 0];
    outputPos = lineData.outputPos ? lineData.outputPos.split("-") : [0, 0];

    // Create a new Gatter object using the parsed data
    const newLine = new Line(lineData.id, inputPos, outputPos);
    newLine.state = lineData.state;

    lines.push(newLine);
  });
  //console.log(lines.length + " count Lines");
  return lines;
}

rect = layer1.getBoundingClientRect();
let mouseX;
let mouseY;

let selectRectangleStartX, selectRectangleStartY;

let gateMoves = [];
let mouseDownX, mouseDownY;

outgoingLinePOS = [];
tempActiveElements = [];

//Copy Paste Offset
ctrlMouse = [];
//Event-Actions
document.addEventListener("keydown", (event) => {
  
  switch (event.key) {
    case "a":
    case "A":
      setActiveForGates(1);
      break;
    case "Delete":
      const activeGates = getActiveGates();
      const gateIds = activeGates.map((gate) => gate.id);
      sendPostOperation(7, gateIds, null);
      break;
    default:
      break;
  }

  if(event.ctrlKey&&event.key==='c') {
    tempActiveElements = getActiveElementIDs();
    ctrlMouse[0] = mouseX;
    ctrlMouse[1] = mouseY;
  }
  if(event.ctrlKey&&event.key==='v') {
    if(tempActiveElements.length>0) {
      //console.log(tempActiveElements);
      tempActiveElements.forEach(element => {
        //console.log(`Element ID: ${element.id}, Type: ${element.type}, Position: (${element.x}, ${element.y})`);
      });
      mouseValues = [ctrlMouse[0], ctrlMouse[1], mouseX, mouseY];
      sendPostOperation(12,tempActiveElements,mouseValues);
      setActiveForSpecifiedGates(tempActiveElements,0);
    }
  }
});
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

  //console.log("AnyIO:" + isInsideAnyIO() + " anyElements:" + isInsideAnyElements());
  if (
    isInsideAnyIO() == true &&
    isInsideAnyElements() == false &&
    isSelecting == false &&
    isDragging == false &&
    isLineDrawing == false
  ) {
    isLineDrawing = true;

    ioelement.forEach((gate) => {
      if (gate.getHoveredIO_ID() != null) {
        lineDrawing_SetOutgoingLine(gate);
        //console.log(outgoingLine);
        let AIOid = outgoingLine.getHoveredIO_ID();
        //console.log("id:" + id);
        if (AIOid != null) {
          if (AIOid[0] > 0) {
            if (outgoingLine instanceof Gatter)
              outgoingLinePOS = outgoingLine.getInput(AIOid[0] - 1);
            if (outgoingLine instanceof Switch)
              outgoingLinePOS = outgoingLine.getInput();
            //console.log(outgoingLinePOS[0] + ":" + outgoingLinePOS[1] + "oile");
          } else if (AIOid[1] > 0) {
            if (outgoingLine instanceof Gatter)
              outgoingLinePOS = outgoingLine.getOutput();
            if (outgoingLine instanceof Switch)
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
    gate = selectGatesByMouse();

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
    pos[0] = mouseX - mouseDownX;
    pos[1] = mouseY - mouseDownY;
    //alert(`Sent: gid = ${gid}, pos = ${pos}`);
    if (gid.length > 0) sendPostOperation(2, gid, pos);
  }

  isSelecting = false;

  isDragging = false;

  //console.log(outgoingLine + " " + getAnyHoveredIO_ID);
  if (outgoingLine != null && getAnyHoveredIO_ID() != null) {
    receivingLine = getAnyHoveredIO_ID();
    gateID = [outgoingLine.id, receivingLine.id];
    values = [
      outgoingLine.activeIO[0],
      outgoingLine.activeIO[1],
      receivingLine.activeIO[0],
      receivingLine.activeIO[1],
    ];

    sendPostOperation(8, gateID, values);
  }

  outgoingLine = null;

  //clear ActiveIO
  ioelement.forEach((element) => {
    element.activeIO = [0, 0];
  });
  //GetGatesRequest();
});

function getActiveElementIDs() {
  let activeElementIDs = [];
  elements.forEach((element) => {
    if (element.isActive) {
      console.log(`Element ID: ${element.id}`);
      activeElementIDs.push(element.id);
    }
  });
  return activeElementIDs;
}

function getAnyHoveredIO_ID() {
  for (const element of ioelement) {
    const hoveredIO_ID = element.getHoveredIO_ID();
    if (hoveredIO_ID !== null) {
      return element;
    }
  }
  return null;
}

layer1.addEventListener("click", (event) => {
  //fetchChanges();
  //GetGatesRequest();

  //Select/Deselect Gates
  if (!event.ctrlKey && isInsideAnyElements() == true) {
  }

  //console.log(isInsideAnyElements());
  if (isInsideAnyElements() == true && !event.ctrlKey) {
    selectGatesByMouse();
  }
});

update();
fetchChanges();

function setActiveMouse() {
  ioelement.forEach((gate) => {
    if (gate.isInside(mouseX, mouseY) == true) {
      gate.isActive = !gate.isActive; // Toggle active state
      sendPostOperation(4, gate.id, gate.isActive ? 1 : 0);
    }
  });
}
function printAllGates() {
  counter = 0;
  ioelement.forEach((gate) => {
    //console.log(counter++ + ": " + gate.id);
  });
}

function createSwitch(typeID) {
  pos = [];

  if (mouseX == null || mouseY == null) {
    pos[0] = Math.round(width / 2); // Rounds down
    pos[1] = Math.round(height / 2); // Rounds down
  } else {
    pos[0] = mouseX;
    pos[1] = mouseY;
  }

  sendPostOperation(10, typeID, pos);
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

  ioelement.forEach((element) => {
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

function setActiveForSpecifiedGates(gateIds,value) {
  
  values = [];
  gateIds.forEach((gate) => {
    values.push(value);
  });

  sendPostOperation(4, gateIds, values);
}
function getActiveGates() {
  activeGates = [];
  ioelement.forEach((gate) => {
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

  ioelement.forEach((gate) => {
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
    const gate = ioelement.find((g) => g.id === gateId);
    console.log(gate.id + ": " + gate.isActive);
  });
}

function selectGatesByMouse() {
  for (let index = ioelement.length - 1; index >= 0; index--) {
    if (ioelement[index].isInside(mouseX, mouseY) == true) {
      ioelement[index].isActive = true;
      return ioelement[index];
    }
  }
  return null;
}

function isInsideAnyElements() {
  for (let gate of ioelement) {
    if (gate.isInside(mouseX, mouseY) == true) {
      return true;
    }
  }
  return false;
}
function isInsideAnyIO() {
  for (let gate of ioelement) {
    if (gate.getHoveredIO() === true) {
      return true;
    }
  }
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
  //exportElements();
  temp = selectGatesByMouse();

  //alert(elements.length);

  input = ";50";
  sendResolution(input);

  if (temp instanceof Switch) {
    if (temp.type == "INPUT") {
      e.preventDefault();
      gateIDs = [];
      gateIDs[0] = temp.id;
      sendPostOperation(11, gateIDs, null);
    }
  } else {
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

  
}

function updateCurrentSelected() {
  const currentSelectedElement = document.getElementById("currentSelected");
  const activeGates = getActiveGates();
  const activeGateIds = activeGates.map((gate) => gate.id).join(", ");
  currentSelectedElement.innerText = `Current Selected Gates: ${activeGateIds}`;
}

setInterval(updateCurrentSelected, 1000);

setInterval(() => {
  if (isLineDrawing == true) {
    if (!isInsideAnyElements() && !isInsideAnyIO()) state = "0";

    lineDrawing_checkForInGoingLine();
  }
}, 100);

//let io1 = new InputOutputElements(InputOutputElements.Type.INPUT, 500, 50);
//io1.draw();

document.querySelector('.burger-content a[href="#"]').addEventListener('click', exportElements);