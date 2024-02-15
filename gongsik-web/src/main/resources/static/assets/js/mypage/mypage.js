var mypage = function () {
	
	
	//유저정보
	_accountList();
	
	var currentUrl = window.location.href;
	
	_tabList(currentUrl);
	
	//회원 총 포인트 
	_totalPoint();

}

var _totalPoint = function(){
	var usrId = localStorage.getItem("usrId");
	var logTp = localStorage.getItem("logTp");
	var token = localStorage.getItem("accessToken");
	var resultData = {};
	resultData.usrId = usrId;
	resultData.logTp = logTp;
	$.ajax({
		url : "/api/mypage/profile/pointPt",
	    type: 'POST',
        data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
	}).done(function(data){
			
		if(data.code === 'success'){
			 var point = data.poinTotal;
	  		$('#myPoint').text(point);
	  	
		}else{
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
       if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
            alert(errorMessage);
        } else {
        }
    });
}
var _accountList = function(){
		
	var usrId = localStorage.getItem("usrId");
	var logTp = localStorage.getItem("logTp");
	var token = localStorage.getItem("accessToken");
	var resultData = {};
	resultData.usrId = usrId;
	resultData.logTp = logTp;
	$.ajax({
		url : "/api/mypage/profile/list",
	    type: 'POST',
        data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
	}).done(function(data){
			
		if(data.code === 'success'){
			 var usrGrade = data.result.usrGrade;
	  		$('#levelNumber').text(usrGrade);
	  	
		}else{
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
       if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
            alert(errorMessage);
        } else {
        }
    });
}





$(document).ready(function () {
    mypage();
});
