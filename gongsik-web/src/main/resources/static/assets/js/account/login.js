


var _login = function(){
	
	
	$('#loginBtn').on('click', function(event) {
	    event.preventDefault(); // 기본 제출 동작 막기
		_signUp();
	  });
	  
	 $('#loginkakao').on('click',function(event){
		 event.preventDefault();
		 var type = 'kakao';
		 _loginSNS(type);
	 });
  }
var _loginSNS = function(type){
	if(type==='kakao'){
		var url = '/account/login/kakao';
	}
	 $.ajax({
			url: url,
			type: 'GET',
        	contentType: 'application/json'
		}).done(function(response,status,xhr){
			console.log(response);
			location.href = response;
            
		}).fail(function(xhr, textStatus, errorThrowna) {
		            if (xhr.status === 401) {
					        // 비밀번호가 일치하지 않는 경우
					        var errorMessage = xhr.responseJSON.message;
					        alert("로그인 실패 하였습니다.");
					    } else {
					        // 다른 오류인 경우
					        console.error("로그인 오류: " + xhr.status);
					        alert("로그인에 실패하였습니다.");
					    }
		        
		        })
}
var _signUp = function(){
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
                }else{
					$(field).removeClass('is-invalid');
				}
                
            }
        });
    	if (!isValid) {
            return false; // 폼 제출 방지
        }
		var usrId = $("#username").val(); // 사용자 이메일 또는 아이디 입력란
		var usrPwd = $("#password").val(); // 비밀번호 입력란
		var format ={};
		format[usrId]=usrId;
		format[usrPwd]=usrPwd;
		console.log(username);
        $.ajax({
			url: "/api/login",
			type: 'POST',
			data: JSON.stringify({usrId : usrId, usrPwd:usrPwd}), // form 데이터를 JSON 문자열로 변환하여 전송
        	contentType: 'application/json'
		}).done(function(response,status,xhr){
			console.log(response);
			var jwtToken = xhr.getResponseHeader('Authorization');
			var refreshToken = xhr.getResponseHeader('refreshToken');
			console.log("token : " + jwtToken)// 헤더에 있는 토큰을 받아와서
			console.log("refreshToken: " + refreshToken)
 			localStorage.setItem('accessToken', jwtToken)
 			localStorage.setItem('username', response);
            $('#username-display').text('Welcome, ' + response+ '!');
			
            usrData(response, jwtToken, refreshToken);
		}).fail(function(xhr, textStatus, errorThrowna) {
		            if (xhr.status === 401) {
					        // 비밀번호가 일치하지 않는 경우
					        var errorMessage = xhr.responseJSON.message;
					        alert("로그인 실패 하였습니다.");
					    } else {
					        // 다른 오류인 경우
					        console.error("로그인 오류: " + xhr.status);
					        alert("로그인에 실패하였습니다.");
					    }
		        
		        })
}
var usrData = function(response, jwtToken, refreshToken){
	console.log("data" + jwtToken);
	$.ajax({
			url: "/api/account/data",
			type: 'POST',
			data: JSON.stringify({usrId : response, jwtToken : jwtToken, refreshToken : refreshToken}), // form 데이터를 JSON 문자열로 변환하여 전송
        	contentType: 'application/json',
        	headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },
		}).done(function(data){
			console.log(data.usrNm);
			localStorage.setItem("usrnm",data.usrNm);
			window.location.href = '/';
			
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