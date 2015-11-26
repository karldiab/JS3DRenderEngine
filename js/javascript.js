
var xVantage = 0;
var yVantage = 0;
var zVantage = 400;
var eyeDistance = 500;
var debugFlag = true;
var numOfVertices = 8;
var objectSize = 100;
var hRotation = 0;
var vRotation = 0;
var canvasWidth = 0;
var canvasHeight = 0;
var canvasX = 0;
var canvasY = 0;
var myMessage = "";
var points = makeDodecahedron(250);
var rotatedPoints = points;
/* driver function to initiate all necessary functions. */
function runAll() {
	document.getElementById("zSliderText").innerHTML = "Z Vantage: " + zVantage;
	document.getElementById("ySliderText").innerHTML = "Y Vantage: " + yVantage;
	document.getElementById("xSliderText").innerHTML = "X Vantage: " + xVantage;
	mouseRotate();
	/*var dodeca = makeDodecahedron(250);
	plotPoints(xVantage,yVantage,zVantage,eyeDistance,rotatedPoints);
	for (var i = 0; i < dodeca.length; i++) {
		myMessage += dodeca[i] + "</br>";
	}
	document.getElementById("coords").innerHTML = myMessage;*/

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
	document.getElementById("xSliderText").innerHTML = "X Vantage: " + parseFloat(Math.round(xVantage).toFixed(5));
	//drawFrame(xVantage,yVantage,zVantage,eyeDistance)
	plotPoints(xVantage,yVantage,zVantage,eyeDistance,rotatedPoints);
}	
function setYVantage(yValue) {
	if (Math.abs(yValue) > canvasWidth*2) {
	yValue *= -0.98;
	}
	yVantage = yValue;
	document.getElementById("ySliderText").innerHTML = "Y Vantage: " + parseFloat(Math.round(yVantage).toFixed(5));
	//drawFrame(xVantage,yVantage,zVantage,eyeDistance)
	plotPoints(xVantage,yVantage,zVantage,eyeDistance,rotatedPoints);
}	
function setZVantage(zValue) {
	zVantage = zValue;
	document.getElementById("zSliderText").innerHTML = "Z Vantage: " + parseFloat(Math.round(zVantage).toFixed(5));
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
function plotPoints(vantageX,vantageY,vantageZ,eyeDistance, points) {
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
	for (var i=0;i<points.length;i++) {
		//var distance = Math.sqrt(Math.pow(vantageX-rotatedPoints[i][0],2)+Math.pow(vantageY-rotatedPoints[i][1],2)+Math.pow(vantageZ-rotatedPoints[i][2],2))
		var x = ((vantageX-rotatedPoints[i][0]))/((eyeDistance+(vantageZ-rotatedPoints[i][2]))/eyeDistance);
		var y = ((vantageY-rotatedPoints[i][1]))/((eyeDistance+(vantageZ-rotatedPoints[i][2]))/eyeDistance);
		rasterizedPts[i] = [x+canvasWidth,y+canvasHeight];
			if (debugFlag == true) {
			//myCanvas.fillText(rotatedPoints[i] + " X: " + x + " Y: " + y,x+10+width,y+height+(i*5));
			myCanvas.font="13px Arial";
			myCanvas.fillText(i,x+10+canvasWidth,y+canvasHeight);
			myCanvas.fillText("X Vantage: " + parseFloat(Math.round(xVantage).toFixed(5)) + " Y Vantage: " + 
			parseFloat(Math.round(yVantage).toFixed(5)) + " Z Vantage: " + parseFloat(Math.round(zVantage).toFixed(5)),10,25);
			myCanvas.fillText("Upwards Rotation: " + parseFloat(Math.round(hRotation).toFixed(5)) + " Sideways Rotation: "
			+ parseFloat(Math.round(vRotation).toFixed(5)),10,55);
			myCanvas.fillText("Use arrow keys to move perspective and mouse to rotate.",10,2*canvasHeight-10);
			myCanvas.fillText("Made by Karl Diab in pure JavaScript",10,2*canvasHeight-30);
		}
	}
		for (var i=0;i<rasterizedPts.length;i++) {
			myCanvas.fillStyle = '#ff0000';
			myCanvas.fillRect(rasterizedPts[i][0],rasterizedPts[i][1],3,3);
			//myCanvas.lineWidth = 10;
		}
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
			myCanvas.font="13px Arial";
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
/*THIS function was adapted from Superbest's C# method on StackOverflow
http://stackoverflow.com/questions/10460337/how-to-generate-calculate-vertices-of-dodecahedron
*/
function makeDodecahedron(r)
{
	// Calculate constants that will be used to generate vertices
	var phi = (Math.sqrt(5) - 1) / 2; // The golden ratio
	var a = 1 / Math.sqrt(3);
	var b = a / phi;
	var c = a * phi;
	// Generate each vertex
	var vertices = new Array();
	var builderArray = [-1,1];
	for (var i = 0; i < builderArray.length; i++)
	{
		for (var j = 0; j < builderArray.length; j++)
		{
			vertices.push([
								0,
								builderArray[i] * c * r,
								builderArray[j] * b * r]);
			vertices.push([
								builderArray[i] * c * r,
								builderArray[j] * b * r,
								0]);
			vertices.push([
								builderArray[i] * b * r,
								0,
								builderArray[j] * c * r]);

			for (var k = 0; k < builderArray.length; k++) {
				vertices.push([
									builderArray[i] * a * r,
									builderArray[j] * a * r,
									builderArray[k] * a * r]);
			}
		}
	}
	//Manually adding which points connect because I can't find a mathmatical relationship
	//to automate the process.
	vertices[0].spice(3,0,3,10,13);
	vertices[1].spice(3,0,3,4,11);
	vertices[2].spice(3,0,3,7,8);
	vertices[3].spice(3,0,0,1,2);
	vertices[4].spice(3,0,1,5,7);
	vertices[5].spice(3,0,4,14,15);
	vertices[6].spice(3,0,8,9,16);
	vertices[7].spice(3,0,2,4,9);
	vertices[8].spice(3,0,2,6,10);
	vertices[9].spice(3,0,6,7,15);
	vertices[10].spice(3,0,0,8,18);
	vertices[11].spice(3,0,1,13,14);
	vertices[12].spice(3,0,13,17,18);
	vertices[13].spice(3,0,0,11,12);
	vertices[14].spice(3,0,5,11,17);
	vertices[15].spice(3,0,5,9,19);
	vertices[16].spice(3,0,6,18,19);
	vertices[17].spice(3,0,12,14,19);
	vertices[18].spice(3,0,10,12,16);
	vertices[19].spice(3,0,15,16,17);
	
	return vertices;
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
		rotated[i] = [points[i][0]*cosH - points[i][2]*sinH,points[i][1],points[i][0]*sinH + points[i][2] * cosH];
		//console.log("i: " + i + " " + points[i][0] + " " + rotated[i][0]);
		rotated[i] = [rotated[i][0],rotated[i][1]*cosV - rotated[i][2]*sinV,rotated[i][1]*sinV + rotated[i][2] * cosV];
	}
	
	return rotated;
}
