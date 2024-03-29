


var _login = function() {


	$('#loginBtn').on('click', function(event) {
		event.preventDefault(); // 기본 제출 동작 막기
		_signUp();
	});

	$('#loginkakao').on('click', function(event) {
		event.preventDefault();
		var type = 'kakao';
		_loginSNS(type);
	});
}
var _loginSNS = function(type) {
	if (type === 'kakao') {
		var url = '/account/login/kakao';
	}
	$.ajax({
		url: url,
		type: 'GET',
		contentType: 'application/json'
	}).done(function(response, status, xhr) {
		console.log(response);
		location.href = response;

	}).fail(function(xhr, textStatus, errorThrowna) {
		if (xhr.status === 401) {
			// 비밀번호가 일치하지 않는 경우
			var errorMessage = xhr.responseJSON.message;
			alert("로그인 실패 하였습니다.");
		} else {
			// 다른 오류인 경우
			alert("로그인에 실패하였습니다.");
		}

	})
}
var _signUp = function() {
	var fields = $('#loginForm').find('input'); // 폼 내 모든 input 요소 가져오기
	var isValid = true;
	fields.each(function(index, field) {
		if (field.type !== 'submit' && field.type !== 'button') {
			// 제출 버튼이 아닌 경우에만 확인
			if ($(field).val() === '') {
				event.stopPropagation(); // 폼 제출 방지
				isValid = false;
				// 필드가 비어 있을 때 처리 (예: 유효하지 않음을 표시)
				$(field).addClass('is-invalid');
			} else {
				$(field).removeClass('is-invalid');
			}

		}
	});
	if (!isValid) {
		return false; // 폼 제출 방지
	}
	var usrId = $("#username").val(); // 사용자 이메일 또는 아이디 입력란
	var usrPwd = $("#password").val(); // 비밀번호 입력란
	var format = {};
	format[usrId] = usrId;
	format[usrPwd] = usrPwd;
	console.log(username);
	$.ajax({
		url: "/api/login",
		type: 'POST',
		data: JSON.stringify({ usrId: usrId, usrPwd: usrPwd }), // form 데이터를 JSON 문자열로 변환하여 전송
		contentType: 'application/json'
	}).done(function(response, status, xhr) {
		console.log(response);
		var jwtToken = xhr.getResponseHeader('Authorization');
//		var refreshToken = xhr.getResponseHeader('refreshToken');
		localStorage.setItem('accessToken', jwtToken)
		console.log("accessToken : "+ jwtToken )
		$('#username-display').text('Welcome, ' + response + '!');

		usrData(response, jwtToken);
	}).fail(function(xhr, textStatus, errorThrowna) {
		if (xhr.status === 401) {
			// 비밀번호가 일치하지 않는 경우
			alert("로그인 실패 하였습니다.");
		} else {
			// 다른 오류인 경우
			alert("로그인에 실패하였습니다.");
		}

	})
}
var usrData = function(response, jwtToken) {
	$.ajax({
		url: "/api/account/data",
		type: 'POST',
		data: JSON.stringify({ usrId: response, jwtToken: jwtToken }), // form 데이터를 JSON 문자열로 변환하여 전송
		contentType: 'application/json',
		headers: {
			'Authorization': jwtToken,
		},
	}).done(function(data) {
		localStorage.setItem("usrId", data.usrId);
		localStorage.setItem("logTp", data.logTp);
		localStorage.setItem("usrRole", data.usrRole);
		console.log("usrRol12e : : " + localStorage.getItem('usrRole'));
		console.log("usrRole : : " + data.usrRole)
		sessionStorage.removeItem('cachedData');
		_menuList(data.usrRole)
		if (data.usrRole === 'USER') {
			window.location.href = '/';
		}else{
			window.location.href = '/admin';
		}

	}).fail(function(xhr, textStatus, errorThrowna) {
		var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
		alert(errorMessage);

	})


}


//function getCookie(){
//	const headers = new Headers();
//   const authorizationHeader = headers.get('Authorization');
//  console.log("인증 : " + authorizationHeader);
// return authorizationHeader;
//S}
$(document).ready(function() {
	_login();
});