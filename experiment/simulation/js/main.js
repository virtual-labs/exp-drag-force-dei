var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const slider_mass = document.getElementById('currentmass');
const slider_cof = document.getElementById('currentDragValue');
const slider_area = document.getElementById('currentAreaValue');
const slider_size = document.getElementById('currentSizeValue');


const radioInput = document.getElementById('Glycerine');
var isCanvasUpdating = false;
document.getElementById("playButton").addEventListener("click", play);
document.getElementById("resetButton").addEventListener("click", reset);

function showmass(newmass) {
  //get the element
  var display = document.getElementById("initialmassValue");
  //show the amount
  display.innerHTML = newmass;
  // console.log(newmass)
  var mass1 = document.getElementById("mass1");
  mass1.innerHTML = newmass;
  var mass2 = document.getElementById("mass2");
  mass2.innerHTML = newmass;
  mass = (Number(newmass))/1000;
  reset();
}
function showDrag(newDrag) {
  //get the element
  var display = document.getElementById("initialDragValue");
  //show the amount
  display.innerHTML = newDrag;
  document.getElementById("dragCoeff").innerHTML = newDrag;

  dragCoefficient = Number(newDrag);
  reset();
}
function showArea(newArea){
  var display = document.getElementById("initialAreaValue");
  display.innerHTML = newArea;
  document.getElementById("area1").innerHTML = newArea;
  document.getElementById("area2").innerHTML = newArea
  area = Number(newArea)/1000000;
  reset();
}
function showSize(newSize){
  var display = document.getElementById("initialSizeValue");
  display.innerHTML = newSize;
  document.getElementById("ballSize1").innerHTML = newSize;
  document.getElementById("ballSize2").innerHTML = newSize;

  size = Number(newSize)/1000;
  reset();
}

const checkbox = document.querySelector('#lockCheckbox');
function lock(){
  if (radioInput.checked && radioInput.value === 'GLYCERINE') {
    rho = 1260;   // kg/m^3 
    document.getElementById("lockPopUp").textContent = "Parameters are locked" ;


  } else {
    rho = 997.77;   // kg/m^3 
    document.getElementById("lockPopUp").textContent = "Parameters are locked" ;

  }
  // document.getElementById("fluidDensity").textContent= rho;

  // document.getElementById("density").textContent = rho ;
  document.getElementById("gravity1").textContent = g + " m/"+"s\u00B2";
  document.getElementById("gravity2").textContent = g + " m/"+"s\u00B2";
  document.getElementById("gravity3").textContent = g + " m/"+"s\u00B2";


  checkbox.addEventListener('change', function() {
    if (this.checked) {
      slider_mass.disabled = true;
      slider_cof.disabled = true;
      slider_area.disabled = true;
      slider_size.disabled = true;
      Glycerine.disabled = true;
      Water.disabled = true;
      checkbox.disabled = true;
      
      // drawMotion();
      
    } else {
      slider_mass.disabled = false;
      slider_cof.disabled =false ;
      slider_area.disabled = false;
      slider_size.disabled = false;
      Glycerine.disabled = false;
      Water.disabled = false;
      checkbox.disabled = false;
      
      reset();
    }   

  });

}
function uncheckCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = false;
  document.getElementById("lockPopUp").textContent = "" ;

}


var mass = 0.005;
var dragCoefficient = 0.5;
var area = 50/100000;
var size = 0.005;
var rho;

var running = 0;
var time = 0;

// Ball properties
var ballRadius = 5;
var x1 = 150;
var y1 = 75;
var x2 = 360;
var y2 = 75;
var dy1 = 0.75*2; // Vertical speed
var dy2 = 0;

var isBallFalling = false;
var flag = false;
vel2
const lgTimes1 = [];
const lgTimes2 = [];
const vel1Array = [];
const vel2Array = [];
const dragArray = [];
const sizeArray1= [];
const sizeArray2= [];

var d = 105;
var min = 9.70;
var max = 9.80;
var g =((Math.random() * (max - min +0.01) )+ min).toFixed(2) ;
var vel1 = 0;
var vel2 = 0;
let last_y2 = null;
let last_y1 = null;
function lightGatesTimes() {
  if (isBallFalling) {
    if (y1 < canvas.height - 75) {
    var y_1 = Math.ceil(y1);       // light gate position at y1

      for (let i = 1; i < 11; i++) {

        var lgp  = Math.ceil(d + 36 * i)   // light gate position at y1
        // if (Math.round(y1) ===lgp ) {
          if (y1 > 140 && (y_1 === lgp) && (y_1 !== last_y1 )) {
            vel1Array.push(vel1);
            var lgCrossTime1  = (size)/vel1;   
            sizeArray1.push(lgCrossTime1.toFixed(3));                   //If an object of size s cuts the light gate beam for time 
            lgTimes1.push(totalSeconds.toFixed(3));
            last_y1 = y_1;

        }
      }
    }
  }
  if (y2 < canvas.height - 70) {
    var y_2 = Math.ceil(y2);       // light gate position at y2

    for (let i = 0; i < 11; i++) {

      var lgp = Math.ceil(d + 35.05 * i);       // light gate position
      if (y2 > 140 && y_2 === lgp && (y_2 !== last_y2 )) {

        lgTimes2.push(totalSeconds.toFixed(3));
        
        vel2Array.push(vel2);
        var lgCrossTime2  = (size)/vel2;   
        sizeArray2.push(lgCrossTime2.toFixed(3) );                   //If an object of size s cuts the light gate beam for time 
        dragArray.push(dragF);
        last_y2 = y_2;
      }
    }
  }
  renderTimeValues();
}

function renderTimeValues() {
  ctx.font = "12px Arial";
  ctx.fillStyle = "blue";
  for (let i = 0; i < lgTimes1.length; i++) {
    const textX = 50;
    const textY = d + (i + 1) * 36;
    ctx.fillText(lgTimes1[i], textX, textY);
    document.getElementById(`lg1Time${i}`).textContent = lgTimes1[i];
    document.getElementById(`lg1vel${i}`).textContent = vel1Array[i].toFixed(2);
    document.getElementById(`lg1CrossTime${i}`).textContent = sizeArray1[i];

  }
  for (let i = 0; i < lgTimes2.length; i++) {
    const textX = 450;
    const textY = d + (i + 1) * 36;

    ctx.fillText(lgTimes2[i], textX, textY);
    document.getElementById(`lg2Time${i}`).textContent = lgTimes2[i]
    document.getElementById(`lg2vel${i}`).textContent = vel2Array[i].toFixed(3);
    document.getElementById(`dragForce${i}`).textContent = dragArray[i].toFixed(3);
    document.getElementById(`lg2CrossTime${i}`).textContent = sizeArray2[i];

  }

}


function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawCanvasBalls() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw balls
  ctx.fillStyle = "blue";

  drawBall(x1, y1);
  ctx.fillStyle = "red";
  drawBall(x2, y2);
}

function moveBall() {
  if (isBallFalling) {
    if (y1 < canvas.height - 70) {
      y1 += dy1;
    }

    if (y2 < canvas.height - 70) {
      y2 += dy2;
    }

    if (y1 >= canvas.height - 70 && y2 >= canvas.height - 70) {
      // Stop falling when both balls reach the desired position
      isBallFalling = false;
      running = 0;
    }
  lightGatesTimes();
  }
}

// Global variable to store the formatted time string
var currentTimeString = "";
var totalSeconds = 0;
var startTime;

function displayTime(minutes, seconds, milliseconds) {
  var minStr = String(minutes).padStart(2, "0");
  var secStr = String(seconds).padStart(2, "0");
  var countStr = String(milliseconds).padStart(2, "0");

  // Update the global variable with the formatted time string
  currentTimeString = minStr + ":" + secStr + ":" + countStr;
  // Convert time to seconds
  totalSeconds = minutes * 60 + seconds + milliseconds / 1000;

  // Update the HTML elements
  document.getElementById("min").innerHTML = minStr;
  document.getElementById("sec").innerHTML = secStr;
  document.getElementById("count").innerHTML = countStr.slice(0, 2);

  // Return the time in seconds
  return totalSeconds;
}

var container = document.getElementById("container");
var table1Anchor = document.createElement("a");
var table2Anchor = document.createElement("a");

function increment() {
  
  if (runFlag===1) {
    if(running===1){
      setTimeout(function () {
        var currentTime = performance.now();
        var elapsedMilliseconds = (currentTime - startTime) * 0.1*2;
        time = Math.floor(elapsedMilliseconds).toFixed(2);
        var minutes = Math.floor(time / 60000);
        var seconds = Math.floor((time % 60000) / 1000);
        var milliseconds = time % 1000;

        displayTime(minutes, seconds, milliseconds);
        if (y1 < canvas.height - 70) {
          vel1 = g * totalSeconds;
        }

        if (y2 < canvas.height - 70) {
          var terminalVelocity = calculateTerminalVelocity();
          vel2 = velocityOfBall2(terminalVelocity, g, totalSeconds);
          // document.getElementById("velocityOfBall2").textContent =vel2.toFixed(3)+ " m/s";
          dragF = calculateDragForce(vel2);
          // document.getElementById("dragForce").textContent =dragF.toFixed(3)+ " N";
          document.getElementById("dragForce_final").textContent =dragF.toFixed(3)+ " N";
        }

        increment();
      }, 1);
    }
    if (running === 0) {
      alert("terminal velocity is achieved");
      // Create Observation Table 1 anchor element
      table1Anchor.classList.add("button-table1");
      table1Anchor.href = "#popup1";
      table1Anchor.textContent = "Obervation Table 1";

      // Create Observation Table 2 anchor element
      table2Anchor.classList.add("button-table2");
      table2Anchor.href = "#popup2";
      table2Anchor.textContent = "Obervation Table 2";

      // Append the anchor elements to a parent container (e.g., a div with ID "container")
      container.appendChild(table1Anchor);
      container.appendChild(table2Anchor);

      const result = document.getElementById("result");
      result.textContent = "Result:-";
      result.style.fontWeight = 'bold';
      
      document.getElementById("gravity").textContent = "• Acceleration due to \ngravity :"+ g + " m/"+"s\u00B2 ";
      document.getElementById("dragForce").textContent ="• Maximum drag force\nin fluid : "+dragF.toFixed(3)+ " N";
      document.getElementById("terminaVelocity").textContent ="• Terminal velocity of ball 2\nin fluid: "+ terminalVel.toFixed(3)+ " m/s";

      document.getElementById("velocityOfBall1").textContent = "• Final velocity of ball 1\nin vaccum: " +vel1.toFixed(3) + " m/s";

    }
  }
  else{
    reset();
  }
  
}

function calculateTerminalVelocity(){
  if (radioInput.checked && radioInput.value === 'GLYCERINE') {
    rho = 1260;   // kg/m^3 
  } else {
    rho = 997.77;   // kg/m^3 
  }
  terminalVel = Math.sqrt((2 * mass * g) / (rho * (area)* dragCoefficient));
  // document.getElementById("terminaVelocity").textContent = terminalVel.toFixed(3)+ " m/s";
  document.getElementById("terminaVelocity1").textContent = terminalVel.toFixed(3)+ " m/s";
          
  return terminalVel;
}

function calculateTime(vt,g,y){
  var ct  = (vt / g) *( Math.acosh(Math.exp((g * y) / Math.pow(vt, 2))));
  // document.getElementById("calculated_time").textContent = ct.toFixed(3) + " s";
  return ct;
}
var dragForce = 0;
function calculateDragForce(vel2){
  if (radioInput.checked && radioInput.value === 'GLYCERINE') {
    rho = 1260;   // kg/m^3 
  } else {
    rho = 997.77;   // kg/m^3 
  }
  dragForce = 0.5* dragCoefficient*rho*(area)*vel2*vel2;
  return dragForce;
}

function velocityOfBall2(vt, g, t) {

  // vt: Terminal velocity
  // g: Acceleration due to gravity
  // t: Time = totalSeconds

  // Calculate gt/vt
  var gtOverVt = (g * t) / vt;

  // Calculate tanh(gt/vt)
  var tanhValue = Math.tanh(gtOverVt);

  // Calculate v = vt * tanh(gt/vt)
  var v = vt * tanhValue;

  return v;
}
var index = 0;
var timer;
var graphVel1 = 0;
var graphVel2 = 0;

function drawMotion() {
  
  if(running ==1 && isCanvasUpdating){
  
      drawCanvasBalls();
      moveBall();
      
      
      drawFlask();
      drawAxes(xBase,yBase1,xBase,yBase1,"" ,"",graphX,graphY,xAxisOffset,xIncrement,yIncrement,"",xNumDecimals,yNumDecimals,xAxisTitle,yAxisTitle1,yAxisTitle_1,graphTitle1);
      drawAxes(xBase,yBase2,"" ,"",xBase,yBase2,graphX,graphY,xAxisOffset,xIncrement,"",yIncrement1,xNumDecimals,yNumDecimals1,xAxisTitle,yAxisTitle2,yAxisTitle_2,graphTitle2);
      time = index/712
      // console.log(time)
      
      ctx.lineWidth = 2;
      var startX = xBase; // Set the starting X-coordinate for the graph
      var startY = yBase1; // Set the starting Y-coordinate for the graph
  
      // // velocity of ball1 and time graph 
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      graphVel1 =0;
      ctx.moveTo(startX, startY+30*graphY-(30/yIncrement)*graphVel1); 
        for (var i = 1; i <= index; i++) {
          var graphTime = i/300;
          var y =2;
          const time = Math.sqrt(2 * y / g);
          graphVel1 = g * graphTime;
          if (graphTime <= time){

          var x = startX + (30/xIncrement)*graphTime;
          var y = startY+30*graphY-(30/yIncrement)*graphVel1;
          ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

      // velocity of ball2 and time graph 
      ctx.strokeStyle = "red";
      graphVel2= 0;
      ctx.beginPath();

      ctx.moveTo(startX, startY+30*graphY-(30/yIncrement)*graphVel2);
        for (var i = 0; i <= index; i++) {
          var tv = calculateTerminalVelocity();
          var c = calculateTime(tv,g,2);
          var graphTime = i/300;
        
        // console.log(graphTime)
          if (graphTime > c) graphTime = c;
          var terminaly = calculateTerminalVelocity();
          graphVel2 = velocityOfBall2(terminaly, g, graphTime );
          var x = startX + (30/xIncrement)*graphTime;
          var y = startY+30*graphY-(30/yIncrement)*graphVel2;
          ctx.lineTo(x, y);
          
        }
        ctx.stroke();
      // drag Force and time graph 

      startY = yBase2;
      ctx.beginPath();
      ctx.moveTo(startX, startY+30*graphY);
      for (var i = 0; i <= index; i++) {
          var graphTime = i/300;
          if (graphTime > c) graphTime = c;
          var terminaly = calculateTerminalVelocity();
          graphVel2 = velocityOfBall2(terminaly, g, graphTime );
          dragF = calculateDragForce(graphVel2);
        var x = startX + (30/xIncrement)*graphTime;
        var y = startY+30*graphY-(30/yIncrement1)*dragF;
        ctx.lineTo(x, y);

      }
      ctx.stroke();
      
      index++;
      ctx.strokeStyle = "black";
  }
  
}


function runMotion() {
  drawMotion();
  
  if (running == 1) {
    timer = window.setTimeout(runMotion, 1000/90);
  }
 
}


var tv = 0;
var speedBall2;
function play() {
  
  let checkbox = document.getElementById("lockCheckbox");
  if (!checkbox.checked) {
    alert("Lock the input parameters");
  }
  else{
    if (checkbox.checked && !isBallFalling){
      alert("Note:- The simulation is running in slow motion (0.1x time) for better understanding");
      
    }
  if (!isBallFalling && !isCanvasUpdating) {
    
    window.clearTimeout(timer);
    running = 1;
    runFlag = 1;
    isBallFalling = true;
    isCanvasUpdating = true;
    runMotion();
    
      startTime = performance.now(); // Record the start time when play is clicked
      increment();

      var y = 2;    // distance 2 meter
      tv = calculateTerminalVelocity();
      var c = calculateTime(tv,g,y);
      console.log("calculated time = " +c);
      speedBall2 = (canvas.height-70-y2)/(c*305);  
      // console.log(speedBall2);
      dy2 = +speedBall2.toFixed(3)

    }
   console.log(area + "Area")
   console.log(size + "size")

}}

function reset() {
  window.clearTimeout(timer);
  isBallFalling = false; // Stop falling
  running = 0;
  runFlag = 0;
  y1 = 75; // Reset ball1 position to the top
  y2 = 75;
  dy1 = 0.75*2; // Vertical speed
  dy2 = 0; // Vertical speed
  d = 105;
  min = 9.70;
  max = 9.80;
  g =((Math.random() * (max - min +0.01) )+ min).toFixed(2) ;

   //  Clear the array
   lgTimes1.length = 0;
   lgTimes2.length = 0;
   vel1Array.length = 0;
   sizeArray1.length = 0;
   sizeArray2.length = 0;
   vel2Array.length = 0;
   dragArray.length = 0;


  for(var i=0; i<=7;i++){
    document.getElementById(`lg1Time${i}`).textContent = 0;
    document.getElementById(`lg1vel${i}`).textContent = 0;
    document.getElementById(`lg2Time${i}`).textContent = 0;
    document.getElementById(`lg2vel${i}`).textContent = 0;
    document.getElementById(`dragForce${i}`).textContent = 0;
    document.getElementById(`lg1CrossTime${i}`).textContent = 0;
    document.getElementById(`lg2CrossTime${i}`).textContent = 0;
   }
 
  index= -1;
  drawCanvasBalls();
  drawFlask();
  time = 0;
  displayTime(0, 0, 0);
  uncheckCheckbox('lockCheckbox');

  slider_mass.disabled = false;
      slider_cof.disabled =false ;
      slider_area.disabled = false;
      slider_size.disabled = false;
      Glycerine.disabled = false;
      Water.disabled = false;
  checkbox.disabled = false;
  // drawMotion();


   document.getElementById("velocityOfBall1").textContent = "";
  document.getElementById("terminaVelocity").textContent ="";
  document.getElementById("terminaVelocity1").textContent ="0.000"  + " m/s";

  // document.getElementById("velocityOfBall2").textContent = "0.000" + " m/s";
  // document.getElementById("calculated_time").textContent = "0.000" + " s";
  // document.getElementById("density").textContent = 0 ;
  
  document.getElementById("dragForce").textContent ="";
  document.getElementById("dragForce_final").textContent ="0.000"+ " N";

  
  document.getElementById("gravity").textContent =  "";
  document.getElementById("gravity1").textContent = 0 + " m/"+"s\u00B2";
  document.getElementById("gravity2").textContent = 0 + " m/"+"s\u00B2";
  document.getElementById("gravity3").textContent = 0 + " m/"+"s\u00B2";

       

  drawAxes(xBase,yBase1,xBase,yBase1,"" ,"",graphX,graphY,xAxisOffset,xIncrement,yIncrement,"",xNumDecimals,yNumDecimals,xAxisTitle,yAxisTitle1,yAxisTitle_1,graphTitle1);
  drawAxes(xBase,yBase2,"" ,"",xBase,yBase2,graphX,graphY,xAxisOffset,xIncrement,"",yIncrement1,xNumDecimals,yNumDecimals1,xAxisTitle,yAxisTitle2,yAxisTitle_2,graphTitle2);

  
  container.removeChild(table1Anchor);     // Remove Observation Table 1 anchor element

  container.removeChild(table2Anchor);    // Remove Observation Table 2 anchor element

  isCanvasUpdating = false; // Reset the flag to allow canvas update
}



function drawFlask() {
  //flasks
  ctx.lineWidth = 1;

  ctx.strokeRect(120, 33, 60, 392);           //flask 1

  ctx.fillStyle = "rgb(135,206,250,0.4)";
  ctx.strokeRect(330, 33, 60, 392);           //flask 2
  ctx.fillRect(330, 33, 60, 392);             //flask 2

  ctx.fillStyle = "black";
  ctx.lineWidth = 1;
  ctx.fillRect(70, 465, 180, 25); //  base 1
  ctx.fillRect(260, 465, 180, 25); //  base 2

  // ctx.fillStyle='grey';
  var gradient = ctx.createLinearGradient(220, 20, 230, 20);

  // gradient colors
  gradient.addColorStop(0, "grey");
  gradient.addColorStop(0.5, "lightgrey");
  gradient.addColorStop(1, "darkgrey");

  // Set the gradient as the fill style
  ctx.fillStyle = gradient;
  ctx.fillRect(220, 0, 10, 465); // stand 1

  var grad = ctx.createLinearGradient(280, 0, 290, 0);

  grad.addColorStop(0, "grey");
  grad.addColorStop(0.5, "lightgrey");
  grad.addColorStop(1, "darkgrey");

  // Set the gradient as the fill style
  ctx.fillStyle = grad;
  ctx.fillRect(280, 0, 10, 465); // stand 2

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(108, 425, 85, 40); //  cube 1

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(318, 425, 85, 40); //  cube 2

  ctx.fillStyle = "#152238"; //electromaganet 1
  ctx.fillRect(137, 65, 30, 5);

  ctx.fillStyle = "#152238"; //electromaganet 2
  ctx.fillRect(345, 65, 30, 5);

  ctx.fillStyle = "rgb(128,0,128,0.3)"; //stoper 1
  ctx.fillRect(120, 45, 60, 10);

  ctx.fillStyle = "rgb(128,0,128,0.3)"; //stoper 2
  ctx.fillRect(330, 45, 60, 10);

  // trapezoid shape 1
  ctx.beginPath();
  ctx.moveTo(110, 25);
  ctx.lineTo(190, 25);
  ctx.lineTo(180, 33);
  ctx.lineTo(120, 33);

  // trapezoid shape 2
  ctx.moveTo(320, 25);
  ctx.lineTo(400, 25);
  ctx.lineTo(390, 33);
  ctx.lineTo(330, 33);
  ctx.stroke();

  ctx.fillStyle = "rgb(128,0,128)"; // Set the fill color
  ctx.fill(); // Fill the trapezoid shape

  ctx.fillStyle = "black";
  ctx.fillRect(215, 5, 18, 10); // rod of flask 1
  ctx.fillRect(100, 10, 150, 2);
  ctx.fillRect(144, 5, 15, 10); //boss head of flask 1
  ctx.fillRect(150, 0, 2, 70);

  ctx.fillRect(278, 5, 18, 10);
  ctx.fillRect(265, 10, 145, 2); // rod of flask 2
  ctx.fillRect(354, 5, 15, 10); //boss head of flask 2
  ctx.fillRect(360, 0, 2, 70);

  ctx.fillStyle = "green"; //valve pipe
  ctx.fillRect(30, 445, 79, 8);
  ctx.fillStyle = "black";
  ctx.strokeRect(30, 445, 79, 8);

  ctx.fillStyle = "red"; //valve
  ctx.fillRect(60, 442, 20, 15);
  ctx.strokeRect(60, 442, 20, 15);
  ctx.fillRect(62, 428, 15, 5);
  ctx.strokeRect(62, 428, 15, 5);
  ctx.fillStyle = "black";
  ctx.fillRect(68, 433, 3, 9);

  ctx.beginPath();
  ctx.arc(18, 446, 16, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.moveTo(6, 435);
  ctx.lineTo(30, 456);

  ctx.moveTo(30, 435);
  ctx.lineTo(6, 456);
  ctx.stroke();

  // Fill and stroke the shape
  ctx.fill();
  ctx.stroke();

  // light gates of flask 1

  ctx.fillStyle = "yellow";

  ctx.fillRect(138, 140, 62, 5); // light gate 1  of flask 1
  ctx.fillRect(138, 175, 62, 5); // light gate 2  of flask 1
  ctx.fillRect(138, 210, 62, 5); // light gate 3  of flask 1
  ctx.fillRect(138, 245, 62, 5); // light gate 4  of flask 1
  ctx.fillRect(138, 280, 62, 5); // light gate 5  of flask 1
  ctx.fillRect(138, 315, 62, 5); // light gate 6  of flask 1
  ctx.fillRect(138, 350, 62, 5); // light gate 7  of flask 1
  ctx.fillRect(138, 385, 62, 5); // light gate 8  of flask 1

  ctx.strokeStyle = "black";

  ctx.strokeRect(138, 140, 62, 5); // light gate 1 of flask 1
  ctx.strokeRect(138, 175, 62, 5); // light gate 2 of flask 1
  ctx.strokeRect(138, 210, 62, 5); // light gate 3 of flask 1
  ctx.strokeRect(138, 245, 62, 5); // light gate 4 of flask 1
  ctx.strokeRect(138, 280, 62, 5); // light gate 5 of flask 1
  ctx.strokeRect(138, 315, 62, 5); // light gate 6 of flask 1
  ctx.strokeRect(138, 350, 62, 5); // light gate 7 of flask 1
  ctx.strokeRect(138, 385, 62, 5); // light gate 8 of flask 1

  ctx.fillStyle = "black";

  ctx.fillRect(215, 140-2, 16, 10); // light gate 1 of flask 1
  ctx.fillRect(215, 175-2, 16, 10); // light gate 2 of flask 1
  ctx.fillRect(215, 210-2, 16, 10); // light gate 3 of flask 1
  ctx.fillRect(215, 245-2, 16, 10); // light gate 4 of flask 1
  ctx.fillRect(215, 280-2, 16, 10); // light gate 5 of flask 1
  ctx.fillRect(215, 315-2, 16, 10); // light gate 6 of flask 1
  ctx.fillRect(215, 350-2, 16, 10); // light gate 7 of flask 1
  ctx.fillRect(215, 385-2, 16, 10); // light gate 8 of flask 1

  ctx.beginPath();
  ctx.moveTo(200, 142);
  ctx.lineTo(220, 142);

  ctx.moveTo(200, 177);
  ctx.lineTo(220, 177);

  ctx.moveTo(200, 212);
  ctx.lineTo(220, 212);

  ctx.moveTo(200, 247);
  ctx.lineTo(220, 247);

  ctx.moveTo(200, 282);
  ctx.lineTo(220, 282);

  ctx.moveTo(200, 317);
  ctx.lineTo(220, 317);

  ctx.moveTo(200, 352);
  ctx.lineTo(220, 352);

  ctx.moveTo(200, 387);
  ctx.lineTo(220, 387);
  ctx.fill();
  ctx.stroke();


  ctx.fillStyle = "yellow";

  ctx.fillRect(310, 140, 62, 5); // light gate 1  of flask 2
  ctx.fillRect(310, 175, 62, 5); // light gate 2  of flask 2
  ctx.fillRect(310, 210, 62, 5); // light gate 3  of flask 2
  ctx.fillRect(310, 245, 62, 5); // light gate 4  of flask 2
  ctx.fillRect(310, 280, 62, 5); // light gate 5  of flask 2
  ctx.fillRect(310, 315, 62, 5); // light gate 6  of flask 2
  ctx.fillRect(310, 350, 62, 5); // light gate 7  of flask 2
  ctx.fillRect(310, 385, 62, 5); // light gate 8  of flask 2

  ctx.strokeStyle = "black";
  ctx.strokeRect(310, 140, 62, 5); // light gate 1 of flask 2
  ctx.strokeRect(310, 175, 62, 5); // light gate 2 of flask 2
  ctx.strokeRect(310, 210, 62, 5); // light gate 3 of flask 2
  ctx.strokeRect(310, 245, 62, 5); // light gate 4 of flask 2
  ctx.strokeRect(310, 280, 62, 5); // light gate 5 of flask 2
  ctx.strokeRect(310, 315, 62, 5); // light gate 6 of flask 2
  ctx.strokeRect(310, 350, 62, 5); // light gate 7 of flask 2
  ctx.strokeRect(310, 385, 62, 5); // light gate 8 of flask 2



  ctx.beginPath();
  ctx.moveTo(290, 142);
  ctx.lineTo(310, 142);

  ctx.moveTo(290, 177);
  ctx.lineTo(310, 177);

  ctx.moveTo(290, 212);
  ctx.lineTo(310, 212);

  ctx.moveTo(290, 247);
  ctx.lineTo(310, 247);

  ctx.moveTo(290, 282);
  ctx.lineTo(310, 282);

  ctx.moveTo(290, 317);
  ctx.lineTo(310, 317);

  ctx.moveTo(290, 352);
  ctx.lineTo(310, 352);

  ctx.moveTo(290, 387);
  ctx.lineTo(310, 387);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "black";

  ctx.fillRect(278, 140-2, 16, 10); // light gate 1 of flask 1
  ctx.fillRect(278, 175-2, 16, 10); // light gate 2 of flask 1
  ctx.fillRect(278, 210-2, 16, 10); // light gate 3 of flask 1
  ctx.fillRect(278, 245-2, 16, 10); // light gate 4 of flask 1
  ctx.fillRect(278, 280-2, 16, 10); // light gate 5 of flask 1
  ctx.fillRect(278, 315-2, 16, 10); // light gate 6 of flask 1
  ctx.fillRect(278, 350-2, 16, 10); // light gate 7 of flask 1
  ctx.fillRect(278, 385-2, 16, 10); // light gate 8 of flask 1

  drawScale();
}

function drawScale() {
  //Scale
  const minValue = 0;
  const maxValue = 2;

  const scaleWidth = 20; // Width of the scale
  const scaleHeight = canvas.height - 100; // Height of the scale
  const scaleX = 75; // X-coordinate of the scale
  const scaleY = 40; // Y-coordinate of the scale

  const numIntervals = 10; // Number of intervals on the scale
  const intervalHeight = scaleHeight / numIntervals-4;
  const mmLineLength = 12; // Length of the mm lines

  ctx.fillStyle = "black"; // Set the fill color for the labels
  ctx.textAlign = "right"; // Align the labels to the right side
  ctx.font = "12px Arial";

  for (let i = 0; i <= numIntervals; i++) {
    const intervalValue = minValue + ((maxValue - minValue) / numIntervals) * i;
    const intervalX = scaleX + scaleWidth + 5; // Adjust the X-coordinate for the label
    const intervalY = scaleY + scaleHeight - intervalHeight * i;
    ctx.textBaseline = "bottom";
    ctx.fillText(intervalValue.toFixed(1), intervalX, intervalY);
    ctx.fillText(intervalValue.toFixed(1), intervalX + 322, intervalY);

    // Draw mm lines
    const mmLineX = scaleX + scaleWidth + 10;
    const mmLineY = intervalY - mmLineLength / 2;
    ctx.fillRect(mmLineX, mmLineY, mmLineLength, 1);
    ctx.fillRect(mmLineX + 287, mmLineY, mmLineLength, 1);
    // ctx.fillText(currentTimeString, intervalX+100, intervalY);
  }
}

var xBase = 512;
var yBase1 = 50;
var yBase2 = 300;

var graphX = 8;
var graphY = 5;

var xAxisOffset = 0;
var xIncrement = 0.5;
var yIncrement = 2; // y axis value increment of velocity vs time graph
var yIncrement1 = 0.04; // y axis value increment of drag force vs time graph

var xNumDecimals = 2;

var yNumDecimals = 0;
var yNumDecimals1 = 2;

var xAxisTitle = "t (s)";
var yAxisTitle1 = "Velocity";
var yAxisTitle2 = "Drag ";
var yAxisTitle_1 = "(m/s)";
var yAxisTitle_2 = "Force (N)";

var graphTitle1 = "Velocity vs time";
var graphTitle2 = "Drag force vs time";

function drawAxes(xAxisStart,yAxisStart,xAxisStart1,yAxisStart1,xAxisStart2,yAxisStart2,xNum,yNum,xOffset,xIncrement,yIncrement,yIncrement1,xNumDecimals,yNumDecimals,xAxisTitle,yAxisTitle,y_AxisTitle,graphTitle) {
  // set background color for the graph
  ctx.fillStyle = "#ffd4d4";
  ctx.fillRect(xAxisStart, yAxisStart, 30 * xNum, 30 * yNum);

  var axisLabel = "";
  var axisValue = 0;


  // vertical grid lines
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#888";

  for (var i = 0; i <= xNum; i++) {
    ctx.beginPath();
    ctx.moveTo(xAxisStart + 30 * i, yAxisStart);
    ctx.lineTo(xAxisStart + 30 * i, yAxisStart + 30 * yNum + 10);
    ctx.stroke();
    ctx.font = "10pt Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    axisValue = xOffset + xIncrement * i;
    axisLabel = axisValue.toFixed(1);

    ctx.fillText(axisLabel, xAxisStart + 30 * i, yAxisStart + 30 * yNum + 20);
  }

  // horizontal grid lines
  for (i = 0; i <= yNum; i++) {
    ctx.beginPath();
    ctx.moveTo(xAxisStart - 10, yAxisStart + 30 * i);
    ctx.lineTo(xAxisStart + 30 * xNum, yAxisStart + 30 * i);
    ctx.stroke();
  }
  for (i = 0; i <= yNum; i++) {
    
    ctx.font = "10pt Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    axisValue = yIncrement * (yNum - i);
    axisLabel = axisValue.toFixed(yNumDecimals);
    ctx.fillText(axisLabel, xAxisStart1 - 20, yAxisStart1 + 30 * i);
  }
  for (i = 0; i <= yNum; i++) {
    ctx.font = "10pt Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    axisValue = yIncrement1 * (yNum - i) ;
    axisLabel = axisValue.toFixed(2);
    ctx.fillText(axisLabel, xAxisStart2 - 20, yAxisStart2 + 30 * i);
  }

  // x-axis
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(xAxisStart - 1, yAxisStart + 30 * yNum);
  ctx.lineTo(xAxisStart + 30 * xNum + 20, yAxisStart + 30 * yNum);
  ctx.stroke();
  ctx.moveTo(xAxisStart + 30 * xNum + 10, yAxisStart + 30 * yNum - 6);
  ctx.lineTo(xAxisStart + 30 * xNum + 20, yAxisStart + 30 * yNum);
  ctx.lineTo(xAxisStart + 30 * xNum + 10, yAxisStart + 30 * yNum + 6);
  ctx.lineJoin = "miter";
  ctx.stroke();
  ctx.font = "12pt Calibri";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.fillText(xAxisTitle, xAxisStart + 30 * xNum + 24, yAxisStart + 30 * yNum);

  // y-axis

  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(xAxisStart, yAxisStart - 15); // velocity vs time graph y axis
  ctx.lineTo(xAxisStart, yAxisStart + 30 * yNum);
  ctx.stroke();
  ctx.moveTo(xAxisStart - 6, yAxisStart - 10);
  ctx.lineTo(xAxisStart, yAxisStart - 20);
  ctx.lineTo(xAxisStart + 6, yAxisStart - 10);
  ctx.lineJoin = "miter";
  ctx.stroke();

  ctx.strokeStyle = "#000";
  ctx.textAlign = "center";
  //         console.log("In the drawMotion function, with yAxisTitle = " + yAxisTitle + xAxisStart );

  ctx.font = "10pt Calibri";
  ctx.fillStyle = "black";
  ctx.fillText(yAxisTitle, xAxisStart - 25, yAxisStart - 35);
  ctx.fillText(y_AxisTitle, xAxisStart - 25, yAxisStart - 22);


  // graph title
  ctx.font = "bold 14pt Calibri";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(graphTitle, xAxisStart + (30 * xNum) / 2, yAxisStart - 28);
}

reset();
drawCanvasBalls(); // Draw the initial canvas with the balls
drawFlask();
drawAxes(xBase,yBase1,xBase,yBase1,"" ,"",graphX,graphY,xAxisOffset,xIncrement,yIncrement,"",xNumDecimals,yNumDecimals,xAxisTitle,yAxisTitle1,yAxisTitle_1,graphTitle1);
drawAxes(xBase,yBase2,"" ,"",xBase,yBase2,graphX,graphY,xAxisOffset,xIncrement,"",yIncrement1,xNumDecimals,yNumDecimals1,xAxisTitle,yAxisTitle2,yAxisTitle_2,graphTitle2);
