var init = function(){
	
	/* 배송지 조회 */
	_delvList();
	
}



var _delvList = function(){
    var resultData = {};
    
    var usrId = localStorage.getItem("usrId");
    var token = localStorage.getItem("accessToken");
    resultData.usrId = usrId;
    $.ajax({
        url: '/api/mypage/delv/delvList',
        type: 'POST',
        data: JSON.stringify(resultData),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		_tableData(data);

    }).fail(function (xhr, textStatus, errorThrowna) {
        if (xhr.status === 403) {
			var msg = "로그인을 다시 해주세요.";
			if(confirm(msg)){
	           	window.location.href = '/account/login';
           	}
        } else {
            // 그 외의 경우 처리
        }
    });
}

























$(document).ready(function () {
    init();
});
