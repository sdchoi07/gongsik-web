var _main = function() {

	$('#usrBtn').on('click',function(event){
		event.preventDefault();
		_usrBtn();
	});
}



//인증번호 요청
var _usrBtn = function(){
	const token = localStorage.getItem('accessToken')
	const test= localStorage.getItem('data')
	console.log("test " + JSON.parse(test))
	//console.log(JSON.stringify(test));
	//console.log(test.usrId);
	$.ajax({
		url : "/api/main/chk",
	    type: 'GET',
	    headers: {
            'Authorization': 'Bearer ' + token
        },
	}).done(function(data,textStatus,xhr){
		if(xhr.status === 200){
				window.location.href = '/mypage';
		}else{
			window.location.href = '/account/login';
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
            // HTTP 상태 코드가 400인 경우 처리
            if (xhr.status === 401) {
        // HTTP 상태 코드가 401(Unauthorized)인 경우
        alert(xhr.responseText);
        window.location.href = '/account/login'; // 추가적인 처리
            // 혹은 원하는 다른 오류 처리
        } else {
            // 다른 HTTP 상태 코드에 대한 처리
        }
    });
}


$(document).ready(function() {
	_main();
	 
});