/* driver function to initiate all necessary functions. */
function runAll() {
	renderObject(8, 200);
	drawFrame(0,0,-500);
	
	
}
var points = renderObject(8, 200);
// Function to draw sky as backdrop
function drawFrame(vantageX,vantageY,vantageZ) {
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
	myCanvas.fillStyle= "rgb(230,230,230)";
	myCanvas.fill();
	myCanvas.fillStyle= "rgb(0,0,0)";
	/*myCanvas.fillText((Math.sqrt(Math.pow(Math.abs(vantageZ),2)+Math.pow(points[5][0],2))),100,100);
	myCanvas.fillText((Math.sqrt(Math.pow((Math.abs(Math.abs(vantageZ))+points[5][2]),2)+Math.pow(points[5][0],2))),100,150);
	myCanvas.fillText(Math.abs(vantageZ)+points[5][2],100,200);*/
	for (var i=0;i<points.length;i++) {
		var x = ((Math.sqrt(Math.pow(Math.abs(vantageZ),2)+Math.pow(points[i][0],2)))/
		(Math.sqrt(Math.pow(Math.abs(vantageZ)+points[i][2],2)+Math.pow(points[i][0],2))))*points[i][0];
		var y = ((Math.sqrt(Math.pow(Math.abs(vantageZ),2)+Math.pow(points[i][1],2)))/
		(Math.sqrt(Math.pow(Math.abs(vantageZ)+points[i][2],2)+Math.pow(points[i][1],2))))*points[i][1];
		myCanvas.fillRect(x+width,y+height,3,3);
		//myCanvas.fillText(points[i]+" X: " + x+ " Y: " + y,x+10+width,y+height);
	}
	
}
/*Function to creates a 3D object as a 2D array of points in space.
returns the array*/
function renderObject(numOfPoints, size) {
	var points = new Array();
	var x = 0;
	var y = 0;
	var z = 0;
	for (var i =0; i < numOfPoints; i++) {
		var subArray = [x,y,z];
		points[i] = subArray;
		if (i%2 == 0) {
			z = size;
		} else {
			z = 0;
		}
		if (z == 0 && y == 0) {
			y = size;
		} else if (z == 0 && y == size) {
			y = 0;
		}
		if (i >= numOfPoints/2 - 1) {
			x = size;
		} else {
			x = 0;
		}
	}
	return points;
}
