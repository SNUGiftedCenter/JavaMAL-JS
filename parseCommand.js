var vertices = new Array();
var faces= new Array();
var special=0;



var parseCommand = function(command, size){
faces= new Array();
vertices = new Array();


	var cx = 0, cy = 0, cz = 0, cd = 0; //커서 위치와 방향 표현
//	var size = 1; //블록의 사이즈를 결정
	size = parseFloat(size);
	var bracketC=0;
	setx= new Array();
	sety= new Array();
	setz= new Array();
	setd= new Array();
	var turn = function(direction){	
		if(direction =='left'){
			if(cd == 0){
				cd = 4;
			}
			cd--;
		}
		else if( direction == 'right'){
			if( cd == 3){
				cd = -1;
			}
			cd++;
		}
	}
	var move = function(direction){
		var amount;
		if( direction == 'straight' || direction == 'up' || direction=='tright'){
			amount = size*2;
		}
		else if (direction == 'back' || direction == 'down' || direction=='tleft'){
			amount = -size*2;
		}
		if( direction == 'straight' || direction == 'back'){
			switch(cd){
			case 0:
				cy+=amount;
				break;
			case 1:
				cx+=amount;
				break;
			case 2:
				cy-=amount;
				break;
			case 3:
				cx-=amount;
				break;
			}
		} else if( direction=='tright' || direction=='tleft'){
			switch(cd){
			case 0:
				cx+=amount;
				break;
			case 1:
				cy-=amount;
				break;
			case 2:
				cx-=amount;
				break;
			case 3:
				cy+=amount;
				break;
			}
		} else {
			cz+=amount;
		}
	}	
	for( var i = 0; i < command.length; i++){
		var currentCommand = command.charAt(i);
		if(currentCommand == 's'){
			if(i != 0 ){
				move('straight');
			}
			drawCube(cx,cy,cz,size);
			special=0;
		}
		else if( currentCommand == 'b'){
			move('back');
			drawCube(cx,cy,cz,size);
			special=0;
		}
		else if( currentCommand == 'u'){
			move('up');
			drawCube(cx,cy,cz,size);
			special=0;
		}
		else if( currentCommand == 'd'){
			move('down');
			drawCube(cx,cy,cz,size);
			special=0;
		}
		else if( currentCommand == 'u'){
			move('up');
			drawCube(cx,cy,cz,size);
			special=0;
		}
		else if( currentCommand == 'v'){
			move('straight');
			special=2;
			drawCube(cx,cy,cz,size);
			special=0;
		}
		if(currentCommand == 'q'){
			if(i != 0 )
			{
				move('straight');
			}
			drawCubeq(cx,cy,cz,size);
			special=0;
		}
		else if( currentCommand == 'h'){
			move('straight');
			drawhidec(cx,cy,cz,size);
		}
		else if( currentCommand == 'm'){
			move('straight');
			drawplate(cx,cy,cz,size);
		}
		
		else if( currentCommand == 'L'){
			turn('left');
			special=0;
		}
		else if( currentCommand == 'R'){
			turn('right');
			special=0;
		}
		else if( currentCommand == 'i'){
			special=3;
		}
		else if( currentCommand == 'l'){
			move('tleft'); //turn left
			drawCube(cx,cy,cz,size);
			special=0;
		}
		else if( currentCommand == 'r'){
			move('tright'); //turn right
			drawCube(cx,cy,cz,size);
			special=0;
		}
		else if( currentCommand == '['){
			bracket(cx,cy,cz,cd);
			continue;
		}
		else if( currentCommand == ']'){
			closebracket();
			continue;
		}
		
		
	}

	function bracket(x,y,z,d){ // 브라켓 추가(꺽쇠) By. 박재영
		setx[bracketC]=x;
		sety[bracketC]=y;
		setz[bracketC]=z;
		setd[bracketC]=d;
		bracketC++;

	}
	function closebracket(){ // 브라켓 추가(꺽쇠) By. 박재영
		bracketC--;
		cx=setx[bracketC];
		cy=sety[bracketC];
		cz=setz[bracketC];
		cd=setd[bracketC];
	}
	
}


var drawCube = function(x, y, z, size){
	var v = new Array();
	v[0] = addPoint(x+size,y+size,z);
	v[1] = addPoint(x+size,y-size,z);
	v[2] = addPoint(x-size,y+size,z);
	v[3] = addPoint(x-size,y-size,z);
	v[4] = addPoint(x+size,y+size,z+2*size);
	v[5] = addPoint(x+size,y-size,z+2*size);
	v[6] = addPoint(x-size,y+size,z+2*size);
	v[7] = addPoint(x-size,y-size,z+2*size);
	addSixFaces(v);
}

var drawCubeq = function(x, y, z, size){
	var v = new Array();
	v[0] = addPoint(x+size,y+size,z-size);
	v[1] = addPoint(x+size,y-size,z-size);
	v[2] = addPoint(x-size,y+size,z-size);
	v[3] = addPoint(x-size,y-size,z-size);
	v[4] = addPoint(x+size,y-size,z+size);
	
	addFacesq(v);
}

var drawplate = function(x,y,z, size){ //면그리기
	var v= new Array();
	v[0] = addPoint(x+size,y+size,z);
	v[1] = addPoint(x+size,y-size,z);
	v[2] = addPoint(x-size,y+size,z);
	v[3] = addPoint(x-size,y-size,z);
	addFaces(v);
}
var drawhidec = function(x,y,z, size){ //면그리기
	var v= new Array();
	v[0] = addPoint(x+size,y+size,z);
	v[1] = addPoint(x+size,y-size,z);
	v[2] = addPoint(x-size,y+size,z);
	v[3] = addPoint(x-size,y-size,z);
}

var addPoint = function(x,y,z) {
	for( var i = 0; i < vertices.length; i++){
		if(vertices[i][0] == x && vertices[i][1] == y && vertices[i][2] == z){
			return i+1;
		}
	}
	var newID = vertices.length;
	vertices[newID]=new Array();
	vertices[newID][0]=x;
	vertices[newID][1]=y;
	vertices[newID][2]=z;
	return newID+1;
}

var addSixFaces = function (v) {
	if(special==1){
		addFace(v[4],v[6],v[2],v[0]);
		addFace(v[2],v[0],v[1],v[3]);
		addFace(v[0],v[4],v[1],' ');
		addFace(v[6],v[2],v[3],' ');
		addFace(v[6],v[4],v[1],v[3]);
	}
	if(special==2){
		addFace(v[5],v[7],v[2],v[0]);
		addFace(v[7],v[5],v[1],v[3]);
		addFace(v[5],v[0],v[1],' ');
		addFace(v[7],v[3],v[2],' ');
		addFace(v[3],v[1],v[0],v[2]);
	}
	if(special==0){
		addFace(v[0],v[1],v[3],v[2]);
		addFace(v[3],v[7],v[5],v[1]);
		addFace(v[2],v[6],v[7],v[3]);
		addFace(v[2],v[6],v[4],v[0]);
		addFace(v[0],v[4],v[5],v[1]);
		addFace(v[4],v[5],v[7],v[6]);
	}
}

var addFaces = function (v) {  //면의 면 추가
	addFace(v[0],v[2],v[3],v[1]);
}

var addFacesq = function (v) {  //면의 면 추가
	addFace(v[0],v[2],v[3],v[1]);
	addFace(v[4],v[1],v[3],' ');
	addFace(v[4],v[3],v[2],' ');
	addFace(v[4],v[2],v[0],' ');
	addFace(v[4],v[0],v[1],' ');
}

var addFace = function (v1,v2,v3,v4)
{
	for( var i = 0; i < faces.length; i++){
		if( faces[i][0]==v1 && faces[i][1]==v2 && faces[i][2]==v3 && faces[i][3]==v4 ){
			
			faces[i][0]='';
			faces[i][1]='';
			faces[i][2]='';
			faces[i][3]='';
			
			return null;
		}
		else if(faces[i][3]==v1 && faces[i][2]==v2 && faces[i][1]==v3 && faces[i][0]==v4 ){
			faces[i][0]='';
			faces[i][1]='';
			faces[i][2]='';
			faces[i][3]='';
			return null;
		}
	}
	var newID = faces.length;
	faces[newID]=new Array();
	faces[newID][0]=v1;
	faces[newID][1]=v2;
	faces[newID][2]=v3;
	faces[newID][3]=v4;
}

var print = function (){
	var bufstring = '';
	var crestring = '';
	for(var i = 0; i < vertices.length; i++){
		bufstring += "v " + vertices[i][0] + " " + vertices[i][1] + " " + vertices[i][2] + " ";// + "\n";
		crestring += "v " + vertices[i][0] + " " + vertices[i][1] + " " + vertices[i][2] + " " + "\n";
	}
	for(var i = 0; i < faces.length; i++){
		if(faces[i][3]==' '){
		bufstring += "f " + faces[i][0] + " " + faces[i][1] + " " + faces[i][2] + " ";//+ "\n";
        crestring += "f " + faces[i][0] + " " + faces[i][1] + " " + faces[i][2] + " "+ "\n";
		}
		if(faces[i][3]!=' '){
			if(faces[i][0]=='' && faces[i][1]=='' && faces[i][2]=='' && faces[i][3]=='')
			{
			
			}
			else
			{
				bufstring += "f " + faces[i][0] + " " + faces[i][1] + " " + faces[i][2] + " " +faces[i][3] + " ";//+ "\n";
				crestring += "f " + faces[i][0] + " " + faces[i][1] + " " + faces[i][2] + " " +faces[i][3] + " "+ "\n";
			}
		}
	}
	
	document.getElementById("out").value = '';
	document.getElementById('out').value = bufstring
	document.getElementById("outn").innerHTML = crestring;
	document.getElementById("new").innerHTML = crestring;
	
	
	
}


	
	
	
	
	
	/*var fso=new ActiveXObject('Scripting.FileSystemObject');
	var fileObj=fso.CreateTextFile("D:\\JAVASCRIPToutput.txt",true);
	fileObj.WriteLine(bufstring);
	fileObj.Close();*/
