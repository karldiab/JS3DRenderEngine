var xVantage = 0;
var yVantage = 0;
var zVantage = 500;
var eyeDistance = 500;
var debugFlag = false;
var numOfVertices = 8;
var objectSize = 200;
var hRotation = 0;
var vRotation = 0;
var points = renderObject(numOfVertices, objectSize);
var rotatedPoints = points;
/* driver function to initiate all necessary functions. */
function runAll() {
	
	document.getElementById("xSliderText").innerHTML = "X Vantage: " + xVantage;
	document.getElementById("ySliderText").innerHTML = "Y Vantage: " + yVantage;
	document.getElementById("zSliderText").innerHTML = "Z Vantage: " + zVantage;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
	
	
}

function setXVantage(xValue) {
	xVantage = xValue;
	document.getElementById("xSliderText").innerHTML = "X Vantage: " + xValue;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function setYVantage(yValue) {
	yVantage = yValue;
	document.getElementById("ySliderText").innerHTML = "Y Vantage: " + yVantage;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function setZVantage(zValue) {
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
function setHRotation(hValue) {
	hRotation = hValue;
	document.getElementById("hRotationText").innerHTML = "Horizontal Rotation: " + hRotation;
	rotatedPoints = rotateObject(hRotation,vRotation);
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}
	
// Function to draw sky as backdrop
function drawFrame(vantageX,vantageY,vantageZ,eyeDistance) {
	var canvas = document.getElementById("renderCanvas");
	var myCanvas = canvas.getContext("2d");
	var width = canvas.width/2;
	var height = canvas.height/2;
	myCanvas.beginPath();
	myCanvas.moveTo(0,0);
	myCanvas.lineTo(0,1000);
	myCanvas.lineTo(1000,1000);
	myCanvas.lineTo(1000,0);
	myCanvas.closePath();
	myCanvas.fillStyle= "rgb(0,0,0)";
	myCanvas.fill();
	myCanvas.fillStyle= "white";
	/*myCanvas.fillText("TOP X: " + (Math.sqrt(Math.pow(Math.abs(vantageZ),2)+Math.pow(points[5][0],2))),100,100);
	myCanvas.fillText("BOTTOM X: " + (Math.sqrt(Math.pow((Math.abs(Math.abs(vantageZ))+points[5][2]),2)+Math.pow(points[5][0],2))),100,150);
		myCanvas.fillText("TOP Y: " + (Math.sqrt(Math.pow(Math.abs(vantageZ),2)+Math.pow(points[5][1],2))),100,200);
	myCanvas.fillText("BOTTOM Y: " + (Math.sqrt(Math.pow((Math.abs(Math.abs(vantageZ))+points[5][2]),2)+Math.pow(points[5][1],2))),100,250);
	myCanvas.fillText(Math.abs(vantageZ)+points[5][2],100,300);*/
	var rasterizedPts = new Array();
	for (var i=0;i<rotatedPoints.length;i++) {
		//var distance = Math.sqrt(Math.pow(vantageX-rotatedPoints[i][0],2)+Math.pow(vantageY-rotatedPoints[i][1],2)+Math.pow(vantageZ-rotatedPoints[i][2],2))
		var x = ((vantageX-rotatedPoints[i][0]))/((eyeDistance+(vantageZ-rotatedPoints[i][2]))/eyeDistance);
		var y = ((vantageY-rotatedPoints[i][1]))/((eyeDistance+(vantageZ-rotatedPoints[i][2]))/eyeDistance);
		rasterizedPts[i] = [x+width,y+height];
		//myCanvas.fillRect(x+width,y+height,3,3);
		if (debugFlag == true) {
			//myCanvas.fillText(rotatedPoints[i] + " X: " + x + " Y: " + y,x+10+width,y+height+(i*5));
			myCanvas.fillText(i,x+10+width,y+height);
		}
		
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
	var xRotFactor = -(225*Math.PI)/180;
	var yRotFactor = -(135*Math.PI)/180;
	var rotated = new Array();
	for (var i = 0;i<points.length;i++) {
		
		rotated[i] = [points[i][0]*(Math.cos(hTranslated+xRotFactor)/Math.cos(xRotFactor)),points[i][1]*(Math.cos(hTranslated+yRotFactor)/Math.cos(yRotFactor)),points[i][2],points[i][3],points[i][4],points[i][5]];
		//console.log("i: " + i + " " + points[i][0] + " " + rotated[i][0]);
		if (i%2 != 0) {
			xRotFactor += Math.PI/2;
			yRotFactor += Math.PI/2;
		}
	}
	
	return rotated;
}