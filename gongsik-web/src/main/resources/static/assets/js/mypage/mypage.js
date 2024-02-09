var mypage = function () {
	
	
	//유저정보
	_accountList();
	
	var currentUrl = window.location.href;
	
	_tabList(currentUrl);

}


var _tabMove = function (targetUrl) {
    $.ajax({
        url: '/mypage' + targetUrl, // 실제로는 해당 URL을 탭에 맞게 수정해야 합니다.
        type: 'GET',
        success: function (data) {
            // 서버로부터 받아온 데이터로 탭 내용 업데이트
            $('.tab-content').html(data);
        },
        error: function () {
            alert('탭 내용을 로드하는 중에 오류가 발생했습니다.');
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
