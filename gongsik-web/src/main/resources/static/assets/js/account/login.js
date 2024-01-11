


var _login = function(){
	
	$('#loginBtn').on('click', function(event) {
	    event.preventDefault(); // 기본 제출 동작 막기
	
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
		var username = $("#username").val(); // 사용자 이메일 또는 아이디 입력란
		var password = $("#password").val(); // 비밀번호 입력란
		console.log(username);
        $.ajax({
			url: "/api/account/login",
			type: 'POST',
			data: {username :  username, password : password}, // form 데이터를 JSON 문자열로 변환하여 전송
        	
		}).done(function(data){
			console.log("Username:", data.username);
            console.log("Roles:", data.roles);
          $('#username-display').text('Welcome, ' + data.username + '!');
            console.log(data);
			window.location.href = '/';
		}).fail(function(xhr, textStatus, errorThrowna) {
		            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
		            alert(errorMessage);
		        
		        })
			
	  });
  }
  
$(document).ready(function() {
  _login();
});