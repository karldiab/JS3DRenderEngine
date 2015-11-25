
var xVantage = 0;
var yVantage = 0;
var zVantage = 500;
var eyeDistance = 500;
var debugFlag = true;
var numOfVertices = 8;
var objectSize = 200;
var hRotation = 0;
var vRotation = 0;
var canvasWidth = 0;
var canvasHeight = 0;
var canvasX = 0;
var canvasY = 0;
//var n = d.getTime();
var points = renderObject(numOfVertices, objectSize);
var rotatedPoints = points;
/* driver function to initiate all necessary functions. */
function runAll() {
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
	mouseRotate();

}
//window.addEventListener('keydown',this.check,false);
window.addEventListener('keyup', function(event) { Key.onKeyup(event); keyboardRxn(); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); keyboardRxn(); }, false);
var Key = {
  _pressed: {},
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = new Date().getTime();
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

function keyboardRxn() {
	if (Key.isDown(Key.UP)) {
		if (Key.isDown(Key.UP) > (new Date().getTime()-1500)) {
			setYVantage(yVantage-40);
		} else {
			setYVantage(yVantage-8);
		}
	}
	if (Key.isDown(Key.LEFT)) {
		if (Key.isDown(Key.LEFT) > (new Date().getTime()-1500)) {
			setXVantage(xVantage-40);
		} else {
			setXVantage(xVantage-8);
		}
	}
	if (Key.isDown(Key.DOWN)) {
		if (Key.isDown(Key.DOWN) > (new Date().getTime()-1500)) {
			setYVantage(yVantage+40);
		} else {
			setYVantage(yVantage+8);
		}
	}
	if (Key.isDown(Key.RIGHT)) {
		if (Key.isDown(Key.RIGHT) > (new Date().getTime()-1500)) {
			setXVantage(xVantage+40);
		} else {
			setXVantage(xVantage+8);
		}
	}
}

function setXVantage(xValue) {
	if (Math.abs(xValue) > canvasWidth*2) {
		xValue *= -0.98;
	}
	xVantage = xValue;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function setYVantage(yValue) {
	if (Math.abs(yValue) > canvasWidth*2) {
	yValue *= -0.98;
	}
	yVantage = yValue;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function setZVantage(zValue) {
	if (Math.abs(zValue) > canvasWidth) {
	zValue *= -0.98;
	}
	zVantage = zValue;
	document.getElementById("zSliderText").innerHTML = "Z Vantage: " + zVantage;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
}	
function toggleDebug() {
	if (debugFlag == true) {
		debugFlag = false;
	} else {
		debugFlag = true;
	}
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
}
var mouseX = 0;
var mouseY = 0;
function setHRotation(hValue) {
	if (Math.abs(hValue) > 360) {
	hValue = 0;
	}
	hRotation = hValue;
	rotatedPoints = rotateObject(hRotation,vRotation);
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}
document.onmousemove = setMouseXY;
function setMouseXY(e) {
	mouseX = e.clientX;
    mouseY = e.clientY;

}
function mouseRotate() {
	setInterval(function() {
		hRotation += (mouseX-(canvasX+canvasWidth))/100;
		vRotation += (mouseY-(canvasY+canvasHeight))/100;
	setVRotation(vRotation);
	setHRotation(hRotation);
	}, 50);
}
function setVRotation(vValue) {
	if (Math.abs(vValue) > 360) {
	vValue = 0;
	}
	vRotation = vValue;
	rotatedPoints = rotateObject(hRotation,vRotation);
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}
	
// Function to draw sky as backdrop
function drawFrame(vantageX,vantageY,vantageZ,eyeDistance) {
	var canvas = document.getElementById("renderCanvas");
	var myCanvas = canvas.getContext("2d");
	canvasWidth = canvas.width/2;
	canvasHeight = canvas.height/2;
	canvasX = canvas.getBoundingClientRect().left;
	canvasY = canvas.getBoundingClientRect().top;
	myCanvas.beginPath();
	myCanvas.moveTo(0,0);
	myCanvas.lineTo(0,1000);
	myCanvas.lineTo(1000,1000);
	myCanvas.lineTo(1000,0);
	myCanvas.closePath();
	myCanvas.fillStyle= "rgb(0,0,0)";
	myCanvas.fill();
	myCanvas.fillStyle= "white";
	var rasterizedPts = new Array();
	for (var i=0;i<rotatedPoints.length;i++) {
		//var distance = Math.sqrt(Math.pow(vantageX-rotatedPoints[i][0],2)+Math.pow(vantageY-rotatedPoints[i][1],2)+Math.pow(vantageZ-rotatedPoints[i][2],2))
		var x = ((vantageX-rotatedPoints[i][0]))/((eyeDistance+(vantageZ-rotatedPoints[i][2]))/eyeDistance);
		var y = ((vantageY-rotatedPoints[i][1]))/((eyeDistance+(vantageZ-rotatedPoints[i][2]))/eyeDistance);
		rasterizedPts[i] = [x+canvasWidth,y+canvasHeight];
		//myCanvas.fillRect(x+width,y+height,3,3);
		if (debugFlag == true) {
			//myCanvas.fillText(rotatedPoints[i] + " X: " + x + " Y: " + y,x+10+width,y+height+(i*5));
			myCanvas.font="20px Arial";
			myCanvas.fillText(i,x+10+canvasWidth,y+canvasHeight);
			myCanvas.fillText("X Vantage: " + parseFloat(Math.round(xVantage).toFixed(5)) + " Y Vantage: " + 
			parseFloat(Math.round(yVantage).toFixed(5)) + " Z Vantage: " + parseFloat(Math.round(zVantage).toFixed(5)),10,25);
			myCanvas.fillText("Upwards Rotation: " + parseFloat(Math.round(hRotation).toFixed(5)) + " Sideways Rotation: "
			+ parseFloat(Math.round(vRotation).toFixed(5)),10,55);
			myCanvas.fillText("Use arrow keys to move perspective and mouse to rotate.",10,2*canvasHeight-10);
			myCanvas.fillText("Made by Karl Diab in pure JavaScript",10,2*canvasHeight-30);
		}
	//setTimeout(mouseRotate(), 100);
	}

	for (var i=0;i<rotatedPoints.length;i++) {
		for (var c=3;c<rotatedPoints[i].length;c++) {
			
			myCanvas.beginPath();
			myCanvas.moveTo(rasterizedPts[i][0],rasterizedPts[i][1]);
			myCanvas.lineTo(rasterizedPts[rotatedPoints[i][c]][0],rasterizedPts[rotatedPoints[i][c]][1]);
			//myCanvas.lineWidth = 10;
			myCanvas.strokeStyle = '#ff0000';
			myCanvas.stroke();
		}

	}
	
}
/*Function to creates a 3D object as a 2D array of points in space.
returns the array*/
function renderObject(numOfPoints, size) {
	var points = new Array();
	var x = -size/2;
	var y = -size/2;
	var z = -size/2;

	for (var i =0; i < numOfPoints; i++) {
		if (x < 0) {
			var C1 = i+4;
		} else {
			var C1 = i-4;
		}
		if (y < 0) {
			var C2 = i+2;
		} else {
			var C2 = i-2;
		}
		if (z < 0) {
			var C3 = i+1;
		} else {
			var C3 = i-1;
		}
		var subArray = [x,y,z,C1,C2,C3];
		points[i] = subArray;
		if (i%2 == 0) {
			z = size/2;
		} else {
			z = -size/2;
		}
		if (z < 0 && y < 0) {
			y = size/2;
		} else if (z < 0 && y > 0) {
			y = -size/2;
		}
		if (i >= numOfPoints/2 - 1) {
			x = size/2;
		} else {
			x = -size/2;
		}
	}
	return points;
}
function rotateObject(hRotation,vRotation) {
	var hTranslated = (hRotation*Math.PI)/180;
	var vTranslated = (vRotation*Math.PI)/180;
	var cosH = Math.cos(hTranslated);
	var sinH = Math.sin(hTranslated);
	var cosV = Math.cos(vTranslated);
	var sinV = Math.sin(vTranslated);
	var rotated = new Array();
	
	for (var i = 0;i<points.length;i++) {
		//rotated[i] = [points[i][0]*cosH - points[i][1]*sinH,points[i][0]*sinH + points[i][1] * cosH,points[i][2],points[i][3],points[i][4],points[i][5]];
		rotated[i] = [points[i][0]*cosH - points[i][2]*sinH,points[i][1],points[i][0]*sinH + points[i][2] * cosH,points[i][3],points[i][4],points[i][5]];
		//console.log("i: " + i + " " + points[i][0] + " " + rotated[i][0]);
		rotated[i] = [rotated[i][0],rotated[i][1]*cosV - rotated[i][2]*sinV,rotated[i][1]*sinV + rotated[i][2] * cosV,points[i][3],points[i][4],points[i][5]];
	}
	
	return rotated;
}