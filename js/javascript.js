
//global variables
var xVantage = 0;
var yVantage = 0;
var zVantage = 300;
var eyeDistance = 500;
var debugFlag = false;
var numOfVertices = 8;
var objectSize = 150;
var hRotation = 0;
var vRotation = 0;
var canvasWidth = 0;
var canvasHeight = 0;
var canvasX = 0;
var canvasY = 0;
var points = makeDodecahedron(objectSize);
var rotatedPoints = points;
/* driver function to initiate all necessary functions. */
function runAll() {
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
	document.getElementById("zSliderText").innerHTML = "Z Vantage: " + zVantage;
	document.getElementById("ySliderText").innerHTML = "Y Vantage: " + yVantage;
	document.getElementById("xSliderText").innerHTML = "X Vantage: " + xVantage;
	mouseRotate();
}
/*Calls the appropriate draw function based on which shape button the user
has selected. Replaces global variale points with the coordinate points
of the new object then redraws*/
function changeShape(shape) {
	if (shape == 0) {
		points = makeCube(objectSize);
		rotatedPoints = points;
	}
	if (shape == 1) {
		points = makeDodecahedron(objectSize);
		rotatedPoints = points;
	}
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
}
//keyboard controls.
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
//keyboard controls.
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
/*the setVantage functions are controlled by the sliders on the html page. They change the
global variables for vantage position then redraw the object.*/
function setXVantage(xValue) {
	if (Math.abs(xValue) > canvasWidth*2) {
		xValue *= -0.98;
	}
	xVantage = xValue;
	document.getElementById("xSliderText").innerHTML = "X Vantage: " + parseFloat(Math.round(xVantage).toFixed(5));
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function setYVantage(yValue) {
	if (Math.abs(yValue) > canvasWidth*2) {
	yValue *= -0.98;
	}
	yVantage = yValue;
	document.getElementById("ySliderText").innerHTML = "Y Vantage: " + parseFloat(Math.round(yVantage).toFixed(5));
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function setZVantage(zValue) {
	zVantage = zValue;
	document.getElementById("zSliderText").innerHTML = "Z Vantage: " + parseFloat(Math.round(zVantage).toFixed(5));
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
}	
//simple toggle to switch debug dialog on and off
function toggleDebug() {
	if (debugFlag == true) {
		debugFlag = false;
	} else {
		debugFlag = true;
	}
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
}
/*the 2 setRotation functions take in new rotation information and
assign them to the global variables for the rotation. The function keeps
the rotation within +/- 360. the function then calls the rotateObject
method to actually rotate the points and assign them to the rotatedPoints
global array*/
function setHRotation(hValue) {
	if (Math.abs(hValue) > 360) {
	hValue = 0;
	}
	hRotation = hValue;
	rotatedPoints = rotateObject(hRotation,vRotation);
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}
function setVRotation(vValue) {
	if (Math.abs(vValue) > 360) {
	vValue = 0;
	}
	vRotation = vValue;
	rotatedPoints = rotateObject(hRotation,vRotation);
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}
//global variables to keep track of mouse position
var mouseX = 0;
var mouseY = 0;
/*the following 2 functions keep track of the mouse position
and change the rotation values accordingly. The rotation values
change more quickly based on how far away the mouse is from the center
of the canvas. The mouseRotate function that actually applies mouse
position to a change of rotation is run on an interval from the runAll
function.*/
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
	
/* Function that draws the actual shape on the canvas. Takes in the vantage information
and uses the global array rotatedPoints which include the coordinates of each points after
rotiation. The array also contains information about which other point a single point touches*/
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
	/*this for loop takes the 3D points of the object and calculates where the points would appear on a 2D display
	based on the vantage point. Does not use matricies but rather similar triangles.*/
	for (var i=0;i<rotatedPoints.length;i++) {
		var x = ((vantageX-rotatedPoints[i][0]))/((eyeDistance+(vantageZ-rotatedPoints[i][2]))/eyeDistance);
		var y = ((vantageY-rotatedPoints[i][1]))/((eyeDistance+(vantageZ-rotatedPoints[i][2]))/eyeDistance);
		rasterizedPts[i] = [x+canvasWidth,y+canvasHeight];
		//Prints debugging information to canvas, including ID of each point
		if (debugFlag == true) {
			myCanvas.font="13px Arial";
			myCanvas.fillText(i,x+10+canvasWidth,y+canvasHeight);
			myCanvas.fillText("X Vantage: " + parseFloat(Math.round(xVantage).toFixed(5)) + " Y Vantage: " + 
			parseFloat(Math.round(yVantage).toFixed(5)) + " Z Vantage: " + parseFloat(Math.round(zVantage).toFixed(5)),10,25);
			myCanvas.fillText("Upwards Rotation: " + parseFloat(Math.round(hRotation).toFixed(5)) + " Sideways Rotation: "
			+ parseFloat(Math.round(vRotation).toFixed(5)),10,45);
			
		}
	}
	/*draws all the lines of the object based on the position of each points and which other points
	//a single point touches. technically reduntantly draws 2 lines for every single line but efficiency
	//is not hugely important*/
	for (var i=0;i<rotatedPoints.length;i++) {
		for (var c=3;c<rotatedPoints[i].length;c++) {
			myCanvas.beginPath();
			myCanvas.moveTo(rasterizedPts[i][0],rasterizedPts[i][1]);
			myCanvas.lineTo(rasterizedPts[rotatedPoints[i][c]][0],rasterizedPts[rotatedPoints[i][c]][1]);
			myCanvas.strokeStyle = '#ff0000';
			myCanvas.stroke();
		}

	}
	myCanvas.fillText("Use arrow keys to move perspective and mouse to rotate.",10,2*canvasHeight-10);
	myCanvas.fillText("Made by Karl Diab in pure JavaScript",10,2*canvasHeight-23);
}
/*Function to draw a simple cube wireframe*/
function makeCube(size) {
	var points = new Array();
	//default xyz for the first point
	var x = -size/2;
	var y = -size/2;
	var z = -size/2;
	/*this for loop adds information about which
	point touches which points so that lines can 
	be drawn between then*/
	for (var i =0; i < 8; i++) {
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
		/*each entry to the points array is for a single point this includes the xyz coords and which
		3 points that single point is touching*/
		var subArray = [x,y,z,C1,C2,C3];
		points[i] = subArray;
		/*modifies xyz coords for each point ([i]). There is probably a cleaner mathmatical way to derrive
		the points of a cube but this is the best one I could produce in 10 mins*/
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
		if (i >= 8/2 - 1) {
			x = size/2;
		} else {
			x = -size/2;
		}
	}
	return points;
}
/*THIS function was adapted from Superbest's C# method on StackOverflow
http://stackoverflow.com/questions/10460337/how-to-generate-calculate-vertices-of-dodecahedron
but was heavily modified by myself to suit my needs.
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
	vertices[0].splice(3,0,3,10,13);
	vertices[1].splice(3,0,3,4,11);
	vertices[2].splice(3,0,3,7,8);
	vertices[3].splice(3,0,0,1,2);
	vertices[4].splice(3,0,1,5,7);
	vertices[5].splice(3,0,4,14,15);
	vertices[6].splice(3,0,8,9,16);
	vertices[7].splice(3,0,2,4,9);
	vertices[8].splice(3,0,2,6,10);
	vertices[9].splice(3,0,6,7,15);
	vertices[10].splice(3,0,0,8,18);
	vertices[11].splice(3,0,1,13,14);
	vertices[12].splice(3,0,13,17,18);
	vertices[13].splice(3,0,0,11,12);
	vertices[14].splice(3,0,5,11,17);
	vertices[15].splice(3,0,5,9,19);
	vertices[16].splice(3,0,6,18,19);
	vertices[17].splice(3,0,12,14,19);
	vertices[18].splice(3,0,10,12,16);
	vertices[19].splice(3,0,15,16,17);
	return vertices;
}
/*function that rotates the object's coordinates based on the current Rotation global variables. Returns modified array.
Function always assume object is rotating around origin that is at the center of the object.*/
function rotateObject(hRotation,vRotation) {
	var hTranslated = (hRotation*Math.PI)/180;
	var vTranslated = (vRotation*Math.PI)/180;
	var cosH = Math.cos(hTranslated);
	var sinH = Math.sin(hTranslated);
	var cosV = Math.cos(vTranslated);
	var sinV = Math.sin(vTranslated);
	var rotated = new Array();
	for (var i = 0;i<points.length;i++) {
		rotated[i] = [points[i][0]*cosH - points[i][2]*sinH,points[i][1],points[i][0]*sinH + points[i][2] * cosH,points[i][3],points[i][4],points[i][5]];
		rotated[i] = [rotated[i][0],rotated[i][1]*cosV - rotated[i][2]*sinV,rotated[i][1]*sinV + rotated[i][2] * cosV,points[i][3],points[i][4],points[i][5]];
	}
	
	return rotated;
}