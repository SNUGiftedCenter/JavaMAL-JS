var ocode,lcode,lcnt;
var i,j,k;
var cletter = [];	//치환문자 저장
var fcode = [];		//최종 파싱한 코드
var crule = [];		//치환문자의 명령어
var ccnt = 0;		//치환문자의 개수
//var codecheck_regx = /^[a-zA-Z]$/;

function gobuttonClick(){
	ocode='';
lcode='0';
lcnt='0';
 i='0';
 j='0';
 k='0';
 cletter = [];	
fcode = [];		
 crule = [];		
 ccnt = 0;	
	ocode = document.getElementById("income").value;
	lcode = ocode.split("\n");
	lcnt = lcode.length;
	parsing();
}

function parsing(){	
	var rcode = [];  //real code : 치환문자(cletter)에 대한 명령어 저장. cletter[c] => rcode[c]가 된다.
	for(i=0;i<1000;i++) rcode[i] = [];//rcode 초기화

	for(i=0;i<lcnt;i++){		//총 "명령줄 수"만큼 반복


		/*
		치환문자열이 먼저 선언된 뒤 do명령어가 오기 때문에,
		이곳 레벨의 for문에서 중가하는 i값에 따라 치환문과 do문이 차례대로 처리된다.
		따라서 치환문자열이 존재하는 곳의 처리 메서드 중에는 재귀를 처리하는 메서드가 없다.(치환문자열이 없는데에서 재귀를 처리한다.)

		★중요 문법사항!!!!!
		[반드시]
		치환문자열 선언은 do명령어 앞에.
		*/


		//치환 문자열이 존재하는가? 그렇다면..///////////////////////////////////////////////////////////////////////////////
		if((lcode[i].indexOf("="))>=0){
			
			var stack = 0;
			var multiple = 1;
			var lhcode = lcode[i].replace(/\s/g,"");//각 문자열을 정규표현식으로 변환(공백제거)
			var chcode = lhcode.split("=");	// =를 기준으로 치환문자와 그 치환문자의 명령어를 구분
			cletter[ccnt] = chcode[0];		//치환문자 저장 (chcode가 split되었으므로 chcode[0]은 치환문자임)
			crule[ccnt] = chcode[1];		//치환문자에 대한 치환 명령 넘김 (chcode[1]은 치환할 명령어임)
			for(j=0;j<crule[ccnt].length;j++){	//crule[ccnt]는 치환할 명령임.그 명령줄 한 글자씩 처리함
				if(crule[ccnt][j]=='s'
				|| crule[ccnt][j]=='b' 
				|| crule[ccnt][j]=='u' 
				|| crule[ccnt][j]=='d'
				|| crule[ccnt][j]=='r'
				|| crule[ccnt][j]=='l' 
				|| crule[ccnt][j]=='m'
				|| crule[ccnt][j]=='h'
				|| crule[ccnt][j]=='v'
				|| crule[ccnt][j]=='q'
				|| crule[ccnt][j]=='L' 
				|| crule[ccnt][j]=='R'
 				|| crule[ccnt][j]=='i'
				|| crule[ccnt][j]=='[' 
				|| crule[ccnt][j]==']'){ 
					rcode[ccnt] = rcode[ccnt] + crule[ccnt][j]; 
				}
				if(crule[ccnt][j]=='0' 
				|| crule[ccnt][j]=='1' 
				|| crule[ccnt][j]=='2' 
				|| crule[ccnt][j]=='3' 
				|| crule[ccnt][j]=='4' 
				|| crule[ccnt][j]=='5' 
				|| crule[ccnt][j]=='6' 
				|| crule[ccnt][j]=='7' 
				|| crule[ccnt][j]=='8' 
				|| crule[ccnt][j]=='9'){
					multiple = crule[ccnt][j] - '0';
					j++;
					for(;;){
						if(crule[ccnt][j]=='(') {
							stack++;
						}
						if(crule[ccnt][j]==')') {
							stack--;
						}
						if(crule[ccnt][j]=='s'
						|| crule[ccnt][j]=='b' 
						|| crule[ccnt][j]=='u' 
						|| crule[ccnt][j]=='d'
						|| crule[ccnt][j]=='r'
						|| crule[ccnt][j]=='l' 
						|| crule[ccnt][j]=='m'
						|| crule[ccnt][j]=='h'
						|| crule[ccnt][j]=='v'
						|| crule[ccnt][j]=='q'
						|| crule[ccnt][j]=='L' 
						|| crule[ccnt][j]=='R'
 						|| crule[ccnt][j]=='i'
						|| crule[ccnt][j]=='[' 
						|| crule[ccnt][j]==']'){ 
							for(k=0;k<multiple;k++) {
								rcode[ccnt] = rcode[ccnt] + crule[ccnt][j];
							} 
						}
						if(stack==0)break;
						j++;
					}
				}
			}
			rcode[ccnt] = "(" + rcode[ccnt] + ")";
			
			while(1){	//무한반복/////////////////////////////////////////////////////
				if(rcode[ccnt].indexOf('1')!=-1 
				|| rcode[ccnt].indexOf('2')!=-1 
				|| rcode[ccnt].indexOf('3')!=-1 
				|| rcode[ccnt].indexOf('4')!=-1 
				|| rcode[ccnt].indexOf('5')!=-1 
				|| rcode[ccnt].indexOf('6')!=-1 
				|| rcode[ccnt].indexOf('7')!=-1 
				|| rcode[ccnt].indexOf('8')!=-1 
				|| rcode[ccnt].indexOf('9')!=-1){//치환문자 앞에 숫자가 "있는경우"

					var a_array = [];	//반복한것 저장
					var a_dn=0;			//반복 횟수저장
					var rcode_length = rcode[ccnt].length;
					
					var gexist=0;	//괄호 존재 여부
					var gbegin;		//괄호 처음 위치
					var gfinish;	//괄호 끝 위치
					
					for(j=0;j<rcode_length;j++){//j가 문자열 조사 커서임
						if(rcode[ccnt][j]=='('){
							gexist=1;	//괄호 존재함!
							gbegin=j;	//괄호 처음 위치를 저장
						}
						if(rcode[ccnt][j]==')'){
							gfinish=j;	//괄호 끝 위치를 저장
							break;		//괄호 끝났으니 조사도 끝남.
						}
					}
					
					if(gexist==0){	//위에서 조사했는데 괄호 없는경우
						var numexist=0;	//숫자 존재 여부 판단
						var numbegin;	//숫자 처음 위치
						var numfinish;	//숫자 끝 위치(두자릿수 숫자인경우 위의 변수와 같이 사용)
						
						for(j=0;j<rcode_length;j++){	//j가 문자열 조사 커서임
							if(numexist==0 && isNaN(rcode[ccnt][j])==false){//숫자가 처음으로 존재함
								numexist=1; //숫자 있음 표시
								numbegin=j;	//숫자 첫 위치 저장
								numfinish=j;//숫자 끝 위치 저장
/**/							a_dn = parseInt(rcode[ccnt][j]); //숫자 한자리씩 저장한다(기존 숫자 10 곱한 후 더함)
							}
							else if(numexist==1 && isNaN(rcode[ccnt][j])==false){//숫자가 또 존재함
								a_dn = a_dn*10 + parseInt(rcode[ccnt][j]);	//기존 수 *10 + 현재 자리 숫자
								numfinish=j;	//숫자 끝 위치 업데이트
							}
							else if(numexist==1 && isNaN(rcode[ccnt][j])==true){//숫자나오다가 딴것이 왔음
								break;	//숫자판별 끝! 루프 종료
							}
						}
						
						for(j=0;j<a_dn;j++){	//"드디어 반복한다~!!!!!!!" a_dn이 0에서부터 a_dn미만까지.
							a_array = a_array + rcode[ccnt][numfinish+1];
							//지금 처리하고 있는 명령줄 rcode[ccnt]에서 숫자 뒤의 문자를 반복횟수만큼 그냥 넣는다.
							//괄호 없으니까 그냥 한 문자만 열라게 들어가면 된다!
						}
						
						var carray = rcode[ccnt].substring(numbegin,numfinish+2);//숫자시작자리부터 숫자 뒤뒤자리까지 복사
						var rarray = rcode[ccnt].replace(new RegExp(carray, 'g'), a_array);
						rcode[ccnt] = [];	//rcode 청소하고,
						rcode[ccnt] = rarray;//rcode에 결과값을 넣고
						continue;			//다른 숫자 있는지 판별하는 곳으로 돌아간다.
					}


					else if(gexist==1){//괄호가 존재할경우 - ★무조건 괄호 앞 반복수가 존재해야
						var intcheck = [];	//정수냐?
						var intcnt=0;		//정수 저장"횟수" 저장한다.
						for(j=gbegin-1;j>=0;j--){	// 괄호 앞부터, 앞으로 가면서 숫자가 어딨는지 찾는다
							if(isNaN(rcode[ccnt][j])==false){//숫자다.
								intcheck[intcnt] = rcode[ccnt][j];	//intcnt칸에 숫자를 일단 저장한다.
								intcnt++;			//intcnt라는 커서값을 늘린다.
							}
							else break;		//숫자아니네? 그러면 끝.
						}
						/*
						위 단락 for문의 의미 설명

						일단 반복할 괄호 앞에 놓여 있는123456이라는 숫자를 저장려고 한다고 하자.
						현재 이 숫자는 "문자열"상태이므로 문자의 형태로만 접근할 수 있는데,
						심지어 뒤에서부터 읽어나와야 하기 때문에 좀 복잡하다.(숫자의 시작점이 어딘지 아직 모른다.)
						그래서, 숫자라고 판명날때마다 intcnt를 증가시켜
						intcheck라는 buffer에 123456이라는 "숫자 문자열"을
						654321로 저장한 뒤 다음 for문에서 이를 정수형태로 변환할 것이다.
						*/

							//뒤에서부터 읽어나가며 "정상적인" 정수를 완성한다.
						for(j=intcnt-1;j>=0;j--)	a_dn = a_dn*10 + parseInt(intcheck[j]);
						
						for(j=1;j<=a_dn;j++){//아, 기다리고 기다리던 반복이다. 1부터 '위에서 구한 숫자' 이하까지.
							a_array = a_array + rcode[ccnt].substring(gbegin+1,gfinish);//괄호시작점부터 끝점까지 substring으로 버퍼에 집어넣는다.
						}
						
						var carray = rcode[ccnt].substring(gbegin-intcnt,gfinish+1);//숫자시작점부터 괄호끝까지 복사.
						var rarray = rcode[ccnt].replace(/\(/g, "\(");//괄호를 검색해서 정규표현식에 그대로 꽂아넣을수 있는 형태로 바꿈.
						rcode[ccnt] = [];
						rcode[ccnt] = rarray; //rcode에 저장.
						rarray = rcode[ccnt].replace(/\)/g, "\)");
						rcode[ccnt] = [];
						rcode[ccnt] = rarray; //rcode에 저장.
						rarray = rcode[ccnt].replace(new RegExp(carray, 'g'), a_array); //정규표현식 추출.
						rcode[ccnt] = [];
						rcode[ccnt] = rarray;
						continue;
					}
				}
				else break;	//숫자없는경우 끝!
			}
			ccnt++;
		}//ENDOF if((lcode[i].indexOf("="))>=0) //치환 문자열 판별
		


		//치환할 문자 지정이 없는 명령줄이다. 그렇다면....////////////////////////////////////////////////////////////////////////////
		else{		

			var dn = 0;	//do_n에서 n의 값
			var mcode = [];
			var mcnt = 0;
			var flag=0;
			
				mcnt = 0;
				for(j=3;j<lcode[i].length;j++){
					if(lcode[i][j]!=" "){ //공백은 제외하고
						mcode = mcode + lcode[i][j]; //실행할 코드에 문자 하나씩 넣는다.
					}
				}
				for(j=0;j<ccnt;j++){
					if(mcode.indexOf(cletter[j])>=0){
						//mmcode = mcode.replace(new RegExp(cletter[j],'g'),rcode[j]);
						//mcode = mmcode;
						mcode = mcode.replace(new RegExp(cletter[j],'g'),rcode[j]);
					}
				}
				fcode = fcode + mcode; //마무리 코드 저장.
			}
			
			while(1){	//무한반복/////////////////////////////////////////////////////
				//if(!codecheck_regx.test(fcode)){
				if(fcode.indexOf("1")!=-1 
				|| fcode.indexOf('2')!=-1 
				|| fcode.indexOf('3')!=-1 
				|| fcode.indexOf('4')!=-1 
				|| fcode.indexOf('5')!=-1 
				|| fcode.indexOf('6')!=-1 
				|| fcode.indexOf('7')!=-1 
				|| fcode.indexOf('8')!=-1 
				|| fcode.indexOf('9')!=-1){//치환문자 앞에 숫자가 "있는경우"

					var a_array = [];	//반복한것 저장
					var a_dn=0;			//반복 횟수저장
					var fcode_length = fcode.length;
					
					var gexist=0;	//괄호 존재 여부
					var gbegin;		//괄호 처음 위치
					var gfinish;	//괄호 끝 위치
					
					for(j=0;j<fcode_length;j++){//j가 문자열 조사 커서임
						if(fcode[j]=='('){
							gexist=1;	//괄호 존재함!
							gbegin=j;	//괄호 처음 위치를 저장
						}
						
						if(fcode[j]==')'){
							gfinish=j;	//괄호 끝 위치를 저장
							break;		//괄호 끝났으니 조사도 끝남.
						}
					}
					
					if(gexist==0){	//위에서 조사했는데 괄호 없는경우
						var numexist=0;	//숫자 존재 여부 판단
						var numbegin;	//숫자 처음 위치
						var numfinish;	//숫자 끝 위치(두자릿수 숫자인경우 위의 변수와 같이 사용)
						for(j=0;j<fcode_length;j++){	//j가 문자열 조사 커서임
							if(numexist==0 && isNaN(fcode[j])==false){//숫자가 처음으로 존재함
								numexist=1; //숫자 있음 표시
								numbegin=j;	//숫자 첫 위치 저장
								numfinish=j;//숫자 끝 위치 저장
								a_dn = parseInt(fcode[j]); //숫자 한자리씩 저장한다(기존 숫자 10 곱한 후 더함)
							}
							else if(numexist==1 && isNaN(fcode[j])==false){//숫자가 또 존재함
								a_dn = a_dn*10 + parseInt(fcode[j]);	//기존 수 *10 + 현재 자리 숫자
								numfinish=j;	//숫자 끝 위치 업데이트
							}
							else if(numexist==1 && isNaN(fcode[j])==true){//숫자나오다가 딴것이 왔음
								break;	//숫자판별 끝! 루프 종료
							}
						}
						
						for(j=0;j<a_dn;j++){	//"드디어 반복한다~!!!!!!!" a_dn이 0에서부터 a_dn미만까지.
							a_array = a_array + fcode[numfinish+1];
							//지금 처리하고 있는 명령줄 rcode[ccnt]에서 숫자 뒤의 문자를 반복횟수만큼 그냥 넣는다.
							//괄호 없으니까 그냥 한 문자만 열라게 들어가면 된다!
						}
						
						var carray = fcode.substring(numbegin,numfinish+2);//숫자시작자리부터 숫자 뒤뒤자리까지 복사
						var rarray = fcode.replace(new RegExp(carray, 'g'), a_array);
						fcode = [];		//rcode 청소하고,
						fcode = rarray;	//rcode에 결과값을 넣고
						continue;		//다른 숫자 있는지 판별하는 곳으로 돌아간다.
					}
					else if(gexist==1){//괄호가 존재할경우 - ★무조건 괄호 앞 반복수가 존재해야
						var intcheck = [];	//정수냐?
						var intcnt=0;		//정수 저장"횟수" 저장한다.
						for(j=gbegin-1;j>=0;j--){	// 괄호 앞부터, 앞으로 가면서 숫자가 어딨는지 찾는다
							if(isNaN(fcode[j])==false){//숫자다.
								intcheck[intcnt] = fcode[j];	//intcnt칸에 숫자를 일단 저장한다.
								intcnt++;			//intcnt라는 커서값을 늘린다.
							}
							else break;		//숫자아니네? 그러면 끝.
						}
							//뒤에서부터 읽어나가며 "정상적인" 정수를 완성한다.
						for(j=intcnt-1;j>=0;j--)	a_dn = a_dn*10 + parseInt(intcheck[j]);
						
						for(j=1;j<=a_dn;j++){//아, 기다리고 기다리던 반복이다. 1부터 '위에서 구한 숫자' 이하까지.
							a_array = a_array + fcode.substring(gbegin+1,gfinish);
						}
						
						var darray = fcode.substring(gbegin-intcnt,gfinish+1);//숫자시작점부터 괄호끝까지 복사.
						//var rarray = fcode.replace(new RegExp(carray, 'g'), a_array);
						darray = replaceAll(darray, "(", "\\(");
						darray = replaceAll(darray, ")", "\\)"); //정규표현식 필터링
						var earray = fcode.replace(new RegExp(darray,'g'), a_array);//정규표현식 추출.
						fcode = [];
						fcode = earray;	//저장. 앞에서 별 처리를 다했으므로 여기까지온 코드는 최종코드로 바로 승격(?).
						continue;
					}
				}
				else break;
			
		}
	}
}

function replaceAll(sValue, param1, param2){
	return sValue.split(param1).join(param2);
}